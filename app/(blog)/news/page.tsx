import { Suspense } from "react";
import type { Metadata } from "next";

import MoreStories from "../more-stories";
import Onboarding from "../onboarding";

import { sanityFetch } from "@/sanity/lib/fetch";
import { heroQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "News",
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  let heroPost = null;

  try {
    heroPost = await sanityFetch({ query: heroQuery });
  } catch (error) {
    console.error("Failed to fetch from Sanity:", error);
  }

  return (
    <div className="container mx-auto px-5 py-16">
      <h1 className="mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        Latest News
      </h1>
      {heroPost?._id ? (
        <Suspense>
          <MoreStories skip="" limit={100} />
        </Suspense>
      ) : (
        <Onboarding />
      )}
    </div>
  );
}
