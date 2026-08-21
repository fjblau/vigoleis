import type { Metadata } from "next";
import Link from "next/link";
import { Image } from "next-sanity/image";

import { sanityFetch } from "@/sanity/lib/fetch";
import { productsQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/utils";

export const metadata: Metadata = {
  title: "Shop",
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  let products: any[] = [];

  try {
    products = (await sanityFetch({ query: productsQuery })) || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  return (
    <div className="container mx-auto px-5 py-16">
      <h1 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        Memorabilia Shop
      </h1>
      <p className="mb-12 text-lg text-gray-600">
        Rare books, collectibles, and memorabilia related to Albert Vigoleis
        Thelen and his literary works.
      </p>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const outOfStock = Number(product.inventory) <= 0;
            return (
              <Link
                key={product._id}
                href={`/shop/${product.slug}`}
                className="group flex flex-col border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative bg-gray-100 aspect-[3/4]">
                  {product.image?.asset?._ref ? (
                    <Image
                      className="object-cover"
                      fill
                      alt={product.image.alt || product.title}
                      src={
                        urlForImage(product.image)?.width(800).url() as string
                      }
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-gray-500">No image</p>
                    </div>
                  )}
                  {outOfStock && (
                    <span className="absolute top-3 left-3 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
                      Out of stock
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-bold text-lg mb-1">{product.title}</h3>
                  {product.category?.title && (
                    <p className="text-gray-500 text-sm mb-2">
                      {product.category.title}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className="text-xl font-bold">
                      €{Number(product.price).toFixed(2)}
                    </span>
                    <span className="bg-black text-white px-4 py-2 rounded group-hover:bg-gray-800 transition-colors">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="p-6 bg-amber-50 rounded-lg border border-amber-200">
          <h2 className="text-xl font-bold mb-2">No products available yet</h2>
          <p className="text-gray-700">
            The shop is being stocked with rare books, collectibles, and
            memorabilia. Please check back soon or contact us for inquiries
            about available items.
          </p>
        </div>
      )}
    </div>
  );
}
