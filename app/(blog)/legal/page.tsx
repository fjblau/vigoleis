import type { Metadata } from "next";
import { type PortableTextBlock } from "next-sanity";

import PortableText from "../portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { legalNoticeQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Legal Notice",
};

export default async function LegalNoticePage() {
  const legalNotice = await sanityFetch({ query: legalNoticeQuery });

  return (
    <div className="container mx-auto px-5 py-16">
      <h1 className="mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        {legalNotice?.title || "Legal Notice"}
      </h1>
      {legalNotice?.body?.length ? (
        <PortableText
          className="max-w-none"
          value={legalNotice.body as PortableTextBlock[]}
        />
      ) : (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700">
            The legal notice / imprint content has not been added yet. Please
            add it through the Sanity CMS.
          </p>
        </div>
      )}
    </div>
  );
}
