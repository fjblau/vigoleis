import "server-only";

import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/lib/api";

/**
 * Write-enabled Sanity client for server actions (order persistence, etc.).
 * Uses SANITY_API_WRITE_TOKEN, which must never be exposed to the client.
 * The client is created lazily without throwing at import time so builds do
 * not break when the token is absent; server actions should check
 * `hasWriteAccess` and return a clear error when it is false.
 */
const writeToken = process.env.SANITY_API_WRITE_TOKEN;

export const hasWriteAccess = Boolean(writeToken);

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  token: writeToken || undefined,
});
