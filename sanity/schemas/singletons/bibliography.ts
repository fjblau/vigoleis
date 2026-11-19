import { BookIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

const richText = [
  defineArrayMember({
    type: "block",
    marks: {
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
  name: "bibliography",
  title: "Bibliography",
  type: "document",
  icon: BookIcon,
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      initialValue: "Bibliographie",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "array",
      description: "Text above the numbered bibliography sections.",
      of: richText,
    }),
    defineField({
      name: "moreLabel",
      title: "Expand label",
      type: "string",
      initialValue: "mehr",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      description: "Top-level sections of the bibliography page.",
      of: [
        defineArrayMember({
          type: "object",
          name: "section",
          title: "Section",
          fields: [
            defineField({
              name: "number",
              title: "Section number",
              type: "string",
              description: "Optional Roman numeral, e.g. I or II. Defaults to its position.",
            }),
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "details",
              title: "Content revealed by 'mehr'",
              type: "array",
              of: richText,
            }),
            defineField({
              name: "subsections",
              title: "Subsections",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "subsection",
                  title: "Subsection",
                  fields: [
                    defineField({
                      name: "number",
                      title: "Subsection number",
                      type: "string",
                      description: "Optional number, e.g. 1 or 2. Defaults to its position.",
                    }),
                    defineField({
                      name: "heading",
                      title: "Heading",
                      type: "string",
                      description: "Optional; leave empty for entries listed directly under the section.",
                    }),
                    defineField({
                      name: "details",
                      title: "Content revealed by 'mehr'",
                      type: "array",
                      of: richText,
                    }),
                    defineField({
                      name: "entries",
                      title: "Entries",
                      type: "array",
                      of: [
                        defineArrayMember({
                          type: "object",
                          name: "entry",
                          title: "Entry",
                          fields: [
                            defineField({
                              name: "title",
                              title: "Title",
                              type: "string",
                              validation: (rule) => rule.required(),
                            }),
                            defineField({
                              name: "year",
                              title: "Year",
                              type: "string",
                              description: "e.g. (1953)",
                            }),
                            defineField({
                              name: "description",
                              title: "Description",
                              type: "text",
                              rows: 2,
                            }),
                          ],
                          preview: {
                            select: { title: "title", subtitle: "year" },
                          },
                        }),
                      ],
                    }),
                  ],
                  preview: {
                    select: { title: "heading", entryCount: "entries.length" },
                    prepare({ title, entryCount }) {
                      return {
                        title: title || "Untitled subsection",
                        subtitle: `${entryCount || 0} entr${entryCount === 1 ? "y" : "ies"}`,
                      };
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "heading", subsectionCount: "subsections.length" },
            prepare({ title, subsectionCount }) {
              return {
                title: title || "Untitled section",
                subtitle: `${subsectionCount || 0} subsection${subsectionCount === 1 ? "" : "s"}`,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "footer",
      title: "Text below the bibliography",
      type: "array",
      description: "For example, a secondary-literature credit or link.",
      of: richText,
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: title ?? "Bibliography" }),
  },
});
