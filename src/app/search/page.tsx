"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Sparkles, SlidersHorizontal, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { LuxurySelect, SelectOption } from "@/components/ui/LuxurySelect";

const SEARCH_SORT_OPTIONS: SelectOption<"popular" | "newest" | "price-asc" | "price-desc" | "rating">[] = [
  { value: "popular", label: "Most Coveted" },
  { value: "newest", label: "New Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
];

const TRENDING_SEARCHES = [
  "The Aurelia Bag",
  "Italian Calfskin",
  "Everyday Totes",
  "Evening Mini Bags",
  "Champagne Gold",
  "Baguette",
  "Doctor Bag",
  "Nappa Leather",
];

const CATEGORIES = [
  "All",
  "Shoulder Bags",
  "Handbags",
  "Totes",
  "Mini Bags",
  "Clutches",
];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || searchParams.get("search") || "";

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "price-asc" | "price-desc" | "rating">("popular");

  // Keep input synchronized when query param changes
  useEffect(() => {
    const q = searchParams.get("q") || searchParams.get("search") || "";
    setInputQuery(q);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputQuery.trim();
    if (clean) {
      router.push(`/search?q=${encodeURIComponent(clean)}`);
    } else {
      router.push(`/search`);
    }
  };

  const handleClear = () => {
    setInputQuery("");
    router.push(`/search`);
  };

  const handlePillClick = (term: string) => {
    setInputQuery(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  // Filtered & Sorted Products
  const searchResults = useMemo(() => {
    const clean = inputQuery.trim().toLowerCase();

    return PRODUCTS.filter((product) => {
      // Category filter
      if (activeCategory !== "All" && product.category !== activeCategory) {
        return false;
      }

      // Query filter
      if (clean) {
        const matchesName = product.name.toLowerCase().includes(clean);
        const matchesDesc = product.description.toLowerCase().includes(clean);
        const matchesCat = product.category.toLowerCase().includes(clean);
        const matchesMat = product.materials.toLowerCase().includes(clean);
        const matchesTag = product.tags.some((t) => t.toLowerCase().includes(clean));
        const matchesColor = product.colors.some((c) => c.name.toLowerCase().includes(clean));

        if (!matchesName && !matchesDesc && !matchesCat && !matchesMat && !matchesTag && !matchesColor) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "newest") return a.isNewArrival ? -1 : 1;
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount; // popular
    });
  }, [inputQuery, activeCategory, sortBy]);

  // Featured recommendations when empty or for inspiration
  const featuredRecommendations = useMemo(() => {
    return PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);
  }, []);

  return (
    <main className="min-h-screen bg-[#FBF9F5] pb-24">
      {/* Editorial Header Banner */}
      <div className="bg-[#F5F1EB] border-b border-[#EAE3D9] py-12 sm:py-16 relative overflow-hidden">
        {/* Subtle Watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] text-[180px] font-serif-luxury leading-none tracking-widest text-[#191411] hidden xl:block">
          SEARCH
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Breadcrumbs */}
          <nav className="text-[11px] font-sans-clean uppercase tracking-[0.2em] text-[#7A6F62] mb-3 flex items-center justify-center gap-1.5">
            <Link href="/" className="hover:text-[#191411] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#191411] font-medium">Search the Collection</span>
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#EBE4D8] border border-[#D5C9B8] text-[#8C6D3F] text-[10px] uppercase tracking-[0.22em] font-sans-clean font-semibold rounded-full mb-3.5 shadow-xs">
            <Sparkles className="w-3 h-3 text-[#C5A880]" />
            <span>Atelier Archive Search</span>
          </div>

          {/* Title */}
          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-[#191411] font-normal tracking-tight mb-3">
            {inputQuery.trim() ? (
              <>
                Search Results for{" "}
                <span className="italic font-serif-luxury text-[#9A7B4F]">
                  &ldquo;{inputQuery.trim()}&rdquo;
                </span>
              </>
            ) : (
              "Discover the Atelier"
            )}
          </h1>

          <p className="text-sm font-sans-clean text-[#665D52] font-light max-w-xl mx-auto leading-relaxed mb-8">
            Explore our complete Florence catalog by silhouette name, leather grade, hardware finish, or functional occasion.
          </p>

          {/* Prominent Search Input Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto relative flex items-center bg-[#FAF8F5] border border-[#D8CEBF] rounded-full shadow-md focus-within:border-[#9A7B4F] focus-within:ring-2 focus-within:ring-[#9A7B4F]/20 transition-all p-1.5"
          >
            <div className="pl-4 text-[#8C7E70]">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search by silhouette, calfskin, tote, baguette, gold hardware..."
              className="flex-1 bg-transparent px-3 py-2 text-sm sm:text-base font-sans-clean text-[#191411] placeholder-[#A09384] focus:outline-hidden"
              autoFocus
            />
            {inputQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 mr-1 text-[#7A6F62] hover:text-[#191411] transition-colors rounded-full hover:bg-[#EAE3D9]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#191411] text-[#FAF8F5] text-xs uppercase tracking-[0.16em] font-sans-clean font-semibold rounded-full hover:bg-[#332A24] transition-colors cursor-pointer shrink-0"
            >
              Search
            </button>
          </form>

          {/* Trending Searches Pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] font-sans-clean uppercase tracking-[0.2em] text-[#8C7E70] mr-1">
              Popular Searches:
            </span>
            {TRENDING_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => handlePillClick(term)}
                className="text-[11px] font-sans-clean px-3 py-1 bg-[#F2EDE5]/90 hover:bg-[#EAE3D9] text-[#554C42] hover:text-[#191411] rounded-full border border-[#DDD3C6] transition-all cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Results Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Category Pills & Sort Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EAE3D9]">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans-clean transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#191411] text-[#FAF8F5] border border-[#191411] shadow-xs font-medium"
                      : "bg-[#FDFBF7] hover:bg-[#EAE3D9] text-[#554C42] border border-[#D8CEBF] hover:text-[#191411]"
                  }`}
                >
                  {cat === "All" ? "All Silhouettes" : cat}
                </button>
              );
            })}
          </div>

          {/* Results Count & Sort Dropdown */}
          <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
            <span className="text-xs font-sans-clean text-[#7A6F62]">
              Showing <span className="font-semibold text-[#191411]">{searchResults.length}</span> pieces
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-[#7A6F62] font-sans-clean hidden sm:inline">
                Sort:
              </span>
              <LuxurySelect
                value={sortBy}
                onChange={(val) => setSortBy(val)}
                options={SEARCH_SORT_OPTIONS}
                ariaLabel="Sort search results"
              />
            </div>
          </div>
        </div>

        {/* Results Grid or Empty State */}
        {searchResults.length > 0 ? (
          <div className="pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#EFE9E0] border border-[#D8CEBF] flex items-center justify-center mx-auto mb-4 text-[#9A7B4F]">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#191411] mb-2">
              No matching silhouettes found
            </h3>
            <p className="text-xs sm:text-sm font-sans-clean text-[#665D52] font-light mb-6 leading-relaxed">
              We couldn&apos;t find any pieces matching &ldquo;{inputQuery}&rdquo;. Try searching for broader terms such as &ldquo;Tote&rdquo;, &ldquo;Shoulder&rdquo;, &ldquo;Calfskin&rdquo;, or explore our curated flagship collection below.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleClear}
                className="px-6 py-2.5 bg-[#FAF8F5] border border-[#D8CEBF] text-xs uppercase tracking-wider font-sans-clean text-[#191411] hover:bg-[#EAE3D9] transition-colors cursor-pointer"
              >
                Clear Search
              </button>
              <Link
                href="/shop"
                className="px-6 py-2.5 bg-[#191411] text-[#FAF8F5] text-xs uppercase tracking-wider font-sans-clean font-semibold hover:bg-[#332A24] transition-colors"
              >
                Browse Full Catalog
              </Link>
            </div>

            {/* Recommendations Subsection */}
            <div className="mt-16 pt-12 border-t border-[#EAE3D9]">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EBE4D8] text-[#8C6D3F] text-[10px] uppercase tracking-[0.2em] font-sans-clean font-semibold rounded-full mb-3">
                <Sparkles className="w-3 h-3 text-[#C5A880]" />
                <span>Atelier Recommendations</span>
              </div>
              <h4 className="font-serif-luxury text-xl sm:text-2xl text-[#191411] mb-8">
                Collector Favorites You May Admire
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                {featuredRecommendations.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Trust Section */}
        <div className="mt-20 pt-8 border-t border-[#EAE3D9] grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 p-4 bg-[#F7F3ED] border border-[#E8E1D5]">
            <Check className="w-5 h-5 text-[#9A7B4F] shrink-0" />
            <div>
              <p className="text-xs font-sans-clean uppercase tracking-wider font-semibold text-[#191411]">
                100% Full-Grain Tuscan Leather
              </p>
              <p className="text-[11px] font-sans-clean text-[#7A6F62]">
                Traceable hides tanned naturally in Florence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#F7F3ED] border border-[#E8E1D5]">
            <ShieldCheck className="w-5 h-5 text-[#9A7B4F] shrink-0" />
            <div>
              <p className="text-xs font-sans-clean uppercase tracking-wider font-semibold text-[#191411]">
                Complimentary Insured Delivery
              </p>
              <p className="text-[11px] font-sans-clean text-[#7A6F62]">
                Express global dispatch with signatures on delivery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#F7F3ED] border border-[#E8E1D5]">
            <Sparkles className="w-5 h-5 text-[#9A7B4F] shrink-0" />
            <div>
              <p className="text-xs font-sans-clean uppercase tracking-wider font-semibold text-[#191411]">
                30-Day Complimentary Returns
              </p>
              <p className="text-[11px] font-sans-clean text-[#7A6F62]">
                Atelier lifetime guarantee on stitching & hardware
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FBF9F5]" />}>
      <SearchContent />
    </Suspense>
  );
}
