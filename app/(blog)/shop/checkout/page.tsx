import type { Metadata } from "next";

import Checkout from "./checkout";

export const metadata: Metadata = {
  title: "Checkout",
};

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-5 py-16">
      <Checkout />
    </div>
  );
}
