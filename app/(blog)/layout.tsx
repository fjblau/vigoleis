import "../globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import Link from "next/link";
import {
  VisualEditing,
  toPlainText,
  type PortableTextBlock,
} from "next-sanity";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";

import AlertBanner from "./alert-banner";
import ConsentBanner from "./consent-banner";
import Header from "./header";
import PortableText from "./portable-text";
import { CartProvider } from "./cart-provider";

import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  
  try {
    settings = await sanityFetch({
      query: settingsQuery,
      stega: false,
    });
  } catch (error) {
    console.error("Failed to fetch settings for metadata:", error);
  }
  
  const title = settings?.title || demo.title;
  const description = settings?.description || demo.description;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let data = null;
  
  try {
    data = await sanityFetch({ query: settingsQuery });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
  }
  
  const footer = data?.footer || [];
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en" className={`${inter.variable} bg-white text-black`}>
      <body>
        <section className="min-h-screen">
          {isDraftMode && <AlertBanner />}
          <CartProvider>
            <Header />
            <main>{children}</main>
            <footer className="bg-accent-1 border-accent-2 border-t">
              <div className="container mx-auto px-5">
                {footer.length > 0 ? (
                  <PortableText
                    className="prose-sm text-pretty bottom-0 w-full max-w-none bg-white py-12 text-center md:py-20"
                    value={footer as PortableTextBlock[]}
                  />
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-gray-600">
                      © {new Date().getFullYear()} Albert Vigoleis Thelen
                      Tribute Site. All rights reserved.
                    </p>
                  </div>
                )}
                <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-accent-2 py-6 text-sm text-gray-600">
                  <Link
                    href="/privacy"
                    className="hover:underline transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="hover:underline transition-colors duration-200"
                  >
                    Terms &amp; Conditions
                  </Link>
                  <Link
                    href="/legal"
                    className="hover:underline transition-colors duration-200"
                  >
                    Legal Notice
                  </Link>
                </nav>
              </div>
            </footer>
          </CartProvider>
        </section>
        <ConsentBanner />
        {isDraftMode && <VisualEditing />}
        <SpeedInsights />
      </body>
    </html>
  );
}
