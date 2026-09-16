"use client";

import React, { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Filter, X, SlidersHorizontal, Sparkles, ShieldCheck, Check } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { FilterState } from "@/types";

import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters } from "@/components/product/ProductFilters";
import { motion, AnimatePresence } from "framer-motion";
import { LuxurySelect, SelectOption } from "@/components/ui/LuxurySelect";

const SORT_OPTIONS: SelectOption<FilterState["sortBy"]>[] = [
  { value: "popular", label: "Most Coveted" },
  { value: "newest", label: "New Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Customer Rating" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSort = (searchParams.get("sort") as FilterState["sortBy"]) || "popular";
  const initialSearch = searchParams.get("search") || "";

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    color: "All",
    material: "All",
    minPrice: 0,
    maxPrice: 350,
    sortBy: initialSort,
    size: "All",
    searchQuery: initialSearch,
  });

  // Sync state whenever search parameters in URL change (e.g. clicking header links)
  React.useEffect(() => {
    const cat = searchParams.get("category") || "All";
    const sort = (searchParams.get("sort") as FilterState["sortBy"]) || "popular";
    const search = searchParams.get("search") || "";
    const color = searchParams.get("color") || "All";
    const material = searchParams.get("material") || "All";

    setFilters((prev) => ({
      ...prev,
      category: cat,
      sortBy: sort,
      searchQuery: search,
      color: color,
      material: material,
    }));
  }, [searchParams]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: "All",
      color: "All",
      material: "All",
      minPrice: 0,
      maxPrice: 350,
      sortBy: "popular",
      size: "All",
      searchQuery: "",
    });
  };

  const tagParam = searchParams.get("tag") || "";

  // Dynamic Header Titles, Badges, Descriptions & Editorial Images based on selected category, tag, or sort
  const headerContent = useMemo(() => {
    if (tagParam === "Featured") {
      return {
        tagBadge: "Curated Flagship Editions",
        title: "The Featured Collection",
        description:
          "Our flagship four silhouettes, representing the purest expression of VELORA's architectural design language and Florence craftsmanship.",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=85&w=1000&auto=format&fit=crop",
        highlight: "The Aurelia, Celeste, Elise & Sofia",
        edition: "4 Signature Pieces",
      };
    }
    if (filters.category === "Handbags") {
      return {
        tagBadge: "Sculpted Top-Handle Satchels",
        title: "The Handbag Collection",
        description:
          "Sculpted top-handles, heritage doctor satchels, and firm Italian palmellato leather engineered for timeless distinction.",
        image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=85&w=1000&auto=format&fit=crop",
        highlight: "The Genevieve Satchel & Mirabelle",
        edition: "Florence Atelier Edition",
      };
    }
    if (filters.category === "Shoulder Bags") {
      return {
        tagBadge: "Crescent & Baguette Silhouettes",
        title: "Shoulder Bags & Baguettes",
        description:
          "Graceful crescent curves, effortless underarm drops, and tactile nappa leather draping that moves with quiet elegance.",
        image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=85&w=1000&auto=format&fit=crop",
        highlight: "The Elise & The Aurelia Bag",
        edition: "Underarm Ergonomics",
      };
    }
    if (filters.category === "Totes") {
      return {
        tagBadge: "Architectural Everyday Totes",
        title: "Architectural Totes & Weekenders",
        description:
          "Spacious everyday totes and grand travel companions with dedicated laptop compartments and vegetable-tanned durability.",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=85&w=1000&auto=format&fit=crop",
        highlight: "The Celeste & Delphine Grand Tote",
        edition: "Double-Faced Tuscan Leather",
      };
    }
    if (filters.category === "Mini Bags") {
      return {
        tagBadge: "Jewel-Box Evening Minis",
        title: "Mini Bags & Evening Purses",
        description:
          "Jewel-box evening silhouettes, hand-woven curb chains, and compact black-tie luxury designed for unforgettable nights.",
        image: "https://images.unsplash.com/photo-1575032617751-6ddec2089882?q=85&w=1000&auto=format&fit=crop",
        highlight: "The Sofia Mini & Serena Convertible",
        edition: "24K Champagne Gold Accents",
      };
    }
    if (filters.category === "Clutches") {
      return {
        tagBadge: "Origami Envelope Clutches",
        title: "Envelope Clutches & Evening Pouches",
        description:
          "Sleek origami silhouettes, high-gloss 24K gold snake chains, and moire silk linings for black-tie elegance.",
        image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=85&w=1000&auto=format&fit=crop",
        highlight: "The Clara Envelope Clutch",
        edition: "Black-Tie Gala Edition",
      };
    }
    if (filters.sortBy === "newest") {
      return {
        tagBadge: "Autumn / Winter 2026",
        title: "New Arrivals: Autumn / Winter 2026",
        description:
          "The latest seasonal debuts, limited atelier allocations, and newly unveiled Italian leather silhouettes from Florence.",
        image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=85&w=1000&auto=format&fit=crop",
        highlight: "Fresh Tuscan Tannery Runs",
        edition: "Limited Seasonal Allocation",
      };
    }
    if (filters.sortBy === "popular") {
      return {
        tagBadge: "Most Coveted Silhouettes",
        title: "Best Sellers: Most Coveted Silhouettes",
        description:
          "The timeless bags collectors reach for every day, revered for their durability, proportion, and quiet prestige.",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=85&w=1000&auto=format&fit=crop",
        highlight: "Collector Favorite Editions",
        edition: "Permanent Atelier Archive",
      };
    }
    return {
      tagBadge: "Florence Atelier Collection",
      title: "The Complete Atelier",
      description:
        "Every silhouette is engineered in Florence with full-grain Tuscan hides, solid brass fixtures, and hand-burnished edges. Built to accompany your finest chapters.",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=85&w=1000&auto=format&fit=crop",
      highlight: "All 12 Handcrafted Pieces",
      edition: "Italian Artisan Craft",
    };
  }, [filters.category, filters.sortBy, tagParam]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Tag filter (e.g. Featured Collection)
      if (tagParam === "Featured" && !product.isFeatured) {
        return false;
      }
      // Category
      if (filters.category !== "All" && product.category !== filters.category) {
        return false;
      }
      // Color
      if (
        filters.color !== "All" &&
        !product.colors.some((c) => c.name.toLowerCase().includes(filters.color.toLowerCase()))
      ) {
        return false;
      }
      // Material
      if (filters.material !== "All" && !product.materials.includes(filters.material)) {
        return false;
      }
      // Size
      if (filters.size !== "All" && product.size !== filters.size) {
        return false;
      }
      // Price
      if (product.price > filters.maxPrice) {
        return false;
      }
      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const match =
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.materials.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "newest") {
        return a.isNewArrival ? -1 : 1;
      }
      if (filters.sortBy === "price-asc") {
        return a.price - b.price;
      }
      if (filters.sortBy === "price-desc") {
        return b.price - a.price;
      }
      if (filters.sortBy === "rating") {
        return b.rating - a.rating;
      }
      // popular
      return b.reviewsCount - a.reviewsCount;
    });
  }, [filters, tagParam]);

  return (
    <main className="min-h-screen bg-[#FBF9F5] pb-24">
      {/* Editorial Header & Visual Showcase */}
      <div className="bg-[#F5F1EB] border-b border-[#EAE3D9] py-10 sm:py-14 lg:py-16 relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] text-[200px] font-serif-luxury leading-none tracking-widest text-[#191411] hidden xl:block">
          VELORA
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (7 cols): Editorial Text & Quick Switcher */}
            <div className="lg:col-span-7">
              {/* Breadcrumb Navigation */}
              <nav className="text-[11px] font-sans-clean uppercase tracking-[0.2em] text-[#7A6F62] mb-3 flex items-center gap-1.5">
                <Link href="/" className="hover:text-[#191411] transition-colors">
                  Home
                </Link>
                <span>/</span>
                {tagParam === "Featured" ? (
                  <span className="text-[#191411] font-medium">Featured Collection</span>
                ) : filters.sortBy === "popular" && filters.category === "All" ? (
                  <span className="text-[#191411] font-medium">Best Sellers</span>
                ) : filters.category !== "All" ? (
                  <>
                    <Link href="/shop" className="hover:text-[#191411] transition-colors">
                      Collection
                    </Link>
                    <span>/</span>
                    <span className="text-[#191411] font-medium">{filters.category}</span>
                  </>
                ) : (
                  <span className="text-[#191411] font-medium">Collection</span>
                )}
              </nav>

              {/* Tag / Collection Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EBE4D8] border border-[#D5C9B8] text-[#8C6D3F] text-[10px] uppercase tracking-[0.22em] font-sans-clean font-semibold rounded-full mb-3.5 shadow-xs">
                <Sparkles className="w-3 h-3 text-[#C5A880]" />
                <span>{headerContent.tagBadge}</span>
              </div>

              {/* Editorial Title */}
              <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-[52px] text-[#191411] font-normal tracking-tight leading-[1.15] mb-4">
                {headerContent.title}
              </h1>

              {/* Editorial Description */}
              <p className="text-sm sm:text-base font-sans-clean text-[#665D52] font-light max-w-xl leading-relaxed mb-6">
                {headerContent.description}
              </p>

              {/* Atelier Trust Badges */}
              <div className="pt-4 border-t border-[#EAE3D9]/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-sans-clean text-[#665D52]">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#9A7B4F]" />
                  <span>100% Full-Grain Italian Leather</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#9A7B4F]" />
                  <span>Handcrafted in Florence</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#9A7B4F]" />
                  <span>Complimentary Insured Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Editorial Visual Showcase Frame */}
            <div className="lg:col-span-5">
              <div className="relative group rounded-2xl overflow-hidden shadow-lg border border-[#D8CEBF]/80 bg-[#EFE9E0] transition-all duration-500 hover:shadow-xl">
                {/* Visual Image */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={headerContent.image}
                    alt={headerContent.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    priority
                  />
                  {/* Luxury Vignette & Dark Gradient for legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#191411]/85 via-[#191411]/25 to-transparent pointer-events-none" />
                </div>

                {/* Top Corner Atelier Badge */}
                <div className="absolute top-3.5 right-3.5 z-10 px-3 py-1 bg-[#191411]/80 backdrop-blur-md text-[#FAF8F5] text-[10px] font-sans-clean uppercase tracking-[0.2em] rounded-sm border border-white/20 shadow-xs">
                  {headerContent.edition}
                </div>

                {/* Bottom Editorial Caption Card */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10 text-white flex items-end justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-sans-clean uppercase tracking-[0.25em] text-[#D5B990] block mb-1 font-medium">
                      Atelier Highlight
                    </span>
                    <h2 className="font-serif-luxury text-lg sm:text-xl text-[#FAF8F5] leading-snug">
                      {headerContent.highlight}
                    </h2>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-sans-clean uppercase tracking-wider text-[#FAF8F5]/80 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-white/15">
                      <ShieldCheck className="w-3 h-3 text-[#D5B990]" /> Florence
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        {/* Top Action Bar (Mobile Filter Toggle & Desktop Sort) */}
        <div className="flex flex-wrap items-center justify-between pb-6 border-b border-[#EAE3D9] gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden px-4 py-2.5 bg-[#FAF8F5] border border-[#D8CEBF] text-xs uppercase tracking-wider font-sans-clean font-semibold flex items-center gap-2 text-[#191411] cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </button>
            <span className="text-xs font-sans-clean text-[#7A6F62]">
              Showing <span className="font-semibold text-[#191411]">{filteredProducts.length}</span> pieces
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-[#7A6F62] font-sans-clean hidden sm:inline">
              Sort:
            </span>
            <LuxurySelect
              value={filters.sortBy}
              onChange={(newSort) => handleFilterChange({ sortBy: newSort })}
              options={SORT_OPTIONS}
              ariaLabel="Sort shop products"
            />
          </div>
        </div>

        {/* Active Filters Pill Row */}
        {(filters.category !== "All" ||
          filters.color !== "All" ||
          filters.size !== "All" ||
          filters.material !== "All" ||
          filters.maxPrice < 350 ||
          filters.searchQuery !== "") && (
          <div className="flex flex-wrap items-center gap-2 py-4 border-b border-[#EAE3D9]">
            <span className="text-[11px] uppercase tracking-wider text-[#7A6F62] font-sans-clean mr-2">
              Active:
            </span>
            {filters.category !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F2EDE5] border border-[#DCD3C7] text-xs font-sans-clean text-[#191411]">
                Category: {filters.category}
                <button onClick={() => handleFilterChange({ category: "All" })}>
                  <X className="w-3 h-3 text-[#7A6F62] hover:text-black" />
                </button>
              </span>
            )}
            {filters.color !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F2EDE5] border border-[#DCD3C7] text-xs font-sans-clean text-[#191411]">
                Color: {filters.color}
                <button onClick={() => handleFilterChange({ color: "All" })}>
                  <X className="w-3 h-3 text-[#7A6F62] hover:text-black" />
                </button>
              </span>
            )}
            {filters.size !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F2EDE5] border border-[#DCD3C7] text-xs font-sans-clean text-[#191411]">
                Size: {filters.size}
                <button onClick={() => handleFilterChange({ size: "All" })}>
                  <X className="w-3 h-3 text-[#7A6F62] hover:text-black" />
                </button>
              </span>
            )}
            {filters.maxPrice < 350 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F2EDE5] border border-[#DCD3C7] text-xs font-sans-clean text-[#191411]">
                Max: ${filters.maxPrice}
                <button onClick={() => handleFilterChange({ maxPrice: 350 })}>
                  <X className="w-3 h-3 text-[#7A6F62] hover:text-black" />
                </button>
              </span>
            )}
            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F2EDE5] border border-[#DCD3C7] text-xs font-sans-clean text-[#191411]">
                &ldquo;{filters.searchQuery}&rdquo;
                <button onClick={() => handleFilterChange({ searchQuery: "" })}>
                  <X className="w-3 h-3 text-[#7A6F62] hover:text-black" />
                </button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-[11px] underline text-[#9A7B4F] ml-2 font-sans-clean hover:text-[#191411]"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8">
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3 pr-6">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalProducts={filteredProducts.length}
            />
          </aside>

          {/* Product Grid Area */}
          <section className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center space-y-4 bg-[#FAF8F5] border border-[#EAE3D9] p-8">
                <h3 className="font-serif-luxury text-2xl text-[#191411]">
                  No Matching Pieces Found
                </h3>
                <p className="text-xs font-sans-clean text-[#7A6F62] max-w-sm mx-auto">
                  Try clearing or adjusting your price, silhouette, or color criteria to explore our full atelier.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-3 bg-[#191411] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-sans-clean hover:bg-[#382E26] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, idx) => (
                  <ProductCard key={product.id} product={product} priority={idx < 3} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile Filters Slide-over Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-[#FBF9F5] z-50 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D9] mb-6">
                  <span className="font-serif-luxury text-xl text-[#191411]">Filter Catalog</span>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    aria-label="Close filters"
                    className="p-1 text-[#3A322A] hover:text-[#191411]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <ProductFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onResetFilters={handleResetFilters}
                  totalProducts={filteredProducts.length}
                />
              </div>

              <div className="pt-6 border-t border-[#EAE3D9] mt-6">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-[#191411] text-[#FAF8F5] py-3 text-xs uppercase tracking-[0.2em] font-sans-clean font-semibold"
                >
                  View {filteredProducts.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center font-serif-luxury text-xl text-[#7A6F62]">
          Loading VELORA Atelier...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
