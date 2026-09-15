import Image from "next/image";

import PortableText from "./portable-text";

import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";

function Intro(props: { title: string | null | undefined; description: any }) {
  const title = props.title || demo.title;
  const description = props.description?.length
    ? props.description
    : demo.description;
  return (
    <section className="mt-16 mb-16 flex flex-col items-center lg:mb-12 lg:flex-row lg:justify-between">
      <h1 className="text-balance text-5xl font-bold leading-tight tracking-tighter lg:pr-8 lg:text-7xl">
        {title || demo.title}
      </h1>
      <h2 className="text-pretty mt-5 text-center text-lg lg:pl-8 lg:text-left">
        <PortableText
          className="prose-lg"
          value={description?.length ? description : demo.description}
        />
      </h2>
    </section>
  );
}

export const dynamic = "force-dynamic";

export default async function Page() {
  let settings = null;

  try {
    settings = await sanityFetch({
      query: settingsQuery,
    });
  } catch (error) {
    console.error("Failed to fetch from Sanity:", error);
  }

  const introText: any = settings?.introText?.length
    ? settings.introText
    : demo.introText;

  return (
    <div className="container mx-auto px-5">
      <Intro title={settings?.title} description={settings?.description} />
      
      <section className="mb-20 md:mb-28">
        <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
          <div className="mb-8 md:mb-0">
            <Image
              src="/images/thelen-portrait.jpg"
              alt="Albert Vigoleis Thelen"
              width={800}
              height={1000}
              className="rounded-lg shadow-lg"
              priority
            />
          </div>
          <div>
            <PortableText className="prose-lg" value={introText} />
          </div>
        </div>
      </section>

    </div>
  );
}
