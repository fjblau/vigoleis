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
}

export default function AddToCart({ product, disabled }: AddToCartProps) {
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
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {added ? "Added to cart" : "Add to cart"}
      </button>
      {added && (
        <Link
          href="/shop/checkout"
          className="text-cyan-600 underline hover:text-cyan-700 transition-colors"
        >
          Go to checkout
        </Link>
      )}
    </div>
  );
}
