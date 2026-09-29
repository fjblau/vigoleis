"use server";

import { createHash, randomBytes, randomUUID } from "node:crypto";

import { hasWriteAccess, writeClient } from "@/sanity/lib/write-client";
import { customerByEmailQuery, productPricesByIdsQuery } from "@/sanity/lib/queries";
import { mailConfiguration, merchantEmail, sendShopEmail } from "./mail";

interface CheckoutItemInput {
  productId: string;
  quantity: number;
}

interface CheckoutAddressInput {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CheckoutCustomerInput {
  name: string;
  email: string;
  phone: string;
  shippingAddress: CheckoutAddressInput;
  billingAddress: CheckoutAddressInput;
}

export interface CreateOrderInput {
  requestId: string;
  customer: CheckoutCustomerInput;
  items: CheckoutItemInput[];
}

export type CreateOrderResult =
  | {
      success: true;
      orderId: string;
      orderNumber: string;
      total: number;
      email: string;
      confirmationEmailSent: boolean;
      merchantEmailSent: boolean;
    }
  | { success: false; error: string };

interface ProductPrice {
  _id: string;
  title: string;
  price: number;
  inventory: number | null;
}

interface StoredOrder {
  _id: string;
  orderNumber: string;
  total: number;
  customerEmail: string;
  merchantNotificationStatus?: string;
  customerNotificationStatus?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUEST_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ValidationResult =
  | { ok: true; customer: CheckoutCustomerInput; items: CheckoutItemInput[] }
  | { ok: false; error: string };

function validateInput(input: CreateOrderInput): ValidationResult {
  const customer = input?.customer;
  const name = typeof customer?.name === "string" ? customer.name.trim() : "";
  const email = typeof customer?.email === "string" ? customer.email.trim().toLowerCase() : "";
  const phone = typeof customer?.phone === "string" ? customer.phone.trim() : "";
  if (name.length < 2 || name.length > 200) return { ok: false, error: "Please enter your full name." };
  if (!EMAIL_RE.test(email) || email.length > 254) return { ok: false, error: "Please enter a valid email address." };
  if (!phone || phone.length > 60) return { ok: false, error: "Please enter your phone number." };

  function address(value: CheckoutAddressInput | undefined) {
    if (!value || typeof value !== "object") return null;
    const fields = [value.street, value.city, value.postalCode, value.country];
    if (fields.some((field) => typeof field !== "string" || !field.trim() || field.length > 200)) return null;
    return {
      street: value.street.trim(),
      city: value.city.trim(),
      postalCode: value.postalCode.trim(),
      country: value.country.trim(),
    };
  }
  const shippingAddress = address(customer.shippingAddress);
  const billingAddress = address(customer.billingAddress);
  if (!shippingAddress || !billingAddress) {
    return { ok: false, error: "Please complete your shipping and billing addresses." };
  }

  const rawItems = Array.isArray(input?.items) ? input.items : [];
  if (rawItems.length === 0 || rawItems.length > 50) return { ok: false, error: "Your cart is empty or too large." };
  const items: CheckoutItemInput[] = [];
  const seen = new Set<string>();
  for (const raw of rawItems) {
    if (typeof raw?.productId !== "string" || !raw.productId || !Number.isInteger(raw.quantity) || raw.quantity < 1 || raw.quantity > 100 || seen.has(raw.productId)) {
      return { ok: false, error: "Invalid item in cart." };
    }
    seen.add(raw.productId);
    items.push({ productId: raw.productId, quantity: raw.quantity });
  }
  return { ok: true, customer: { name, email, phone, shippingAddress, billingAddress }, items };
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function resultFromOrder(order: StoredOrder): CreateOrderResult {
  return {
    success: true,
    orderId: order._id,
    orderNumber: order.orderNumber,
    total: order.total,
    email: order.customerEmail,
    confirmationEmailSent: order.customerNotificationStatus === "sent",
    merchantEmailSent: order.merchantNotificationStatus === "sent",
  };
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  if (!hasWriteAccess) return { success: false, error: "Checkout is not available: order storage is not configured." };
  const config = mailConfiguration();
  if (!config) return { success: false, error: "Checkout is not available: email delivery or shop URL is not configured." };
  if (!REQUEST_ID_RE.test(input?.requestId ?? "")) return { success: false, error: "Invalid request. Please refresh checkout and try again." };
  const validated = validateInput(input);
  if (!validated.ok) return { success: false, error: validated.error };
  const { customer, items } = validated;
  const orderId = `order.${createHash("sha256").update(input.requestId).digest("hex")}`;
  let storedOrder: StoredOrder | null = null;

  try {
    const existing = await writeClient.getDocument<StoredOrder>(orderId);
    if (existing) {
      if (existing.customerEmail !== customer.email) return { success: false, error: "This request has already been submitted." };
      return resultFromOrder(existing);
    }

    const products = await writeClient.fetch<ProductPrice[]>(productPricesByIdsQuery, { ids: items.map((item) => item.productId) });
    const byId = new Map(products.map((product) => [product._id, product]));
    const lineItems: Array<{ _key: string; product: { _type: "reference"; _ref: string }; title: string; price: number; quantity: number }> = [];
    let total = 0;
    for (const item of items) {
      const product = byId.get(item.productId);
      if (!product) return { success: false, error: "An item in your cart is no longer available." };
      if (product.inventory != null && product.inventory <= 0) return { success: false, error: `"${product.title}" is out of stock.` };
      const price = Number(product.price);
      if (!Number.isFinite(price) || price < 0) return { success: false, error: `Could not determine the price for "${product.title}".` };
      lineItems.push({ _key: randomUUID(), product: { _type: "reference", _ref: product._id }, title: product.title, price: round2(price), quantity: item.quantity });
      total += price * item.quantity;
    }
    total = round2(total);

    const existingCustomer = await writeClient.fetch<{ _id: string } | null>(customerByEmailQuery, { email: customer.email });
    const customerId = existingCustomer?._id ?? (await writeClient.create({
      _type: "customer", name: customer.name, email: customer.email, phone: customer.phone, address: customer.shippingAddress,
    }))._id;
    const token = randomBytes(32).toString("hex");
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomUUID().split("-")[0].toUpperCase()}`;
    const candidate = await writeClient.createIfNotExists({
      _id: orderId,
      _type: "order",
      orderNumber,
      items: lineItems,
      total,
      status: "pending",
      customer: { _type: "reference", _ref: customerId },
      customerEmail: customer.email,
      phone: customer.phone,
      shippingAddress: { name: customer.name, ...customer.shippingAddress },
      billingAddress: { name: customer.name, ...customer.billingAddress },
      cancellationTokenHash: createHash("sha256").update(token).digest("hex"),
      merchantNotificationStatus: "pending",
      customerNotificationStatus: "pending",
      createdAt: new Date().toISOString(),
    });
    storedOrder = candidate as StoredOrder;
    if (candidate.orderNumber !== orderNumber) {
      if (candidate.customerEmail !== customer.email) return { success: false, error: "This request has already been submitted." };
      return resultFromOrder(candidate as StoredOrder);
    }

    const addressText = (address: { name: string } & CheckoutAddressInput) =>
      `${address.name}\n${address.street}\n${address.postalCode} ${address.city}\n${address.country}`;
    const lines = lineItems.map((item) => `${item.quantity} × ${item.title} — €${item.price.toFixed(2)} each`).join("\n");
    const cancellationUrl = `${config.origin}/shop/cancel/${token}`;
    const deliveries = await Promise.allSettled([
      sendShopEmail(config, merchantEmail, `Purchase request ${orderNumber}`,
        `Purchase request ${orderNumber}\n\n${lines}\n\nItem subtotal: €${total.toFixed(2)} (shipping to be confirmed)\n\nCustomer: ${customer.name}\nEmail: ${customer.email}\nPhone: ${customer.phone}\n\nShipping:\n${addressText({ name: customer.name, ...customer.shippingAddress })}\n\nBilling:\n${addressText({ name: customer.name, ...customer.billingAddress })}\n\nNo payment has been taken.`, `purchase-${orderId}-merchant`),
      sendShopEmail(config, customer.email, `Your purchase request ${orderNumber}`,
        `Thank you for your purchase request ${orderNumber}.\n\n${lines}\n\nItem subtotal: €${total.toFixed(2)}. Shipping and availability will be confirmed manually; we will contact you about invoicing. No payment has been taken.\n\nTo cancel your request before it is marked paid, visit:\n${cancellationUrl}`, `purchase-${orderId}-customer`),
    ]);
    const merchantSent = deliveries[0].status === "fulfilled";
    const customerSent = deliveries[1].status === "fulfilled";
    for (const [index, delivery] of deliveries.entries()) {
      if (delivery.status === "rejected") console.error(`Purchase request ${orderId} email ${index} failed:`, delivery.reason);
    }
    try {
      await writeClient.patch(orderId).set({
        merchantNotificationStatus: merchantSent ? "sent" : "failed",
        customerNotificationStatus: customerSent ? "sent" : "failed",
      }).commit();
    } catch (error) {
      console.error(`Failed to record purchase request ${orderId} notification status:`, error);
    }
    return {
      success: true,
      orderId: storedOrder._id,
      orderNumber: storedOrder.orderNumber,
      total: storedOrder.total,
      email: storedOrder.customerEmail,
      merchantEmailSent: merchantSent,
      confirmationEmailSent: customerSent,
    };
  } catch (error) {
    console.error("Failed to submit purchase request:", error);
    if (storedOrder) return resultFromOrder(storedOrder);
    try {
      const persisted = await writeClient.getDocument<StoredOrder>(orderId);
      if (persisted?.customerEmail === customer.email) return resultFromOrder(persisted);
    } catch (lookupError) {
      console.error("Failed to check purchase request persistence:", lookupError);
      return { success: false, error: "Request status is uncertain. Please contact the shop before trying again." };
    }
    return { success: false, error: "Could not submit your request. Please try again." };
  }
}
