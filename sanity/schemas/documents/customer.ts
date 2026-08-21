import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "customer",
  title: "Customer",
  icon: UserIcon,
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      fields: [
        defineField({
          name: "street",
          title: "Street and number",
          type: "string",
        }),
        defineField({
          name: "city",
          title: "City",
          type: "string",
        }),
        defineField({
          name: "postalCode",
          title: "Postal code",
          type: "string",
        }),
        defineField({
          name: "country",
          title: "Country",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      name: "name",
      email: "email",
    },
    prepare({ name, email }) {
      return {
        title: name || "Anonymous",
        subtitle: email || "No email",
      };
    },
  },
});
