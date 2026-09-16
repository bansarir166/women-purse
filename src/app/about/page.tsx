"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, Feather, Award, ArrowRight } from "lucide-react";
import { PRESS_QUOTES } from "@/data/reviews";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FBF9F5] text-[#191411]">
      {/* Editorial Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-[#1B1511] text-[#FAF8F5] overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=85&w=2000&auto=format&fit=crop"
            alt="VELORA Atelier Florence"
            fill
            priority
            className="object-cover object-center filter brightness-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#15110E] via-[#15110E]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-20">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C5A880] font-sans-clean font-semibold block mb-3">
            Atelier Milano & Firenze
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-light tracking-tight mb-6">
            The Philosophy of <span className="italic font-normal">Restraint.</span>
          </h1>
          <p className="text-sm sm:text-lg font-sans-clean font-light text-[#D8CEBF] max-w-2xl mx-auto leading-relaxed">
            Founded on the conviction that women&apos;s luxury should celebrate organic geometry, architectural longevity, and uncompromising material provenance.
          </p>
        </div>
      </section>

      {/* Origin Narrative */}
      <section className="py-20 sm:py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7B4F] font-sans-clean font-semibold">
              Heritage & Origin
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#191411] leading-snug">
              Born from Italian Tanneries, Shaped for Modern Living
            </h2>
            <p className="text-xs sm:text-sm font-sans-clean text-[#554C42] leading-relaxed font-light">
              VELORA began not on a designer moodboard, but in the historic leather valleys of Tuscany. Surrounded by centuries of tanning tradition, we recognized that the modern luxury handbag market had strayed into excessive branding, disposable trend cycles, and synthetic fillers.
            </p>
            <p className="text-xs sm:text-sm font-sans-clean text-[#554C42] leading-relaxed font-light">
              We set out to create pure silhouettes: pieces stripped of extraneous metal logos, sculpted from whole full-grain hides, and balanced to move effortlessly with a woman through her life.
            </p>
          </div>

          <div className="md:col-span-6">
            <div className="aspect-[4/5] relative overflow-hidden bg-[#ECE5DB] border border-[#E8E1D5]">
              <Image
                src="https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1000&auto=format&fit=crop"
                alt="Leather Craftsmanship"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Pillars */}
      <section className="py-20 bg-[#F5F1EB] border-y border-[#EAE3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7B4F] font-sans-clean font-semibold block mb-2">
              Our 4 Tenets
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#191411]">
              The VELORA Standard
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-[#FAF8F5] p-8 border border-[#E8E1D5] space-y-3">
              <Feather className="w-6 h-6 text-[#9A7B4F]" />
              <h3 className="font-serif-luxury text-xl text-[#191411]">Traceable Hides</h3>
              <p className="text-xs font-sans-clean text-[#665D52] leading-relaxed">
                100% of our leather originates from certified European agriculture, tanned using organic vegetable extracts.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 border border-[#E8E1D5] space-y-3">
              <Sparkles className="w-6 h-6 text-[#9A7B4F]" />
              <h3 className="font-serif-luxury text-xl text-[#191411]">Custom Hardware</h3>
              <p className="text-xs font-sans-clean text-[#665D52] leading-relaxed">
                Milled solid brass triple-dipped in warm satin champagne gold for enduring luster without tarnish.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 border border-[#E8E1D5] space-y-3">
              <ShieldCheck className="w-6 h-6 text-[#9A7B4F]" />
              <h3 className="font-serif-luxury text-xl text-[#191411]">Hand-Stitched Edge</h3>
              <p className="text-xs font-sans-clean text-[#665D52] leading-relaxed">
                Seven micro-coats of natural edge lacquer, hand-polished with beeswax over hours of patient attention.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 border border-[#E8E1D5] space-y-3">
              <Award className="w-6 h-6 text-[#9A7B4F]" />
              <h3 className="font-serif-luxury text-xl text-[#191411]">Lifetime Care</h3>
              <p className="text-xs font-sans-clean text-[#665D52] leading-relaxed">
                Every VELORA creation comes with our atelier promise: complimentary inspection and hardware service for life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Press Quotations */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h3 className="text-[11px] uppercase tracking-[0.25em] text-[#9A7B4F] font-sans-clean font-semibold mb-8">
          In the Words of Fashion Editors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {PRESS_QUOTES.map((pq, idx) => (
            <div key={idx} className="bg-[#FAF8F5] p-6 border border-[#E8E1D5] space-y-3">
              <p className="font-serif-luxury text-base text-[#191411] italic leading-relaxed">
                &ldquo;{pq.quote}&rdquo;
              </p>
              <p className="text-xs font-sans-clean font-bold uppercase tracking-wider text-[#9A7B4F]">
                — {pq.publication}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA to Shop */}
      <section className="py-16 bg-[#191411] text-[#FAF8F5] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-serif-luxury text-3xl sm:text-4xl mb-4">
            Experience VELORA in Person
          </h2>
          <p className="text-xs font-sans-clean text-[#D8CEBF] mb-8 leading-relaxed">
            Discover our flagship collections, engineered to be carried with quiet confidence.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FAF8F5] text-[#191411] text-xs uppercase tracking-[0.2em] font-sans-clean font-semibold hover:bg-[#EAE3D9] transition-colors"
          >
            Explore The Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
