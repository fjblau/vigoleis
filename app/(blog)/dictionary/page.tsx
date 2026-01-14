import type { Metadata } from "next";
import { type PortableTextBlock } from "next-sanity";

import PortableText from "../portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { dictionaryQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Dictionary",
};

export default async function DictionaryPage() {
  const dictionary = await sanityFetch({ query: dictionaryQuery });

  return (
    <div className="container mx-auto px-5 py-16">
      <h1 className="mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        {dictionary?.title || "Dictionary"}
      </h1>
      {dictionary?.content?.length && (
        <PortableText
          className="max-w-none"
          value={dictionary.content as PortableTextBlock[]}
        />
      )}
    </div>
  );
}
