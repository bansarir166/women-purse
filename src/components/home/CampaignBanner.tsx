"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const CampaignBanner: React.FC = () => {
  return (
    <section className="relative min-h-[520px] sm:min-h-[620px] flex items-center justify-center overflow-hidden bg-[#1B1511]">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=85&w=2000&auto=format&fit=crop"
          alt="The Art of Everyday Luxury - VELORA Campaign"
          fill
          className="object-cover object-center filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17120E]/80 via-[#17120E]/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-xl text-[#FAF8F5] space-y-6">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C5A880] font-sans-clean font-semibold block">
            Campaign Édition 2026
          </span>

          <h2 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl text-[#FAF8F5] font-light leading-[1.1] tracking-tight">
            The Art of <br />
            <span className="italic font-normal text-[#F3EFE9]">Everyday Luxury</span>
          </h2>

          <p className="text-xs sm:text-sm font-sans-clean text-[#D8CEBF] font-light leading-relaxed max-w-md">
            Sculptural grace tailored for reality. Carrying everything you require with an aura of effortless composure.
          </p>

          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FAF8F5] text-[#191411] hover:bg-[#EAE3D9] text-xs uppercase tracking-[0.22em] font-sans-clean font-semibold transition-all shadow-xl group cursor-pointer"
            >
              Discover the Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
