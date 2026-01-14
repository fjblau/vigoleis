import type { Metadata } from "next";
import { Image } from "next-sanity/image";

import { sanityFetch } from "@/sanity/lib/fetch";
import { linksEphemeraQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/utils";

export const metadata: Metadata = {
  title: "Links & Ephemera",
};

interface Link {
  title?: string;
  url?: string;
  description?: string;
  image?: {
    asset?: any;
    alt?: string;
    hotspot?: any;
    crop?: any;
  };
}

interface LinkCategory {
  categoryTitle: string;
  categoryDescription?: string;
  links?: Link[];
}

interface LinksEphemeraData {
  title: string;
  description?: string;
  categories?: LinkCategory[];
}

export default async function LinksPage() {
  const data = await sanityFetch({ query: linksEphemeraQuery }) as LinksEphemeraData | null;

  return (
    <div className="container mx-auto px-5 py-16">
      <h1 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        {data?.title || "Links & Ephemera"}
      </h1>
      {data?.description && (
        <p className="mb-12 text-lg text-gray-600">{data.description}</p>
      )}

      {data?.categories && data.categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.categories.map((category, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold mb-2">{category.categoryTitle}</h3>
              {category.categoryDescription && (
                <p className="text-gray-600 mb-4">{category.categoryDescription}</p>
              )}
              {category.links && category.links.length > 0 && (
                <ul className="space-y-4">
                  {category.links
                    .filter((link) => link.image || link.description)
                    .map((link, linkIndex) => (
                      <li key={linkIndex}>
                        {link.image?.asset && (
                          <div className="mb-2">
                            {link.url ? (
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                              >
                                <Image
                                  className="h-auto w-full rounded-md"
                                  src={
                                    urlForImage(link.image)
                                      ?.width(800)
                                      .url() as string
                                  }
                                  alt={link.image.alt || link.title || ""}
                                  width={800}
                                  height={400}
                                />
                              </a>
                            ) : (
                              <Image
                                className="h-auto w-full rounded-md"
                                src={
                                  urlForImage(link.image)
                                    ?.width(800)
                                    .url() as string
                                }
                                alt={link.image.alt || link.title || ""}
                                width={800}
                                height={400}
                              />
                            )}
                          </div>
                        )}
                        {link.title && link.url && (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-2"
                          >
                            <span>→</span> {link.title}
                          </a>
                        )}
                        {link.description && (
                          <p
                            className={`text-sm text-gray-500 ${link.title && link.url ? "ml-5" : ""} mt-1`}
                          >
                            {link.description}
                          </p>
                        )}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700">
            No links have been added yet. Please add content through the Sanity CMS.
          </p>
        </div>
      )}
    </div>
  );
}
