import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
};

export default function ShopPage() {
  return (
    <div className="container mx-auto px-5 py-16">
      <h1 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        Memorabilia Shop
      </h1>
      <p className="mb-12 text-lg text-gray-600">
        Rare books, collectibles, and memorabilia related to Albert Vigoleis
        Thelen and his literary works.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div className="bg-gray-100 aspect-[3/4] flex items-center justify-center">
            <p className="text-gray-500">Product Image</p>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2">Sample Product 1</h3>
            <p className="text-gray-600 text-sm mb-3">
              First edition or rare collectible item
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">€XX.XX</span>
              <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div className="bg-gray-100 aspect-[3/4] flex items-center justify-center">
            <p className="text-gray-500">Product Image</p>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2">Sample Product 2</h3>
            <p className="text-gray-600 text-sm mb-3">
              Signed copy or special edition
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">€XX.XX</span>
              <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div className="bg-gray-100 aspect-[3/4] flex items-center justify-center">
            <p className="text-gray-500">Product Image</p>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2">Sample Product 3</h3>
            <p className="text-gray-600 text-sm mb-3">
              Commemorative item or merchandise
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">€XX.XX</span>
              <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 bg-amber-50 rounded-lg border border-amber-200">
        <h2 className="text-xl font-bold mb-2">Shop Coming Soon</h2>
        <p className="text-gray-700 mb-4">
          The online shop is currently under construction. When ready, it will
          feature:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Secure payment processing via Shopify or Stripe</li>
          <li>Inventory management through Sanity CMS</li>
          <li>Product catalog with detailed descriptions and images</li>
          <li>Shopping cart and checkout functionality</li>
          <li>Order tracking and customer management</li>
        </ul>
        <p className="mt-4 text-gray-700">
          In the meantime, please check back soon or contact us for inquiries
          about available items.
        </p>
      </div>
    </div>
  );
}
