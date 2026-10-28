"use server";

import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/lib/api";
import {
  orderByOrderNumberQuery,
  ordersByCustomerIdQuery,
} from "@/sanity/lib/queries";

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

export type DataRemovalState = {
  ok: boolean;
  message: string;
  errors?: {
    orderReference?: string;
    email?: string;
  };
  values?: {
    orderReference?: string;
    email?: string;
  };
};

const ALLOWED_REQUEST_TYPES = new Set(["access", "export", "deletion"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

const SUCCESS_MESSAGE =
  "Ihre Anfrage zu personenbezogenen Daten ist eingegangen. Wir antworten Ihnen in Kürze per E-Mail.";

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
    errors.requestType = "Bitte wählen Sie die Art der Anfrage.";
  }
  if (!name) {
    errors.name = "Bitte geben Sie Ihren Namen ein.";
  } else if (name.length > MAX_NAME) {
    errors.name = `Der Name darf höchstens ${MAX_NAME} Zeichen lang sein.`;
  }
  if (!email) {
    errors.email = "Bitte geben Sie Ihre E-Mail-Adresse ein.";
  } else if (email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
    errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
  }
  if (message.length > MAX_MESSAGE) {
    errors.message = `Die Nachricht darf höchstens ${MAX_MESSAGE} Zeichen lang sein.`;
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      message: "Bitte korrigieren Sie die folgenden Fehler.",
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
        "Ihre Anfrage konnte derzeit nicht übermittelt werden. Bitte versuchen Sie es später erneut oder schreiben Sie uns direkt per E-Mail.",
      values: { name, email, requestType, message },
    };
  }
}

interface OwnershipOrder {
  _id: string;
  customer?: { _id: string; email?: string } | null;
}

interface OrderIdRow {
  _id: string;
}

const REMOVAL_SUCCESS_MESSAGE =
  "Ihre personenbezogenen Daten und Ihre Bestellhistorie wurden aus unserem Shop gelöscht.";

export async function deleteMyData(
  _prev: DataRemovalState,
  formData: FormData,
): Promise<DataRemovalState> {
  const orderReference = String(formData.get("orderReference") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  const errors: DataRemovalState["errors"] = {};
  if (!orderReference) {
    errors.orderReference = "Bitte geben Sie Ihre Bestellnummer ein.";
  }
  if (!email) {
    errors.email = "Bitte geben Sie Ihre E-Mail-Adresse ein.";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      message: "Bitte korrigieren Sie die folgenden Fehler.",
      errors,
      values: { orderReference, email },
    };
  }

  const writeClient = getWriteClient();
  if (!writeClient) {
    return {
      ok: false,
      message:
        "Die Datenlöschung ist derzeit nicht verfügbar. Bitte schreiben Sie uns direkt per E-Mail, damit wir Ihre Anfrage bearbeiten können.",
      values: { orderReference, email },
    };
  }

  try {
    const order = await writeClient.fetch<OwnershipOrder | null>(
      orderByOrderNumberQuery,
      { orderNumber: orderReference },
    );

    if (!order || !order.customer || !order.customer._id) {
      return {
        ok: false,
        message:
          "Wir konnten keine Bestellung mit dieser Bestellnummer und E-Mail-Adresse finden.",
        errors: { orderReference: "Bestellung nicht gefunden." },
        values: { orderReference, email },
      };
    }

    if (order.customer.email?.toLowerCase() !== email) {
      return {
        ok: false,
        message:
          "Wir konnten keine Bestellung mit dieser Bestellnummer und E-Mail-Adresse finden.",
        errors: { email: "Die E-Mail-Adresse stimmt nicht mit dieser Bestellung überein." },
        values: { orderReference, email },
      };
    }

    const customerId = order.customer._id;

    const orders = await writeClient.fetch<OrderIdRow[]>(
      ordersByCustomerIdQuery,
      { customerId },
    );
    for (const row of orders) {
      await writeClient.delete(row._id);
    }
    await writeClient.delete(customerId);

    return { ok: true, message: REMOVAL_SUCCESS_MESSAGE };
  } catch (error) {
    console.error("[dataRemoval] Failed to delete customer data:", error);
    return {
      ok: false,
      message:
        "Bei der Löschung Ihrer Daten ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder schreiben Sie uns direkt per E-Mail.",
      values: { orderReference, email },
    };
  }
}
