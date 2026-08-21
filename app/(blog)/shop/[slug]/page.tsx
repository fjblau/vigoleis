import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Image } from "next-sanity/image";

import PortableText from "../../portable-text";

import { sanityFetch } from "@/sanity/lib/fetch";
import { productBySlugQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage, urlForImage } from "@/sanity/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

const productSlugs = defineQuery(
  `*[_type == "product" && defined(slug.current) && coalesce(published, true)]{"slug": slug.current}`,
);

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const result = await sanityFetch({
      query: productSlugs,
      perspective: "published",
      stega: false,
    });
    return result || [];
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const product = await sanityFetch({
      query: productBySlugQuery,
      params,
      stega: false,
    });
    const previousImages = (await parent).openGraph?.images || [];
    const ogImage = resolveOpenGraphImage(product?.image);

    return {
      title: product?.title,
      description: product?.category?.title
        ? `${product.category.title} from the Albert Vigoleis Thelen memorabilia shop`
        : "Available from the Albert Vigoleis Thelen memorabilia shop",
      openGraph: {
        images: ogImage ? [ogImage, ...previousImages] : previousImages,
      },
    } satisfies Metadata;
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return {
      title: "Shop",
      description: "Memorabilia shop",
    };
  }
}

export default async function ProductPage({ params }: Props) {
  let product = null;

  try {
    product = await sanityFetch({ query: productBySlugQuery, params });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return notFound();
  }

  if (!product?._id) {
    return notFound();
  }

  const outOfStock = Number(product.inventory) <= 0;
  const images = product.images || [];
  const [primaryImage, ...galleryImages] = images;

  return (
    <div className="container mx-auto px-5 py-16">
      <Link
        href="/shop"
        className="inline-block mb-8 text-gray-600 hover:text-black hover:underline"
      >
        ← Back to shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          {primaryImage?.asset?._ref ? (
            <div className="relative bg-gray-100 aspect-[3/4] rounded-lg overflow-hidden">
              <Image
                className="object-cover"
                fill
                alt={primaryImage.alt || product.title}
                src={urlForImage(primaryImage)?.width(1200).url() as string}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          ) : (
            <div className="flex aspect-[3/4] items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-gray-500">No image</p>
            </div>
          )}

          {galleryImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {galleryImages.map((image: any, index: number) => (
                <div
                  key={image.asset?._ref || index}
                  className="relative bg-gray-100 aspect-square rounded-lg overflow-hidden"
                >
                  {image?.asset?._ref ? (
                    <Image
                      className="object-cover"
                      fill
                      alt={image.alt || product.title}
                      src={urlForImage(image)?.width(400).url() as string}
                      sizes="(max-width: 1024px) 33vw, 16vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-gray-500 text-xs">No image</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.category?.title && (
            <p className="mb-2 text-sm font-medium text-gray-500">
              {product.category.title}
            </p>
          )}
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            {product.title}
          </h1>
          <p className="mb-6 text-3xl font-bold">
            €{Number(product.price).toFixed(2)}
          </p>

          <div className="mb-8">
            {outOfStock ? (
              <span className="inline-block bg-gray-200 text-gray-700 text-sm font-semibold px-3 py-1 rounded">
                Out of stock
              </span>
            ) : (
              <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded">
                In stock
              </span>
            )}
          </div>

          {product.description?.length > 0 && (
            <div className="max-w-none">
              <PortableText
                value={product.description as PortableTextBlock[]}
              />
            </div>
          )}

          {!product.description?.length && (
            <p className="text-gray-600">
              Details about this item will be added soon. Please contact us for
              more information.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
