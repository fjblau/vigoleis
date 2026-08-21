import { ImagesIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "gallery",
  title: "Gallery",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Gallery",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Brief description shown at the top of the gallery page.",
      rows: 3,
    }),
    defineField({
      name: "categories",
      title: "Gallery Categories",
      type: "array",
      description: "Add categories (and optional albums) of photos.",
      of: [
        defineArrayMember({
          type: "object",
          name: "galleryCategory",
          title: "Gallery Category",
          fields: [
            defineField({
              name: "categoryTitle",
              title: "Category Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "photos",
              title: "Photos",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "photo",
                  title: "Photo",
                  fields: [
                    defineField({
                      name: "image",
                      title: "Image",
                      type: "image",
                      options: {
                        hotspot: true,
                      },
                      fields: [
                        defineField({
                          name: "alt",
                          title: "Alt Text",
                          type: "string",
                          description:
                            "Descriptive text for the image, used for accessibility.",
                        }),
                      ],
                    }),
                    defineField({
                      name: "caption",
                      title: "Caption",
                      type: "string",
                      description: "Optional caption shown beneath the photo.",
                    }),
                    defineField({
                      name: "album",
                      title: "Album",
                      type: "string",
                      description:
                        "Optional album label to group photos within this category.",
                    }),
                  ],
                  preview: {
                    select: {
                      title: "caption",
                      subtitle: "album",
                      media: "image",
                    },
                    prepare({ title, subtitle, media }) {
                      return {
                        title: title || "Untitled Photo",
                        subtitle: subtitle ? `Album: ${subtitle}` : "No album",
                        media,
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
              photoCount: "photos.length",
            },
            prepare({ title, photoCount }) {
              return {
                title: title || "Untitled Category",
                subtitle: `${photoCount || 0} photo${
                  photoCount !== 1 ? "s" : ""
                }`,
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
        title: "Gallery",
      };
    },
  },
});
