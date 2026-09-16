"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";

export const SignatureShowcase: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const signatureProducts = PRODUCTS.filter((p) => p.isSignature);
  const { addItem } = useCart();
  const { showToast } = useUI();

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -380 : 380;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-[#F5F1EB] border-b border-[#EAE3D9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Navigation Controls */}
        <div className="flex items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#9A7B4F] font-sans-clean font-semibold block mb-2">
              The Permanent Archive
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-[#191411] font-normal tracking-tight">
              Signature Silhouettes
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll("left")}
              aria-label="Scroll left"
              className="w-11 h-11 border border-[#D8CEBF] bg-[#FAF8F5] hover:bg-[#191411] hover:text-[#FAF8F5] text-[#191411] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              aria-label="Scroll right"
              className="w-11 h-11 border border-[#D8CEBF] bg-[#FAF8F5] hover:bg-[#191411] hover:text-[#FAF8F5] text-[#191411] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Track */}
        <div
          ref={scrollRef}
          className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scroll-smooth"
        >
          {signatureProducts.map((product) => (
            <div
              key={product.id}
              className="w-[280px] sm:w-[340px] shrink-0 bg-[#FAF8F5] border border-[#E8E1D5] flex flex-col justify-between group"
            >
              {/* Image */}
              <div className="aspect-[4/5] relative overflow-hidden bg-[#ECE5DB]">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-[#191411]/90 text-[#F5F2EB] text-[9px] uppercase tracking-[0.2em] font-sans-clean px-2.5 py-1">
                  Atelier Edition
                </div>
              </div>

              {/* Info & CTA */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#9A7B4F] font-sans-clean font-semibold">
                    {product.category}
                  </span>
                  <span className="font-serif-luxury text-base text-[#191411]">
                    ${product.price} USD
                  </span>
                </div>

                <Link
                  href={`/product/${product.id}`}
                  className="font-serif-luxury text-xl text-[#191411] group-hover:text-[#9A7B4F] transition-colors block"
                >
                  {product.name}
                </Link>

                <p className="text-xs text-[#7A6F62] font-sans-clean line-clamp-2 leading-relaxed">
                  {product.subtitle}
                </p>

                <div className="pt-3 border-t border-[#EAE3D9] flex items-center justify-between">
                  <button
                    onClick={() => {
                      addItem(product, product.colors[0], 1);
                      showToast(`Added ${product.name} to bag.`);
                    }}
                    className="text-xs uppercase tracking-[0.16em] font-sans-clean font-semibold text-[#191411] hover:text-[#9A7B4F] transition-colors cursor-pointer"
                  >
                    Quick Reserve
                  </button>
                  <Link
                    href={`/product/${product.id}`}
                    className="text-xs text-[#7A6F62] hover:text-[#191411] transition-colors flex items-center gap-1 font-sans-clean"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
