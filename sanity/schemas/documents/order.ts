import { BasketIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "order",
  title: "Order",
  icon: BasketIcon,
  type: "document",
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order number",
      type: "string",
      readOnly: true,
      description: "Human-friendly identifier generated on checkout.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              options: { disableNew: true },
              readOnly: true,
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              readOnly: true,
              description: "Snapshot of the product title at purchase time.",
            }),
            defineField({
              name: "price",
              title: "Unit price (EUR)",
              type: "number",
              readOnly: true,
              description: "Snapshot of the unit price at purchase time.",
              validation: (rule) => rule.min(0).precision(2),
            }),
            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
              readOnly: true,
              validation: (rule) => rule.min(1).precision(0),
            }),
          ],
          preview: {
            select: {
              title: "title",
              quantity: "quantity",
              price: "price",
            },
            prepare({ title, quantity, price }) {
              return {
                title: title || "Item",
                subtitle: `${quantity ?? 0} × €${Number(price ?? 0).toFixed(2)}`,
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "total",
      title: "Total (EUR)",
      type: "number",
      readOnly: true,
      validation: (rule) => rule.min(0).precision(2),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "pending",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Fulfilled", value: "fulfilled" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "customer",
      title: "Customer",
      type: "reference",
      to: [{ type: "customer" }],
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "createdAt",
      title: "Created at",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    // ── STRIPE SEAM ──────────────────────────────────────────────
    // This field is the integration point for Stripe. It stays empty
    // while checkout only captures orders (no live payment). When Stripe
    // is wired in, the checkout server action will store the Stripe
    // Payment Intent ID here after a successful payment confirmation.
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: "stripePaymentIntentId",
      title: "Stripe Payment Intent ID",
      type: "string",
      readOnly: true,
      description:
        "STRIPE SEAM — populated when live Stripe payments are enabled. Empty until then.",
    }),
  ],
  orderings: [
    {
      name: "createdAtDesc",
      title: "Newest first",
      by: [{ field: "createdAt", direction: "desc" }],
    },
    {
      name: "createdAtAsc",
      title: "Oldest first",
      by: [{ field: "createdAt", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      orderNumber: "orderNumber",
      total: "total",
      status: "status",
      createdAt: "createdAt",
    },
    prepare({ orderNumber, total, status, createdAt }) {
      const subtitle = [
        total != null ? `€${Number(total).toFixed(2)}` : null,
        status,
        createdAt && format(parseISO(createdAt), "LLL d, yyyy"),
      ]
        .filter(Boolean)
        .join(" · ");
      return {
        title: orderNumber || "Untitled order",
        subtitle,
      };
    },
  },
});
