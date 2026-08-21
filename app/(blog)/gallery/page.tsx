import type { Metadata } from "next";

import GalleryClient, {
  type GalleryCategoryData,
  type GalleryPhoto,
} from "./gallery-client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { galleryQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/utils";

export const metadata: Metadata = {
  title: "Gallery",
};

interface SanityPhoto {
  image?: {
    asset?: { _ref?: string };
    alt?: string;
  };
  caption?: string;
  album?: string;
}

interface SanityCategory {
  categoryTitle?: string;
  photos?: SanityPhoto[];
}

interface GalleryData {
  title?: string;
  description?: string;
  categories?: SanityCategory[];
}

export default async function GalleryPage() {
  const data = (await sanityFetch({ query: galleryQuery })) as GalleryData | null;

  const categories: GalleryCategoryData[] = (data?.categories ?? [])
    .map((category): GalleryCategoryData => {
      const categoryTitle = category.categoryTitle || "Untitled Category";
      const photos: GalleryPhoto[] = (category.photos ?? [])
        .filter((photo) => photo.image?.asset?._ref)
        .map((photo) => {
          const image = photo.image!;
          return {
            thumbUrl:
              (urlForImage(image)
                ?.width(600)
                .height(600)
                .fit("crop")
                .url() as string) ?? "",
            fullUrl: (urlForImage(image)?.width(1600).url() as string) ?? "",
            alt: image.alt || photo.caption || categoryTitle,
            caption: photo.caption || "",
            album: photo.album || "",
          };
        });
      return { categoryTitle, photos };
    })
    .filter((category) => category.photos.length > 0);

  const hasPhotos = categories.some((c) => c.photos.length > 0);

  return (
    <div className="container mx-auto px-5 py-16">
      <h1 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        {data?.title || "Photo Gallery"}
      </h1>
      {data?.description ? (
        <p className="mb-12 text-lg text-gray-600">{data.description}</p>
      ) : (
        <p className="mb-12 text-lg text-gray-600">
          Explore rare photographs and images from the life and times of Albert
          Vigoleis Thelen.
        </p>
      )}

      {hasPhotos ? (
        <GalleryClient categories={categories} />
      ) : (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700">
            No photos have been added yet. Please add content through the
            Sanity CMS.
          </p>
        </div>
      )}
    </div>
  );
}
