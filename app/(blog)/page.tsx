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
      <h1 className="text-balance text-6xl font-bold leading-tight tracking-tighter lg:pr-8 lg:text-8xl">
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
            <h2 className="mb-6 text-4xl font-bold leading-tight lg:text-5xl">
              Albert Vigoleis Thelen (1903-1989)
            </h2>
            <div className="prose prose-lg">
              <p className="text-lg leading-relaxed">
                Albert Vigoleis Thelen war ein deutscher Schriftsteller, Übersetzer und Dichter, 
                dessen Hauptwerk <em>Die Insel des zweiten Gesichts</em> (1953) zu den bedeutendsten 
                deutschen Romanen des 20. Jahrhunderts zählt. Mit seinem einzigartigen, sprachgewaltigen 
                Stil und seinem feinen Humor schuf er ein literarisches Werk, das ihn zu einem der 
                außergewöhnlichsten Autoren seiner Zeit macht.
              </p>
              <p className="text-lg leading-relaxed">
                Diese Website widmet sich dem Leben und Werk von Albert Vigoleis Thelen und bietet 
                Informationen zu seinen Publikationen, seiner Biographie und aktuellen Neuigkeiten 
                aus der Thelen-Forschung.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
