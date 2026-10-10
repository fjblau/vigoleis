import type { Metadata } from "next";
import Link from "next/link";

import { canCancelPurchaseRequest, cancelPurchaseRequest } from "../actions";
import CancelForm from "./cancel-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cancel purchase request",
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
      <h1 className="mb-6 text-4xl font-bold tracking-tight">Cancel purchase request</h1>
      {available ? (
        <>
          <p className="mb-6 text-gray-700">You can cancel this request before it is marked paid. This cannot be undone.</p>
          <CancelForm action={cancelPurchaseRequest.bind(null, token)} />
        </>
      ) : (
        <p className="mb-6 text-gray-700">This cancellation link is invalid or the request can no longer be cancelled online. Please contact the shop if you need help.</p>
      )}
      <Link href="/shop" className="inline-block mt-6 underline">Return to shop</Link>
    </div>
  );
}
