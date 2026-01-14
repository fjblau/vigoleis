import { LinkIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "linksEphemera",
  title: "Links & Ephemera",
  type: "document",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Links & Ephemera",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Brief description shown at the top of the page.",
      rows: 3,
    }),
    defineField({
      name: "categories",
      title: "Link Categories",
      type: "array",
      description: "Add different categories of links and resources.",
      of: [
        defineArrayMember({
          type: "object",
          name: "linkCategory",
          title: "Link Category",
          fields: [
            defineField({
              name: "categoryTitle",
              title: "Category Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "categoryDescription",
              title: "Category Description",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "link",
                  title: "Link",
                  fields: [
                    defineField({
                      name: "title",
                      title: "Link Title",
                      type: "string",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "url",
                      title: "URL",
                      type: "url",
                      validation: (rule) =>
                        rule.required().uri({
                          scheme: ["http", "https"],
                        }),
                    }),
                    defineField({
                      name: "description",
                      title: "Link Description",
                      type: "text",
                      rows: 2,
                    }),
                  ],
                  preview: {
                    select: {
                      title: "title",
                      url: "url",
                    },
                    prepare({ title, url }) {
                      return {
                        title: title || "Untitled Link",
                        subtitle: url,
                      };
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "categoryTitle",
              linkCount: "links.length",
            },
            prepare({ title, linkCount }) {
              return {
                title: title || "Untitled Category",
                subtitle: `${linkCount || 0} link${linkCount !== 1 ? "s" : ""}`,
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
        title: "Links & Ephemera",
      };
    },
  },
});
