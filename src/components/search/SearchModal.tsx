"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { useUI } from "@/context/UIContext";
import { PRODUCTS } from "@/data/products";

const TRENDING_QUERIES = [
  "The Aurelia Bag",
  "Italian Calfskin",
  "Everyday Totes",
  "Evening Mini Bags",
  "Champagne Gold",
  "Baguette Shoulder",
];

export const SearchModal: React.FC = () => {
  const router = useRouter();
  const { isSearchOpen, closeSearch } = useUI();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery("");
    }
  }, [isSearchOpen]);

  const filteredProducts = query.trim()
    ? PRODUCTS.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.materials.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#16120F]/70 backdrop-blur-md flex flex-col items-center pt-16 sm:pt-24 px-4"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl bg-[#FBF9F5] shadow-2xl border border-[#E8E1D5] overflow-hidden"
          >
            {/* Search Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim()) {
                  closeSearch();
                  router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
                }
              }}
              className="p-6 border-b border-[#E8E1D5] flex items-center gap-4"
            >
              <Search className="w-6 h-6 text-[#9A7B4F] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bags, leather types, or silhouettes..."
                className="flex-1 bg-transparent text-lg sm:text-xl font-serif-luxury text-[#191411] placeholder-[#A09384] focus:outline-hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-xs text-[#7A6F62] uppercase tracking-wider font-sans-clean hover:text-[#191411] cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="hidden sm:inline-flex px-4 py-1.5 bg-[#191411] text-[#FAF8F5] text-xs uppercase tracking-wider font-sans-clean font-semibold rounded-xs hover:bg-[#332A24] cursor-pointer"
              >
                Search
              </button>
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
                className="p-1.5 text-[#3A322A] hover:text-[#191411] hover:bg-[#EFEBE4] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            {/* Results or Trending Content */}
            <div className="p-6 max-h-[65vh] overflow-y-auto">
              {query.trim() ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#7A6F62] font-sans-clean">
                      Found {filteredProducts.length} results for &ldquo;{query}&rdquo;
                    </p>
                    <Link
                      href={`/shop?search=${encodeURIComponent(query)}`}
                      onClick={closeSearch}
                      className="text-xs font-sans-clean text-[#9A7B4F] hover:underline flex items-center gap-1 font-medium"
                    >
                      Show all on catalogue page <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="py-12 text-center text-[#7A6F62] font-sans-clean text-xs">
                      No matching luxury pieces found. Try searching for &ldquo;Tote&rdquo;, &ldquo;Aurelia&rdquo;, or &ldquo;Shoulder&rdquo;.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredProducts.slice(0, 6).map((product) => (
                        <Link
                          key={product.id}
                          href={`/shop?search=${encodeURIComponent(product.name)}`}
                          onClick={closeSearch}
                          className="flex gap-4 p-3 bg-[#FAF8F5] hover:bg-[#F3EFE9] border border-[#E8E1D5] transition-colors group cursor-pointer"
                        >
                          <div className="w-16 h-20 relative bg-[#EFEBE4] overflow-hidden shrink-0">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-[#9A7B4F] font-sans-clean">
                              {product.category}
                            </p>
                            <h4 className="font-serif-luxury text-base text-[#191411] group-hover:text-[#9A7B4F] transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-xs text-[#554C42] font-sans-clean font-medium mt-1">
                              ${product.price} USD
                            </p>
                            <span className="text-[10px] text-[#9A7B4F] font-sans-clean mt-1 underline">
                              View on catalogue page &rarr;
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#9A7B4F] font-sans-clean font-semibold mb-3">
                    Popular Inquiries
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {TRENDING_QUERIES.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          closeSearch();
                          router.push(`/shop?search=${encodeURIComponent(item)}`);
                        }}
                        className="px-3.5 py-1.5 bg-[#F2EDE5] text-[#3A322A] text-xs font-sans-clean hover:bg-[#EAE2D7] hover:text-[#191411] border border-[#E0D7CB] transition-colors cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#E8E1D5] flex items-center justify-between">
                    <span className="text-xs text-[#7A6F62] font-sans-clean">
                      Looking for our flagship pieces?
                    </span>
                    <Link
                      href="/shop"
                      onClick={closeSearch}
                      className="text-xs font-sans-clean text-[#9A7B4F] font-medium hover:underline flex items-center gap-1"
                    >
                      Browse full collection <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
