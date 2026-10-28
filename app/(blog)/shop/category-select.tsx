"use client";

import { useRouter } from "next/navigation";

interface CategorySelectProps {
  categories: { id: string; title: string }[];
  selectedCategory: string;
}

export default function CategorySelect({
  categories,
  selectedCategory,
}: CategorySelectProps) {
  const router = useRouter();

  function handleChange(categoryId: string) {
    const params = new URLSearchParams(window.location.search);
    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    const query = params.toString();
    router.push(
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
      { scroll: false },
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label htmlFor="shop-category" className="text-sm font-medium text-gray-700">
        Category
      </label>
      <select
        id="shop-category"
        key={selectedCategory}
        defaultValue={selectedCategory}
        onChange={(event) => handleChange(event.target.value)}
        className="min-w-[180px] rounded border border-stone-300 bg-[#faf9f3] px-3 py-2 text-sm text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.title}
          </option>
        ))}
      </select>
    </div>
  );
}
