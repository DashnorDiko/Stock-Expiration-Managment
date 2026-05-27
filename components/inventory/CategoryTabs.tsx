"use client";

import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/constants/categories";
import { ProductCategory } from "@/lib/types/domain";
import clsx from "clsx";

type CategoryTabsProps = {
  selectedCategory: ProductCategory;
  onChange: (category: ProductCategory) => void;
};

export function CategoryTabs({ onChange, selectedCategory }: CategoryTabsProps) {
  return (
    <div className="sticky top-0 z-10 -mx-4 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 md:top-4 md:rounded-xl md:border">
      <div className="flex min-w-max gap-2">
        {CATEGORY_ORDER.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={clsx(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              selectedCategory === category ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
            )}
          >
            {CATEGORY_META[category].label}
          </button>
        ))}
      </div>
    </div>
  );
}

