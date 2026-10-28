import type { Metadata } from "next";

import DataRequestForm from "./data-request-form";
import SelfServiceDataForm from "./self-service-data-form";

export const metadata: Metadata = {
  title: "Impressum",
};

export default function LegalNoticePage() {
  return (
    <div lang="de" className="container mx-auto px-5 py-16">
      <h1 className="mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        Impressum
      </h1>
      <address className="space-y-2 not-italic">
        <p>Dr. Jürgen Pütz</p>
        <p>
          Herbert-Lewin-Straße 1
          <br />
          50931 Köln
        </p>
        <p>
          Tel.:{" "}
          <a className="hover:underline" href="tel:+491636853468">
            +49 163 68 534 68
          </a>
          <br />
          E-Mail:{" "}
          <a className="hover:underline" href="mailto:puetz@vigoleis.de">
            puetz@vigoleis.de
          </a>
        </p>
      </address>
      <p className="mt-8">Verantwortlich für den Inhalt: Dr. Jürgen Pütz</p>

      <SelfServiceDataForm />
      <DataRequestForm />
    </div>
  );
}
