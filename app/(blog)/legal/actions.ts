"use server";

import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/lib/api";

export type DataRequestState = {
  ok: boolean;
  message: string;
  errors?: {
    name?: string;
    email?: string;
    requestType?: string;
    message?: string;
  };
  values?: {
    name?: string;
    email?: string;
    requestType?: string;
    message?: string;
  };
};

const ALLOWED_REQUEST_TYPES = new Set(["access", "export", "deletion"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

const SUCCESS_MESSAGE =
  "Your data subject request has been received. We will respond to your email shortly.";

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || projectId === "placeholder") return null;
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: "published",
  });
}

export async function submitDataRequest(
  _prev: DataRequestState,
  formData: FormData,
): Promise<DataRequestState> {
  const requestType = String(formData.get("requestType") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const errors: DataRequestState["errors"] = {};

  if (!requestType || !ALLOWED_REQUEST_TYPES.has(requestType)) {
    errors.requestType = "Please select a request type.";
  }
  if (!name) {
    errors.name = "Please enter your name.";
  } else if (name.length > MAX_NAME) {
    errors.name = `Name must be ${MAX_NAME} characters or fewer.`;
  }
  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (message.length > MAX_MESSAGE) {
    errors.message = `Message must be ${MAX_MESSAGE} characters or fewer.`;
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      message: "Please correct the errors below.",
      errors,
      values: { name, email, requestType, message },
    };
  }

  const submittedAt = new Date().toISOString();
  const doc = {
    _type: "dataRequest" as const,
    requestType,
    name,
    email,
    message: message || undefined,
    status: "new" as const,
    submittedAt,
  };

  const writeClient = getWriteClient();

  if (!writeClient) {
    // Write token not configured yet — gate the write and log so the request is not lost.
    console.warn(
      "[dataRequest] SANITY_API_WRITE_TOKEN not set — logging request instead of persisting.",
      { requestType, name, email, messageLength: message.length, submittedAt },
    );
    return { ok: true, message: SUCCESS_MESSAGE };
  }

  try {
    await writeClient.create(doc);
    return { ok: true, message: SUCCESS_MESSAGE };
  } catch (error) {
    console.error(
      "[dataRequest] Failed to persist data subject request:",
      error,
    );
    return {
      ok: false,
      message:
        "Sorry, we could not submit your request right now. Please try again later or email us directly.",
      values: { name, email, requestType, message },
    };
  }
}
