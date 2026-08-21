import { EnvelopeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "dataRequest",
  title: "Data Subject Request",
  icon: EnvelopeIcon,
  type: "document",
  fields: [
    defineField({
      name: "requestType",
      title: "Request Type",
      type: "string",
      options: {
        list: [
          { title: "Access", value: "access" },
          { title: "Export", value: "export" },
          { title: "Deletion", value: "deletion" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
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
      name: "message",
      title: "Message",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "new",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "In Review", value: "in_review" },
          { title: "Completed", value: "completed" },
          { title: "Refused", value: "refused" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      name: "name",
      requestType: "requestType",
      email: "email",
      status: "status",
      submittedAt: "submittedAt",
    },
    prepare({ name, requestType, email, status }) {
      const subtitles = [
        requestType && requestType.toUpperCase(),
        email,
        status && `(${status})`,
      ].filter(Boolean);

      return {
        title: name || "Anonymous",
        subtitle: subtitles.join(" · "),
      };
    },
  },
});
