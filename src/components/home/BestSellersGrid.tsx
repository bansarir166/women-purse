"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { PRODUCTS } from "@/data/products";
import { LuxurySelect, SelectOption } from "@/components/ui/LuxurySelect";

const BESTSELLER_SORT_OPTIONS: SelectOption<"featured" | "price-asc" | "price-desc" | "rating">[] = [
  { value: "featured", label: "Editorial Choice" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const CATEGORIES = ["All", "Handbags", "Shoulder Bags", "Totes", "Mini Bags"];

export const BestSellersGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");

  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller);

  const filtered = bestSellers
    .filter((product) => (activeCategory === "All" ? true : product.category === activeCategory))
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // featured default
    });

  return (
    <section className="py-20 sm:py-28 bg-[#FBF9F5] border-b border-[#EAE3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#9A7B4F] font-sans-clean font-semibold block mb-2">
              Most Coveted Editions
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-[#191411] font-normal tracking-tight">
              Best Sellers
            </h2>
          </div>

          {/* Sort Selector */}
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-[#7A6F62] font-sans-clean">
              Sort By:
            </span>
            <LuxurySelect
              value={sortBy}
              onChange={(val) => setSortBy(val)}
              options={BESTSELLER_SORT_OPTIONS}
              buttonClassName="bg-[#F5F1EB] py-2"
              ariaLabel="Sort best sellers"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-12 border-b border-[#EAE3D9] pb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-xs uppercase tracking-[0.18em] font-sans-clean font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#191411] text-[#FAF8F5]"
                  : "bg-[#F5F1EB] text-[#554C42] hover:text-[#191411] hover:bg-[#EAE3D9]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#191411] text-[#FAF8F5] hover:bg-[#382E26] text-xs uppercase tracking-[0.22em] font-sans-clean font-semibold transition-colors cursor-pointer"
          >
            View All Pieces ({PRODUCTS.length})
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
