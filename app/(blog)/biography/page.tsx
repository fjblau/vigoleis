import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import { notFound } from "next/navigation";

import { sanityFetch } from "@/sanity/lib/fetch";

export const metadata: Metadata = {
  title: "Biography",
};

const biographyQuery = `
  *[_type == "biography"][0]{
    title,
    introHeading,
    intro,
    timelineHeading,
    timeline[]{
      _key,
      period,
      text
    }
  }
`;

type Entry = { _key: string; period?: string; text?: any };

type Biography = {
  title?: string;
  introHeading?: string;
  intro?: any;
  timelineHeading?: string;
  timeline?: Entry[];
};

export default async function BiographyPage() {
  const data = (await sanityFetch({ query: biographyQuery })) as Biography | null;

  if (!data) return notFound();

  return (
    <div className="container mx-auto px-5 py-16">
      <h1 className="mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        {data.title ?? "Die Biographie"}
      </h1>
      <div className="prose prose-lg max-w-none">
        {data.introHeading && <h2>{data.introHeading}</h2>}
        {data.intro && <PortableText value={data.intro} />}

        {data.timelineHeading && (
          <h2 className="mt-12">{data.timelineHeading}</h2>
        )}

        <div className="space-y-6">
          {data.timeline?.map((entry) => (
            <div key={entry._key}>
              <h3 className="font-bold">{entry.period}</h3>
              {entry.text && <PortableText value={entry.text} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
