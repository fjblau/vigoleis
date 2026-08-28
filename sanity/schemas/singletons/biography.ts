import { BookIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

const portableText = [
  defineArrayMember({
    type: "block",
    styles: [{ title: "Normal", value: "normal" }],
    lists: [],
    marks: {
      decorators: [
        { title: "Italic", value: "em" },
        { title: "Bold", value: "strong" },
      ],
      annotations: [
        {
          name: "link",
          type: "object",
          title: "Link",
          fields: [{ name: "href", type: "url", title: "URL" }],
        },
      ],
    },
  }),
];

export default defineType({
  name: "biography",
  title: "Biography",
  type: "document",
  icon: BookIcon,
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introHeading",
      title: "Intro heading",
      type: "string",
    }),
    defineField({
      name: "intro",
      title: "Intro text",
      type: "array",
      of: portableText,
    }),
    defineField({
      name: "timelineHeading",
      title: "Timeline heading",
      type: "string",
    }),
    defineField({
      name: "timeline",
      title: "Timeline",
      type: "array",
      of: [
        defineArrayMember({
          name: "entry",
          type: "object",
          title: "Entry",
          fields: [
            defineField({
              name: "period",
              title: "Year or period",
              type: "string",
              description: "e.g. 1903 or 1931-1936",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "text",
              title: "Text",
              type: "array",
              of: portableText,
            }),
          ],
          preview: {
            select: { title: "period", subtitle: "text.0.children.0.text" },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: title ?? "Biography" }),
  },
});
