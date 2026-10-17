import type { Metadata } from "next";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { Image } from "next-sanity/image";

import { sanityFetch } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/utils";

import AddToCart from "./add-to-cart";

export const metadata: Metadata = {
  title: "Shop",
};

export const dynamic = "force-dynamic";

const shopProductsQuery = defineQuery(`
  *[_type == "product" && defined(slug.current) && coalesce(published, true)] | order(title asc) {
    _id,
    "title": coalesce(title, "Untitled product"),
    "slug": slug.current,
    price,
    "image": images[0] { asset, alt, hotspot, crop },
    "category": category->{ title },
    description[] { _type, children[] { text } },
    inventory
  }
`);

export default async function ShopPage() {
  let products: any[] = [];
  let fetchFailed = false;

  try {
    products = (await sanityFetch({ query: shopProductsQuery })) || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    fetchFailed = true;
  }

  return (
    <div className="container mx-auto px-5 py-10 md:py-14">
      <h1 className="mb-6 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        Memorabilia Shop
      </h1>
      <p className="mb-9 text-lg text-gray-600">
        Rare books, collectibles, and memorabilia related to Albert Vigoleis
        Thelen and his literary works.
      </p>

      {products.length > 0 ? (
        <ul className="mx-auto max-w-4xl space-y-2.5" aria-label="Shop products">
          {products.map((product) => {
            const outOfStock =
              product.inventory != null && Number(product.inventory) <= 0;
            const description = (product.description || [])
              .filter((block: any) => block._type === "block")
              .map((block: any) =>
                (block.children || []).map((child: any) => child.text).join(""),
              )
              .join(" ")
              .trim();
            const productHref = `/shop/${encodeURIComponent(product.slug)}`;
            const imageUrl = product.image?.asset?._ref
              ? urlForImage(product.image)?.width(240).url()
              : undefined;

            return (
              <li key={product._id} className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 even:[&>div]:bg-[#f7f5eb] sm:grid-cols-[88px_minmax(0,1fr)] sm:gap-4">
                <Link
                  href={productHref}
                  aria-label={`View ${product.title}`}
                  className="relative block w-[72px] self-start aspect-[3/4] bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:w-[88px]"
                >
                  {imageUrl ? (
                    <Image
                      className="object-contain"
                      fill
                      alt={product.image.alt || product.title}
                      src={imageUrl}
                      sizes="(max-width: 639px) 72px, 88px"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center px-1 text-center text-xs text-gray-600">
                      No image
                    </span>
                  )}
                </Link>
                <div className="flex min-w-0 flex-col border-b border-stone-200 bg-[#faf9f3] px-3 py-2.5 sm:min-h-[132px] sm:px-4 sm:py-3">
                  <div>
                    <h2 className="text-sm font-semibold leading-snug text-gray-900 sm:text-base">
                      <Link
                        href={productHref}
                        className="hover:underline hover:underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                      >
                        {product.title}
                      </Link>
                    </h2>
                    {product.category?.title && (
                      <p className="mt-0.5 text-xs font-medium text-stone-600 sm:text-sm">
                        {product.category.title}
                      </p>
                    )}
                    {description && (
                      <p className="mt-1 line-clamp-2 text-xs leading-snug text-gray-700 sm:text-sm">
                        {description}
                      </p>
                    )}
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-end gap-x-2 pt-2 text-sm">
                    <span className="font-bold whitespace-nowrap text-gray-900">
                      €{Number(product.price).toFixed(2)}
                    </span>
                    <span aria-hidden="true" className="text-stone-400">·</span>
                    {outOfStock ? (
                      <span className="font-medium text-gray-600">Out of stock</span>
                    ) : (
                      <AddToCart
                        compact
                        product={{
                          _id: product._id,
                          slug: product.slug,
                          title: product.title,
                          price: Number(product.price),
                          image: imageUrl,
                        }}
                      />
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mx-auto max-w-4xl border-l-2 border-stone-300 bg-[#faf9f3] p-6">
          <h2 className="mb-2 text-xl font-bold">
            {fetchFailed ? "Shop temporarily unavailable" : "No products available yet"}
          </h2>
          <p className="text-gray-700">
            {fetchFailed
              ? "We couldn’t load the catalogue right now. Please try again later."
              : "The shop is being stocked with rare books, collectibles, and memorabilia. Please check back soon or contact us for inquiries about available items."}
          </p>
        </div>
      )}
    </div>
  );
}
