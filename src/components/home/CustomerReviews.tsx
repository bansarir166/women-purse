"use client";

import React, { useState } from "react";
import { Star, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { REVIEWS, PRESS_QUOTES } from "@/data/reviews";

export const CustomerReviews: React.FC = () => {
  const [activePressIndex, setActivePressIndex] = useState(0);

  return (
    <section className="py-20 sm:py-28 bg-[#FBF9F5] border-b border-[#EAE3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Press Quotes Carousel */}
        <div className="text-center max-w-3xl mx-auto mb-20 pb-16 border-b border-[#EAE3D9]">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#9A7B4F] font-sans-clean font-semibold block mb-4">
            Critical Acclaim
          </span>

          <blockquote className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl text-[#191411] font-light italic leading-relaxed min-h-[110px] flex items-center justify-center">
            &ldquo;{PRESS_QUOTES[activePressIndex].quote}&rdquo;
          </blockquote>

          <p className="font-sans-clean text-xs uppercase tracking-[0.25em] text-[#191411] font-bold mt-4">
            — {PRESS_QUOTES[activePressIndex].publication}
          </p>

          <div className="flex justify-center items-center gap-2 mt-6">
            {PRESS_QUOTES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActivePressIndex(idx)}
                aria-label={`Show quote ${idx + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${
                  activePressIndex === idx
                    ? "bg-[#191411] w-6"
                    : "bg-[#D8CEBF] hover:bg-[#9A7B4F]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Verified Collectors Reviews Grid */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7B4F] font-sans-clean font-semibold block mb-2">
            Collector Reflections
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#191411] font-normal tracking-tight">
            Words of Reverence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF8F5] border border-[#E8E1D5] p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-[#C5A880] text-[#C5A880]"
                    />
                  ))}
                </div>

                <h3 className="font-serif-luxury text-lg text-[#191411] mb-2 font-medium">
                  &ldquo;{rev.title}&rdquo;
                </h3>

                <p className="text-xs text-[#554C42] font-sans-clean leading-relaxed mb-6 font-light">
                  {rev.content}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EAE3D9] flex items-center justify-between">
                <div>
                  <p className="text-xs font-sans-clean font-semibold text-[#191411]">
                    {rev.author}
                  </p>
                  <p className="text-[10px] text-[#7A6F62] font-sans-clean">
                    {rev.location}
                  </p>
                </div>
                {rev.verified && (
                  <span className="flex items-center gap-1 text-[10px] text-[#2E4A3B] font-sans-clean font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
