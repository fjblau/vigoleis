import { NextResponse } from "next/server";

import {
  customerByIdQuery,
  orderByOrderNumberQuery,
  ordersByCustomerIdQuery,
} from "@/sanity/lib/queries";
import { hasWriteAccess, writeClient } from "@/sanity/lib/write-client";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface OwnershipOrder {
  _id: string;
  customer?: { _id: string; email?: string } | null;
}

interface CustomerRow {
  name?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  } | null;
}

interface OrderRow {
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items?: Array<{
    title?: string;
    price?: number;
    quantity?: number;
    product?: { title?: string } | null;
  }>;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Invalid request.", 400);
  }

  const orderReference = String(formData.get("orderReference") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!orderReference) {
    return jsonError("Please enter your order reference.", 400);
  }
  if (!email || !EMAIL_RE.test(email)) {
    return jsonError("Please enter a valid email address.", 400);
  }

  if (!hasWriteAccess) {
    return jsonError("Data export is not available.", 503);
  }

  try {
    const order = await writeClient.fetch<OwnershipOrder | null>(
      orderByOrderNumberQuery,
      { orderNumber: orderReference },
    );

    const customerEmail = order?.customer?.email?.toLowerCase();
    const customerId = order?.customer?._id;

    if (!order || !customerId || customerEmail !== email) {
      return jsonError(
        "We could not find an order matching that reference and email.",
        404,
      );
    }

    const [customer, orders] = await Promise.all([
      writeClient.fetch<CustomerRow | null>(customerByIdQuery, {
        id: customerId,
      }),
      writeClient.fetch<OrderRow[]>(ordersByCustomerIdQuery, { customerId }),
    ]);

    const payload = {
      exportedAt: new Date().toISOString(),
      scope: "Shop orders and customer profile",
      customer: customer
        ? {
            name: customer.name ?? null,
            email: customer.email ?? null,
            address: customer.address ?? null,
          }
        : null,
      orders: orders.map((o) => ({
        orderNumber: o.orderNumber,
        status: o.status,
        total: o.total,
        createdAt: o.createdAt,
        items: (o.items ?? []).map((i) => ({
          product: i.product?.title ?? null,
          title: i.title ?? null,
          price: i.price ?? null,
          quantity: i.quantity ?? null,
        })),
      })),
    };

    const filename = `personal-data-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[dataExport] Failed to export customer data:", error);
    return jsonError(
      "Something went wrong while exporting your data. Please try again later.",
      500,
    );
  }
}
