import type { Metadata } from "next";
import { PortableText, type PortableTextBlock } from "next-sanity";

import { sanityFetch } from "@/sanity/lib/fetch";
import { bibliographyQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Bibliography",
};

interface Entry {
  _key?: string;
  title?: string;
  year?: string;
  description?: string;
}

interface Subsection {
  _key?: string;
  number?: string;
  heading?: string;
  details?: PortableTextBlock[];
  entries?: Entry[];
}

interface Section {
  _key?: string;
  number?: string;
  heading?: string;
  details?: PortableTextBlock[];
  subsections?: Subsection[];
}

interface BibliographyData {
  title?: string;
  intro?: PortableTextBlock[];
  moreLabel?: string;
  sections?: Section[];
  footer?: PortableTextBlock[];
}

function romanNumeral(value: number) {
  const numerals: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let result = "";
  for (const [number, symbol] of numerals) {
    while (value >= number) {
      result += symbol;
      value -= number;
    }
  }
  return result;
}

function MoreLabel({ label }: { label: string }) {
  return (
    <span className="ml-2 whitespace-nowrap text-sm font-semibold text-stone-500 group-open:hidden">
      [{label}…]
    </span>
  );
}

export default async function BibliographyPage() {
  const data = (await sanityFetch({
    query: bibliographyQuery,
  })) as BibliographyData | null;
  const moreLabel = data?.moreLabel || "mehr";

  return (
    <div className="container mx-auto px-5 py-16">
      <h1 className="mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        {data?.title || "Bibliographie"}
      </h1>

      {data?.intro && data.intro.length > 0 && (
        <div className="prose prose-lg mb-10 max-w-none">
          <PortableText value={data.intro} />
        </div>
      )}

      {data?.sections && data.sections.length > 0 ? (
        <div className="max-w-4xl space-y-8">
          {data.sections.map((section, sectionIndex) => {
            const heading = (
              <>
                <span className="mr-2">{section.number || romanNumeral(sectionIndex + 1)}</span>
                {section.heading}
              </>
            );
            return (
              <section key={section._key || sectionIndex}>
                {section.details && section.details.length > 0 ? (
                  <details className="group">
                    <summary className="cursor-pointer list-none text-xl font-bold marker:hidden [&::-webkit-details-marker]:hidden">
                      {heading}<MoreLabel label={moreLabel} />
                    </summary>
                    <div className="prose prose-lg mt-4 max-w-none pl-5">
                      <PortableText value={section.details} />
                    </div>
                  </details>
                ) : (
                  <h2 className="text-xl font-bold">{heading}</h2>
                )}

                {section.subsections && section.subsections.length > 0 && (
                  <div className="mt-4 space-y-4 pl-5">
                    {section.subsections.map((subsection, subsectionIndex) => {
                      const hasContent = Boolean(subsection.details?.length || subsection.entries?.length);
                      const subsectionHeading = (
                        <>
                          <span className="mr-2">{subsection.number || subsectionIndex + 1}</span>
                          {subsection.heading}
                        </>
                      );
                      const content = (
                        <div className="prose prose-lg mt-4 max-w-none pl-5">
                          {subsection.details && subsection.details.length > 0 && (
                            <PortableText value={subsection.details} />
                          )}
                          {subsection.entries && subsection.entries.length > 0 && (
                            <ul>
                              {subsection.entries.map((entry, entryIndex) => (
                                <li key={entry._key || entryIndex}>
                                  <strong>{entry.title}</strong>
                                  {entry.year && <> {entry.year}</>}
                                  {entry.description && (
                                    <span className="block whitespace-pre-line">{entry.description}</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                      return (
                        <div key={subsection._key || subsectionIndex}>
                          {subsection.heading ? (
                            hasContent ? (
                              <details className="group">
                                <summary className="cursor-pointer list-none font-medium marker:hidden [&::-webkit-details-marker]:hidden">
                                  {subsectionHeading}<MoreLabel label={moreLabel} />
                                </summary>
                                {content}
                              </details>
                            ) : (
                              <h3 className="font-medium">{subsectionHeading}</h3>
                            )
                          ) : (
                            content
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <p className="text-gray-700">
            No bibliography content has been added yet. Please add content
            through the Sanity CMS.
          </p>
        </div>
      )}

      {data?.footer && data.footer.length > 0 && (
        <div className="prose prose-lg mt-12 max-w-4xl border-t border-stone-300 pt-6">
          <PortableText value={data.footer} />
        </div>
      )}
    </div>
  );
}
