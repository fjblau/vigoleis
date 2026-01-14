import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links & Ephemera",
};

export default function LinksPage() {
  return (
    <div className="container mx-auto px-5 py-16">
      <h1 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        Links & Ephemera
      </h1>
      <p className="mb-12 text-lg text-gray-600">
        A curated collection of resources, articles, and rare materials related
        to Albert Vigoleis Thelen and his works.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold mb-2">External Resources</h3>
          <p className="text-gray-600 mb-4">
            Links to academic articles, reviews, and biographical materials.
          </p>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                <span>→</span> Sample Resource Link 1
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                <span>→</span> Sample Resource Link 2
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                <span>→</span> Sample Resource Link 3
              </a>
            </li>
          </ul>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold mb-2">Digital Archive</h3>
          <p className="text-gray-600 mb-4">
            Rare documents, manuscripts, and historical materials.
          </p>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                <span>→</span> Document Collection 1
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                <span>→</span> Document Collection 2
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                <span>→</span> Document Collection 3
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
        <p className="text-gray-700">
          Links and resources will be manageable through Sanity CMS. You&apos;ll be
          able to add new links, categorize them, and provide descriptions
          through the admin interface.
        </p>
      </div>
    </div>
  );
}
