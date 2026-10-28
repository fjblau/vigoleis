import type { Metadata } from "next";
import { type PortableTextBlock } from "next-sanity";

import PortableText from "../portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { legalNoticeQuery } from "@/sanity/lib/queries";
import DataRequestForm from "./data-request-form";
import SelfServiceDataForm from "./self-service-data-form";

export const metadata: Metadata = {
  title: "Impressum",
};

export default async function LegalNoticePage() {
  const legalNotice = await sanityFetch({ query: legalNoticeQuery });

  return (
    <div lang="de" className="container mx-auto px-5 py-16">
      <h1 className="mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        {legalNotice?.title || "Impressum"}
      </h1>
      {legalNotice?.body?.length ? (
        <PortableText
          className="max-w-none"
          value={legalNotice.body as PortableTextBlock[]}
        />
      ) : (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700">
            Der Inhalt des Impressums wurde noch nicht hinzugefügt. Bitte
            ergänzen Sie ihn im Sanity CMS.
          </p>
        </div>
      )}

      <SelfServiceDataForm />
      <DataRequestForm />
    </div>
  );
}
