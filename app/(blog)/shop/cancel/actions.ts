"use server";

import { createHash } from "node:crypto";

import { orderByCancellationTokenHashQuery } from "@/sanity/lib/queries";
import { hasWriteAccess, writeClient } from "@/sanity/lib/write-client";
import { mailConfiguration, merchantEmail, sendShopEmail } from "../checkout/mail";

export interface CancellationState {
  status: "ready" | "cancelled" | "unavailable" | "error";
  message: string;
}

interface CancellationOrder {
  _id: string;
  _rev: string;
  orderNumber: string;
  status: string;
  cancelledAt?: string;
}

const TOKEN_RE = /^[0-9a-f]{64}$/;

async function findCancellableOrder(token: string): Promise<CancellationOrder | null> {
  if (!hasWriteAccess || !TOKEN_RE.test(token)) return null;
  return writeClient.fetch<CancellationOrder | null>(orderByCancellationTokenHashQuery, {
    tokenHash: createHash("sha256").update(token).digest("hex"),
  });
}

export async function canCancelPurchaseRequest(token: string): Promise<boolean> {
  const order = await findCancellableOrder(token);
  return order?.status === "pending" && !order.cancelledAt;
}

export async function cancelPurchaseRequest(token: string, _previous: CancellationState): Promise<CancellationState> {
  if (!hasWriteAccess || !TOKEN_RE.test(token)) return { status: "unavailable", message: "Dieser Stornierungslink ist ungültig oder nicht mehr verfügbar." };
  try {
    const order = await findCancellableOrder(token);
    if (!order || order.status !== "pending" || order.cancelledAt) {
      return { status: "unavailable", message: "Diese Anfrage kann über diesen Link nicht mehr storniert werden." };
    }
    try {
      await writeClient.patch(order._id).ifRevisionId(order._rev).set({
        status: "cancelled",
        cancelledAt: new Date().toISOString(),
        cancellationNotificationStatus: "pending",
      }).unset(["cancellationTokenHash"]).commit();
    } catch (error) {
      console.error("Cancellation conflict or storage failure:", error);
      return { status: "unavailable", message: "Diese Anfrage konnte nicht storniert werden. Möglicherweise hat sich ihr Status geändert. Bitte wenden Sie sich an den Shop." };
    }

    let sent = false;
    const config = mailConfiguration();
    if (config) {
      try {
        await sendShopEmail(config, merchantEmail, `Kaufanfrage ${order.orderNumber} storniert`,
          `Der Kunde hat die Kaufanfrage ${order.orderNumber} storniert. Bitte stellen Sie keine Rechnung aus und erfüllen Sie die Bestellung nicht.`,
          `cancel-${order._id}`);
        sent = true;
      } catch (error) {
        console.error(`Failed to send cancellation notice for ${order._id}:`, error);
      }
    } else {
      console.error(`Cancellation notice for ${order._id} could not be sent: email configuration missing.`);
    }
    try {
      await writeClient.patch(order._id).set({ cancellationNotificationStatus: sent ? "sent" : "failed" }).commit();
    } catch (error) {
      console.error(`Failed to record cancellation notice status for ${order._id}:`, error);
    }
    return {
      status: "cancelled",
      message: sent
        ? "Ihre Kaufanfrage wurde storniert. Es wurde keine Zahlung abgebucht."
        : "Ihre Kaufanfrage wurde storniert, aber wir konnten nicht bestätigen, dass der Shop per E-Mail benachrichtigt wurde. Bitte wenden Sie sich direkt an den Shop.",
    };
  } catch (error) {
    console.error("Failed to check cancellation request:", error);
    return { status: "error", message: "Die Stornierung ist vorübergehend nicht verfügbar. Bitte wenden Sie sich an den Shop." };
  }
}
