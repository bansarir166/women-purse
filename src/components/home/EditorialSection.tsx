"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export const EditorialSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#1B1511] text-[#FAF8F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Editorial Lifestyle Imagery */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-[#261E19] border border-[#3E3228]">
              <Image
                src="https://images.unsplash.com/photo-1591561954557-26941169b49e?q=85&w=1200&auto=format&fit=crop"
                alt="VELORA Atelier Editorial Craftsmanship"
                fill
                className="object-cover object-center filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#15100C]/70 via-transparent to-transparent" />
            </div>

            {/* Overlapping Detail Badge / Floating Photo */}
            <div className="hidden sm:block absolute -bottom-8 -right-8 w-48 aspect-square bg-[#221A15] p-2 border border-[#483B30] shadow-2xl">
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=85&w=600&auto=format&fit=crop"
                  alt="Leather hand-stitching detail"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-6 space-y-6 lg:pl-6">
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#C5A880] font-sans-clean font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              The Atelier Philosophy
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-[#FAF8F5] font-light leading-[1.15] tracking-tight">
              Designed to Be <br />
              <span className="italic font-normal text-[#E8DEC8]">Remembered.</span>
            </h2>

            <p className="font-serif-luxury text-xl sm:text-2xl text-[#C8BEB3] font-light italic leading-relaxed">
              &ldquo;We don&apos;t design for the trend cycle of six months. We engineer heirlooms that will still command a room three decades from now.&rdquo;
            </p>

            <div className="space-y-4 text-xs sm:text-sm font-sans-clean text-[#ADA193] font-light leading-relaxed">
              <p>
                At our partner tannery outside Florence, artisans work exclusively with full-grain calfskins selected for their tight grain structure, gentle warmth, and capacity to develop a rich, personal patina over time.
              </p>
              <p>
                Every silhouette is sculpted from the inside out — balancing internal weight distribution, ergonomically sculpted handle drops, and whisper-quiet magnetic enclosures. It is modern femininity expressed through structural discipline.
              </p>
            </div>

            {/* Atelier Stat Highlights */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#362A22]">
              <div>
                <p className="font-serif-luxury text-2xl sm:text-3xl text-[#FAF8F5]">6 hrs</p>
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#8C7F72] font-sans-clean mt-1">
                  Hand Construction
                </p>
              </div>
              <div>
                <p className="font-serif-luxury text-2xl sm:text-3xl text-[#FAF8F5]">100%</p>
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#8C7F72] font-sans-clean mt-1">
                  Tuscan Calfskin
                </p>
              </div>
              <div>
                <p className="font-serif-luxury text-2xl sm:text-3xl text-[#FAF8F5]">24K</p>
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#8C7F72] font-sans-clean mt-1">
                  Brushed Gold Finish
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-sans-clean font-semibold text-[#FAF8F5] hover:text-[#C5A880] transition-colors group cursor-pointer"
              >
                Read The Atelier Story
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
