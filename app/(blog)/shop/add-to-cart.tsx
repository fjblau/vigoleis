"use client";

import Link from "next/link";
import { useState } from "react";

import { useCart } from "../cart-provider";

interface AddToCartProps {
  product: {
    _id: string;
    slug: string;
    title: string;
    price: number;
    image?: string;
  };
  disabled?: boolean;
  compact?: boolean;
}

export default function AddToCart({ product, disabled, compact = false }: AddToCartProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({
      productId: product._id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: product.image,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className={compact ? "flex flex-wrap items-center justify-end gap-x-3 gap-y-1" : "flex flex-wrap items-center gap-3"}>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={compact
          ? "-mr-2 px-2 py-2 text-sm font-semibold text-gray-700 transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:text-gray-400"
          : "bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"}
      >
        {added ? "Im Warenkorb" : "In den Warenkorb"}
      </button>
      {added && (
        <Link
          href="/shop/checkout"
          className={compact
            ? "text-sm text-gray-700 underline underline-offset-2 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            : "text-cyan-600 underline hover:text-cyan-700 transition-colors"}
        >
          Warenkorb ansehen
        </Link>
      )}
    </div>
  );
}
