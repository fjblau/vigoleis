import type { Metadata } from "next";
import { type PortableTextBlock } from "next-sanity";

import PortableText from "../portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { termsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default async function TermsPage() {
  const terms = await sanityFetch({ query: termsQuery });

  return (
    <div className="container mx-auto px-5 py-16">
      <h1 className="mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        {terms?.title || "Terms & Conditions"}
      </h1>
      {terms?.body?.length ? (
        <PortableText
          className="max-w-none"
          value={terms.body as PortableTextBlock[]}
        />
      ) : (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700">
            The terms &amp; conditions content has not been added yet. Please
            add it through the Sanity CMS.
          </p>
        </div>
      )}
    </div>
  );
}
