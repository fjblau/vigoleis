import { PackageIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

import { defaultBlockStyles } from "../blockquoteStyle";
import categoryType from "./category";

export default defineType({
  name: "product",
  title: "Product",
  icon: PackageIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price (EUR)",
      type: "number",
      description: "Price in euros. Enter the numeric value only (e.g. 19.99).",
      validation: (rule) => rule.required().min(0).precision(2),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block", styles: defaultBlockStyles }],
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      options: { layout: "grid" },
      of: [
        defineArrayMember({
          type: "image",
          options: {
            hotspot: true,
            aiAssist: {
              imageDescriptionField: "alt",
            },
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility.",
              validation: (rule) => {
                return rule.custom((alt, context) => {
                  if ((context.parent as any)?.asset?._ref && !alt) {
                    return "Required";
                  }
                  return true;
                });
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: categoryType.name }],
    }),
    defineField({
      name: "sortOrder",
      title: "Manual sort order",
      type: "number",
      description:
        "Lower numbers appear first in the shop, including when filtering by category. Products without a number appear last.",
      validation: (rule) => rule.min(0).precision(0),
    }),
    defineField({
      name: "inventory",
      title: "Inventory / Stock",
      type: "number",
      description:
        "Optional. Leave blank for manual availability checks; set to 0 to mark the product as out of stock.",
      validation: (rule) => rule.min(0).precision(0),
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      description:
        "Uncheck to remove this product from the storefront without deleting the record.",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      name: "manualSortOrder",
      title: "Manual sort order",
      by: [
        { field: "sortOrder", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
    {
      name: "titleAsc",
      title: "Title A–Z",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      price: "price",
      media: "images[0]",
      category: "category.title",
      published: "published",
      sortOrder: "sortOrder",
    },
    prepare({ title, price, media, category, published, sortOrder }) {
      const subtitle = [
        sortOrder != null ? `Order ${sortOrder}` : null,
        category,
        price != null ? `€${Number(price).toFixed(2)}` : null,
        published ? "Published" : "Unpublished",
      ]
        .filter(Boolean)
        .join(" · ");
      return { title: title || "Untitled product", media, subtitle };
    },
  },
});
