"use client";

import React from "react";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa6";


const LOOKBOOK_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
    alt: "Autumn street style with The Celeste Tote",
  },
  {
    src: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
    alt: "The Aurelia Bag in Milan café",
  },
  {
    src: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
    alt: "Evening styling with The Camille Flap Bag",
  },
  {
    src: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop",
    alt: "The Elise shoulder bag in Paris",
  },
  {
    src: "https://images.unsplash.com/photo-1575032617751-6ddec2089882?q=80&w=800&auto=format&fit=crop",
    alt: "Sofia Mini at black tie reception",
  },
  {
    src: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=800&auto=format&fit=crop",
    alt: "Minimalist structured purse styling",
  },
];

export const SocialGallery: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#FBF9F5] border-b border-[#EAE3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#9A7B4F] font-sans-clean font-semibold block mb-2">
            Social Journal
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#191411] font-normal tracking-tight mb-2">
            Styled in the Wild
          </h2>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-sans-clean tracking-[0.16em] uppercase text-[#7A6F62] hover:text-[#191411] transition-colors inline-flex items-center gap-1.5"
          >
            <FaInstagram className="w-3.5 h-3.5 text-[#C5A880]" /> @veloraofficial
          </a>
        </div>

        {/* 6 Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {LOOKBOOK_IMAGES.map((img, idx) => (
            <a
              key={idx}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label={img.alt}
              className="group relative aspect-square overflow-hidden bg-[#ECE5DB] block border border-[#E8E1D5]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-[#17120E]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-[#FAF8F5]">
                <FaInstagram className="w-6 h-6" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
