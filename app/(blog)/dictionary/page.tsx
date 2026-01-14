import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dictionary",
};

export default function DictionaryPage() {
  return (
    <div className="container mx-auto px-5 py-16">
      <h1 className="mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        Dictionary
      </h1>
      <p className="text-lg">Content coming soon.</p>
    </div>
  );
}
