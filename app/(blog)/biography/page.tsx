import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biography",
};

export default function BiographyPage() {
  return (
    <div className="container mx-auto px-5 py-16">
      <h1 className="mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        Biography
      </h1>
      <div className="prose prose-lg max-w-none">
        <p>Biography content will be added here.</p>
      </div>
    </div>
  );
}
