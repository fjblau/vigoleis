"use server";

import { createHash, randomBytes, randomUUID } from "node:crypto";

import { hasWriteAccess, writeClient } from "@/sanity/lib/write-client";
import { customerByEmailQuery, productPricesByIdsQuery } from "@/sanity/lib/queries";
import { mailConfiguration, merchantEmail, sendShopEmail } from "./mail";
import { shippingCost } from "./shipping";

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
      subtotal: number;
      shippingCost: number | null;
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
  subtotal?: number;
  shippingCost?: number | null;
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
  if (name.length < 2 || name.length > 200) return { ok: false, error: "Bitte geben Sie Ihren vollständigen Namen ein." };
  if (!EMAIL_RE.test(email) || email.length > 254) return { ok: false, error: "Bitte geben Sie eine gültige E-Mail-Adresse ein." };
  if (phone.length > 60) return { ok: false, error: "Die Telefonnummer darf höchstens 60 Zeichen enthalten." };

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
    return { ok: false, error: "Bitte vervollständigen Sie Ihre Liefer- und Rechnungsadresse." };
  }

  const rawItems = Array.isArray(input?.items) ? input.items : [];
  if (rawItems.length === 0 || rawItems.length > 50) return { ok: false, error: "Ihr Warenkorb ist leer oder enthält zu viele Artikel." };
  const items: CheckoutItemInput[] = [];
  const seen = new Set<string>();
  for (const raw of rawItems) {
    if (typeof raw?.productId !== "string" || !raw.productId || !Number.isInteger(raw.quantity) || raw.quantity < 1 || raw.quantity > 100 || seen.has(raw.productId)) {
      return { ok: false, error: "Ein Artikel im Warenkorb ist ungültig." };
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
    subtotal: order.subtotal ?? order.total,
    shippingCost: order.shippingCost ?? null,
    email: order.customerEmail,
    confirmationEmailSent: order.customerNotificationStatus === "sent",
    merchantEmailSent: order.merchantNotificationStatus === "sent",
  };
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  if (!hasWriteAccess) return { success: false, error: "Die Kaufanfrage ist derzeit nicht verfügbar, da die Auftragsspeicherung nicht konfiguriert ist." };
  const config = mailConfiguration();
  if (!config) return { success: false, error: "Die Kaufanfrage ist derzeit nicht verfügbar, da der E-Mail-Versand oder die Shop-URL nicht konfiguriert ist." };
  if (!REQUEST_ID_RE.test(input?.requestId ?? "")) return { success: false, error: "Ungültige Anfrage. Bitte laden Sie die Seite neu und versuchen Sie es erneut." };
  const validated = validateInput(input);
  if (!validated.ok) return { success: false, error: validated.error };
  const { customer, items } = validated;
  const orderId = `order.${createHash("sha256").update(input.requestId).digest("hex")}`;
  let storedOrder: StoredOrder | null = null;

  try {
    const existing = await writeClient.getDocument<StoredOrder>(orderId);
    if (existing) {
      if (existing.customerEmail !== customer.email) return { success: false, error: "Diese Anfrage wurde bereits übermittelt." };
      return resultFromOrder(existing);
    }

    const products = await writeClient.fetch<ProductPrice[]>(productPricesByIdsQuery, { ids: items.map((item) => item.productId) });
    const byId = new Map(products.map((product) => [product._id, product]));
    const lineItems: Array<{ _key: string; product: { _type: "reference"; _ref: string }; title: string; price: number; quantity: number }> = [];
    let total = 0;
    for (const item of items) {
      const product = byId.get(item.productId);
      if (!product) return { success: false, error: "Ein Artikel in Ihrem Warenkorb ist nicht mehr verfügbar." };
      if (product.inventory != null && product.inventory <= 0) return { success: false, error: `"${product.title}" ist derzeit nicht auf Lager.` };
      const price = Number(product.price);
      if (!Number.isFinite(price) || price < 0) return { success: false, error: `Der Preis für "${product.title}" konnte nicht ermittelt werden.` };
      lineItems.push({ _key: randomUUID(), product: { _type: "reference", _ref: product._id }, title: product.title, price: round2(price), quantity: item.quantity });
      total += price * item.quantity;
    }
    const subtotal = round2(total);
    const shipping = shippingCost(customer.shippingAddress.country, subtotal);
    total = round2(subtotal + (shipping ?? 0));

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
      subtotal,
      shippingCost: shipping,
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
      if (candidate.customerEmail !== customer.email) return { success: false, error: "Diese Anfrage wurde bereits übermittelt." };
      return resultFromOrder(candidate as StoredOrder);
    }

    const addressText = (address: { name: string } & CheckoutAddressInput) =>
      `${address.name}\n${address.street}\n${address.postalCode} ${address.city}\n${address.country}`;
    const lines = lineItems.map((item) => `${item.quantity} × ${item.title} — €${item.price.toFixed(2)} pro Stück`).join("\n");
    const shippingText = shipping === null ? "wird nach Annahme berechnet und mitgeteilt" : shipping === 0 ? "kostenlos" : `€${shipping.toFixed(2)}`;
    const pricingText = `Zwischensumme der Artikel: €${subtotal.toFixed(2)}\nVersand: ${shippingText}\nGesamtbetrag${shipping === null ? " ohne Versand" : ""}: €${total.toFixed(2)}`;
    const cancellationUrl = `${config.origin}/shop/cancel/${token}`;
    const deliveries = await Promise.allSettled([
      sendShopEmail(config, merchantEmail, `Kaufanfrage ${orderNumber}`,
        `Kaufanfrage ${orderNumber}\n\n${lines}\n\n${pricingText}\n\nKunde: ${customer.name}\nE-Mail: ${customer.email}${customer.phone ? `\nTelefon: ${customer.phone}` : ""}\n\nLieferadresse:\n${addressText({ name: customer.name, ...customer.shippingAddress })}\n\nRechnungsadresse:\n${addressText({ name: customer.name, ...customer.billingAddress })}\n\nEs wurde keine Zahlung vorgenommen.`, `purchase-${orderId}-merchant`),
      sendShopEmail(config, customer.email, `Ihre Kaufanfrage ${orderNumber}`,
        `Vielen Dank für Ihre Kaufanfrage ${orderNumber}.\n\n${lines}\n\n${pricingText}\n\nDie Verfügbarkeit wird persönlich bestätigt. Wir melden uns bei Ihnen bezüglich der Rechnung. Es wurde noch keine Zahlung vorgenommen.\n\nSie können Ihre Anfrage stornieren, bevor sie als bezahlt markiert wird. Rufen Sie dazu folgende Seite auf:\n${cancellationUrl}`, `purchase-${orderId}-customer`),
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
      subtotal: storedOrder.subtotal ?? storedOrder.total,
      shippingCost: storedOrder.shippingCost ?? null,
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
      return { success: false, error: "Der Status Ihrer Anfrage ist unklar. Bitte kontaktieren Sie den Shop, bevor Sie es erneut versuchen." };
    }
    return { success: false, error: "Ihre Anfrage konnte nicht übermittelt werden. Bitte versuchen Sie es erneut." };
  }
}
