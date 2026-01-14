import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
};

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-5 py-16">
      <h1 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        Photo Gallery
      </h1>
      <p className="mb-12 text-lg text-gray-600">
        Explore rare photographs and images from the life and times of Albert
        Vigoleis Thelen.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-100 aspect-square flex items-center justify-center rounded-lg">
          <p className="text-gray-500">Photo 1</p>
        </div>
        <div className="bg-gray-100 aspect-square flex items-center justify-center rounded-lg">
          <p className="text-gray-500">Photo 2</p>
        </div>
        <div className="bg-gray-100 aspect-square flex items-center justify-center rounded-lg">
          <p className="text-gray-500">Photo 3</p>
        </div>
        <div className="bg-gray-100 aspect-square flex items-center justify-center rounded-lg">
          <p className="text-gray-500">Photo 4</p>
        </div>
        <div className="bg-gray-100 aspect-square flex items-center justify-center rounded-lg">
          <p className="text-gray-500">Photo 5</p>
        </div>
        <div className="bg-gray-100 aspect-square flex items-center justify-center rounded-lg">
          <p className="text-gray-500">Photo 6</p>
        </div>
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
        <p className="text-gray-700">
          The photo gallery will be fully integrated with Sanity CMS, allowing
          you to upload and manage photos through the admin interface. You&apos;ll be
          able to add captions, organize by categories, and create albums.
        </p>
      </div>
    </div>
  );
}
