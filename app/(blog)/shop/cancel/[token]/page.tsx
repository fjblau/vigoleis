import type { Metadata } from "next";
import Link from "next/link";

import { canCancelPurchaseRequest, cancelPurchaseRequest } from "../actions";
import CancelForm from "./cancel-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kaufanfrage stornieren",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function CancelPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let available = false;
  try {
    available = await canCancelPurchaseRequest(token);
  } catch (error) {
    console.error("Failed to load cancellation page:", error);
  }

  return (
    <div className="container mx-auto px-5 py-16 max-w-2xl">
      <h1 className="mb-6 text-4xl font-bold tracking-tight">Kaufanfrage stornieren</h1>
      {available ? (
        <>
          <p className="mb-6 text-gray-700">Sie können diese Anfrage stornieren, solange sie noch nicht als bezahlt markiert wurde. Die Stornierung kann nicht rückgängig gemacht werden.</p>
          <CancelForm action={cancelPurchaseRequest.bind(null, token)} />
        </>
      ) : (
        <p className="mb-6 text-gray-700">Dieser Stornierungslink ist ungültig oder die Anfrage kann nicht mehr online storniert werden. Wenn Sie Hilfe benötigen, wenden Sie sich bitte an den Shop.</p>
      )}
      <Link href="/shop" className="inline-block mt-6 underline">Zurück zum Shop</Link>
    </div>
  );
}
