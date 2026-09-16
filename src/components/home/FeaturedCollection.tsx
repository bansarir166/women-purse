"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { PRODUCTS } from "@/data/products";

export const FeaturedCollection: React.FC = () => {
  // Grab the 4 featured products explicitly requested
  const featuredIds = [
    "the-aurelia-bag",
    "the-celeste-tote",
    "the-elise-shoulder-bag",
    "the-sofia-mini",
  ];

  const featuredProducts = featuredIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <section className="py-20 sm:py-28 bg-[#FBF9F5] border-b border-[#EAE3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-16">
          <div className="max-w-xl">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#9A7B4F] font-sans-clean font-semibold block mb-2">
              Curated Highlights
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-[#191411] font-normal tracking-tight">
              The Flagship Editions
            </h2>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/shop"
              className="text-xs uppercase tracking-[0.2em] font-sans-clean font-semibold text-[#191411] hover:text-[#9A7B4F] transition-colors inline-flex items-center gap-2 group"
            >
              Explore Full Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 4 Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8">
          {featuredProducts.map((product, idx) => (
            <ProductCard key={product!.id} product={product!} priority={idx === 0} />
          ))}
        </div>

        {/* Bottom Editorial Callout */}
        <div className="mt-16 text-center border-t border-[#EAE3D9] pt-10">
          <p className="font-serif-luxury italic text-xl sm:text-2xl text-[#5A5046] max-w-2xl mx-auto">
            &ldquo;Each piece is numbered and finished with hand-burnished edges, created in limited runs to ensure uncompromising intimacy.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
};
