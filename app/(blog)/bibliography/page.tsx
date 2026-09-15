import type { Metadata } from "next";

import { sanityFetch } from "@/sanity/lib/fetch";
import { bibliographyQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Bibliography",
};

interface Entry {
  title?: string;
  year?: string;
  description?: string;
}

interface Subsection {
  heading?: string;
  entries?: Entry[];
}

interface Section {
  heading?: string;
  subsections?: Subsection[];
}

interface BibliographyData {
  title?: string;
  sections?: Section[];
}

export default async function BibliographyPage() {
  const data = (await sanityFetch({
    query: bibliographyQuery,
  })) as BibliographyData | null;

  return (
    <div className="container mx-auto px-5 py-16">
      <h1 className="mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        {data?.title || "Bibliographie"}
      </h1>

      {data?.sections && data.sections.length > 0 ? (
        <div className="prose prose-lg max-w-none">
          {data.sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.heading && (
                <h2 className={sectionIndex > 0 ? "mt-12" : undefined}>
                  {section.heading}
                </h2>
              )}
              {section.subsections?.map((subsection, subsectionIndex) => (
                <div key={subsectionIndex}>
                  {subsection.heading && (
                    <h3 className="mt-8">{subsection.heading}</h3>
                  )}
                  {subsection.entries && subsection.entries.length > 0 && (
                    <ul>
                      {subsection.entries.map((entry, entryIndex) => (
                        <li key={entryIndex}>
                          <strong>{entry.title}</strong>
                          {entry.year && <> {entry.year}</>}
                          {entry.description && (
                            <>
                              <br />
                              {entry.description}
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <p className="text-gray-700">
            No bibliography content has been added yet. Please add content
            through the Sanity CMS.
          </p>
        </div>
      )}
    </div>
  );
}
