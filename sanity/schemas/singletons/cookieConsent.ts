import { ControlsIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "cookieConsent",
  title: "Cookie Consent",
  type: "document",
  icon: ControlsIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Cookie Consent",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "consentMessage",
      title: "Consent Message",
      type: "text",
      description: "The message text shown in the cookie consent banner.",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Cookie Categories",
      type: "array",
      description: "The cookie categories shown to the visitor, each with a label.",
      of: [
        defineArrayMember({
          type: "object",
          name: "cookieCategory",
          title: "Cookie Category",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "The name shown for this category, e.g. \"Necessary\", \"Analytics\".",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              description: "Optional explanation of what this category covers.",
              rows: 2,
            }),
            defineField({
              name: "required",
              title: "Always required",
              type: "boolean",
              description: "Enable for categories that cannot be disabled (e.g. strictly necessary cookies).",
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: "label",
              required: "required",
            },
            prepare({ title, required }) {
              return {
                title: title || "Untitled Category",
                subtitle: required ? "Always required" : "Optional",
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Cookie Consent",
      };
    },
  },
});
