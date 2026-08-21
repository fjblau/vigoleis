"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useCart } from "./cart-provider";

export default function CartIndicator() {
  const { count } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link
      href="/shop/checkout"
      aria-label={`Checkout with ${count} item${count === 1 ? "" : "s"}`}
      className="relative inline-flex items-center gap-1 hover:underline transition-colors duration-200"
    >
      Cart
      {mounted && count > 0 && (
        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 text-xs font-semibold text-white bg-black rounded-full">
          {count}
        </span>
      )}
    </Link>
  );
}
