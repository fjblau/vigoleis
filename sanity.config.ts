"use client";
import { visionTool } from "@sanity/vision";
import { PluginOptions, defineConfig } from "sanity";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";
import { pageStructure, singletonPlugin } from "@/sanity/plugins/settings";
import { assistWithPresets } from "@/sanity/plugins/assist";
import author from "@/sanity/schemas/documents/author";
import category from "@/sanity/schemas/documents/category";
import dataRequest from "@/sanity/schemas/documents/dataRequest";
import post from "@/sanity/schemas/documents/post";
import product from "@/sanity/schemas/documents/product";
import customer from "@/sanity/schemas/documents/customer";
import order from "@/sanity/schemas/documents/order";
import settings from "@/sanity/schemas/singletons/settings";
import dictionary from "@/sanity/schemas/singletons/dictionary";
import linksEphemera from "@/sanity/schemas/singletons/linksEphemera";
import privacyPolicy from "@/sanity/schemas/singletons/privacyPolicy";
import terms from "@/sanity/schemas/singletons/terms";
import legalNotice from "@/sanity/schemas/singletons/legalNotice";
import cookieConsent from "@/sanity/schemas/singletons/cookieConsent";
import gallery from "@/sanity/schemas/singletons/gallery";
import biography from "@/sanity/schemas/singletons/biography";
import bibliography from "@/sanity/schemas/singletons/bibliography";
import { resolveHref } from "@/sanity/lib/utils";

const homeLocation = {
  title: "Home",
  href: "/",
} satisfies DocumentLocation;

export default defineConfig({
  basePath: studioUrl,
  projectId,
  dataset,
  schema: {
    types: [
      settings,
      dictionary,
      linksEphemera,
      privacyPolicy,
      terms,
      legalNotice,
      cookieConsent,
      gallery,
      biography,
      bibliography,
      post,
      author,
      category,
      dataRequest,
      product,
      customer,
      order,
    ],
  },
  plugins: [
    presentationTool({
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: "/posts/:slug",
            filter: `_type == "post" && slug.current == $slug`,
          },
          {
            route: "/biography",
            filter: `_type == "biography"`,
          },
          {
            route: "/bibliography",
            filter: `_type == "bibliography"`,
          },
        ]),
        locations: {
          settings: defineLocations({
            locations: [homeLocation],
            message: "This document is used on all pages",
            tone: "caution",
          }),
          post: defineLocations({
            select: {
              title: "title",
              slug: "slug.current",
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || "Untitled",
                  href: resolveHref("post", doc?.slug)!,
                },
                homeLocation,
              ],
            }),
          }),
          biography: defineLocations({
            locations: [{ title: "Biography", href: "/biography" }],
            message: "This document is the biography page",
          }),
          bibliography: defineLocations({
            locations: [{ title: "Bibliography", href: "/bibliography" }],
            message: "This document is the bibliography page",
          }),
        },
      },
      previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } },
    }),
    structureTool({
      structure: pageStructure([
        settings,
        dictionary,
        linksEphemera,
        privacyPolicy,
        terms,
        legalNotice,
        cookieConsent,
        gallery,
        biography,
        bibliography,
      ]),
    }),
    singletonPlugin([
      settings.name,
      dictionary.name,
      linksEphemera.name,
      privacyPolicy.name,
      terms.name,
      legalNotice.name,
      cookieConsent.name,
      gallery.name,
      biography.name,
      bibliography.name,
    ]),
    unsplashImageAsset(),
    assistWithPresets(),
    process.env.NODE_ENV === "development" &&
      visionTool({ defaultApiVersion: apiVersion }),
  ].filter(Boolean) as PluginOptions[],
});