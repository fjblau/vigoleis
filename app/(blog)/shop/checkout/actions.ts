"use server";

import { randomUUID } from "node:crypto";

import { hasWriteAccess, writeClient } from "@/sanity/lib/write-client";
import {
  customerByEmailQuery,
  productPricesByIdsQuery,
} from "@/sanity/lib/queries";

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
  address: CheckoutAddressInput;
}

export interface CreateOrderInput {
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
    }
  | { success: false; error: string };

interface ProductPrice {
  _id: string;
  title: string;
  price: number;
  inventory: number | null;
  published: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ValidationResult =
  | {
      ok: true;
      customer: CheckoutCustomerInput;
      items: CheckoutItemInput[];
    }
  | { ok: false; error: string };

function validateInput(input: CreateOrderInput): ValidationResult {
  const name = (input?.customer?.name ?? "").trim();
  const email = (input?.customer?.email ?? "").trim().toLowerCase();
  const address = input?.customer?.address ?? {};
  const street = (address.street ?? "").trim();
  const city = (address.city ?? "").trim();
  const postalCode = (address.postalCode ?? "").trim();
  const country = (address.country ?? "").trim();

  if (name.length < 2) {
    return { ok: false, error: "Please enter your full name." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!street || !city || !postalCode || !country) {
    return {
      ok: false,
      error: "Please complete your shipping address (street, city, postal code, country).",
    };
  }

  const rawItems = Array.isArray(input?.items) ? input.items : [];
  if (rawItems.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  const items: CheckoutItemInput[] = [];
  const seen = new Set<string>();
  for (const raw of rawItems) {
    const productId = typeof raw?.productId === "string" ? raw.productId : "";
    const quantity = Number(raw?.quantity);
    if (!productId || !Number.isInteger(quantity) || quantity < 1) {
      return { ok: false, error: "Invalid item in cart." };
    }
    if (seen.has(productId)) continue;
    seen.add(productId);
    items.push({ productId, quantity });
  }

  if (items.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  return {
    ok: true,
    customer: { name, email, address: { street, city, postalCode, country } },
    items,
  };
}

function generateOrderNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate(),
  ).padStart(2, "0")}`;
  const rand = randomUUID().split("-")[0].toUpperCase();
  return `ORD-${ymd}-${rand}`;
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export async function createOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  if (!hasWriteAccess) {
    return {
      success: false,
      error: "Checkout is not available: server is not configured for order storage.",
    };
  }

  const validated = validateInput(input);
  if (!validated.ok) {
    return { success: false, error: validated.error };
  }
  const { customer, items } = validated;

  try {
    const ids = items.map((i) => i.productId);
    const products = await writeClient.fetch<ProductPrice[]>(
      productPricesByIdsQuery,
      { ids },
    );
    const byId = new Map(products.map((p) => [p._id, p]));

    const lineItems: Array<{
      product: { _type: "reference"; _ref: string };
      title: string;
      price: number;
      quantity: number;
    }> = [];
    let total = 0;

    for (const item of items) {
      const product = byId.get(item.productId);
      if (!product) {
        return { success: false, error: "An item in your cart is no longer available." };
      }
      if (product.inventory != null && product.inventory <= 0) {
        return {
          success: false,
          error: `"${product.title}" is out of stock.`,
        };
      }
      const unitPrice = Number(product.price);
      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        return {
          success: false,
          error: `Could not determine the price for "${product.title}".`,
        };
      }
      lineItems.push({
        product: { _type: "reference", _ref: product._id },
        title: product.title,
        price: round2(unitPrice),
        quantity: item.quantity,
      });
      total += unitPrice * item.quantity;
    }

    total = round2(total);

    // Find or create the customer record (one per email).
    const existing = await writeClient.fetch<{ _id: string } | null>(
      customerByEmailQuery,
      { email: customer.email },
    );
    let customerId = existing?._id;
    if (!customerId) {
      const created = await writeClient.create({
        _type: "customer",
        name: customer.name,
        email: customer.email,
        address: {
          street: customer.address.street,
          city: customer.address.city,
          postalCode: customer.address.postalCode,
          country: customer.address.country,
        },
      });
      customerId = created._id;
    } else {
      // Keep the customer's address current with the latest checkout.
      await writeClient
        .patch(customerId)
        .set({
          name: customer.name,
          address: {
            street: customer.address.street,
            city: customer.address.city,
            postalCode: customer.address.postalCode,
            country: customer.address.country,
          },
        })
        .commit();
    }

    const orderNumber = generateOrderNumber();

    const order = await writeClient.create({
      _type: "order",
      orderNumber,
      items: lineItems,
      total,
      status: "pending",
      customer: { _type: "reference", _ref: customerId },
      createdAt: new Date().toISOString(),
      // ── STRIPE SEAM ─────────────────────────────────────────────
      // No live payment yet. When Stripe is wired in, the flow becomes:
      //   1. Create a Stripe PaymentIntent for `total` (server-side).
      //   2. Return its client secret to the checkout form.
      //   3. The form confirms payment with the Stripe SDK.
      //   4. On success, persist the order with status "paid" and store
      //      the Payment Intent ID in `stripePaymentIntentId` below.
      // For now we simply capture the order as "pending" so it can be
      // fulfilled manually from the Studio.
      // ─────────────────────────────────────────────────────────────
      stripePaymentIntentId: "",
    });

    return {
      success: true,
      orderId: order._id,
      orderNumber,
      total,
      email: customer.email,
    };
  } catch (error) {
    console.error("Failed to create order:", error);
    return {
      success: false,
      error: "Something went wrong while placing your order. Please try again.",
    };
  }
}
