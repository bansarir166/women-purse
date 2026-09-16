"use client";

import React from "react";
import Image from "next/image";
import { Award, Compass, Feather, Hammer } from "lucide-react";

const CRAFT_PILLARS = [
  {
    icon: Feather,
    title: "Traceable Tuscan Calfskin",
    subtitle: "Ethical Italian Tanneries",
    description:
      "Tanned using traditional organic chestnut and bark tannins. Never synthetic coatings — only breathable, durable leather that deepens in soul with each passing year.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop",
  },
  {
    icon: Hammer,
    title: "Hand-Finished Edge Dye",
    subtitle: "Seven Layers of Lacquer",
    description:
      "Every raw cut edge is hand-beveled, burnished with beeswax, and coated with seven micro-layers of organic Italian edge paint to prevent fraying and moisture penetration.",
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop",
  },
  {
    icon: Compass,
    title: "Architectural Balance",
    subtitle: "Ergonomic Weight Centers",
    description:
      "Engineered by structural industrial designers. Internal gussets distribute weight evenly across handle pivots, easing strain whether carried by hand or cross-body.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
  },
  {
    icon: Award,
    title: "24K Champagne Gold Accents",
    subtitle: "Solid Brass Foundry Casings",
    description:
      "Milled from solid brass forgings and triple-plated in satin champagne gold. Hypoallergenic, tarnish-resistant, and engineered to snap shut with buttery precision.",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
  },
];

export const CraftsmanshipSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#FBF9F5] border-b border-[#EAE3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#9A7B4F] font-sans-clean font-semibold block mb-2">
            The Atelier Standard
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-[#191411] font-normal tracking-tight mb-4">
            Uncompromising Craftsmanship
          </h2>
          <p className="text-sm font-sans-clean text-[#7A6F62] font-light leading-relaxed">
            True luxury lies where the eye cannot easily reach — in the reinforcement of seams, the weight of custom brass rivets, and the purity of unadulterated Italian hides.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CRAFT_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-[#FAF8F5] border border-[#E8E1D5] flex flex-col justify-between group hover:border-[#9A7B4F] transition-all duration-300"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-[#EFEBE4]">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#191411]/80 backdrop-blur-xs flex items-center justify-center text-[#C5A880]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#9A7B4F] font-sans-clean font-semibold block mb-1">
                      {pillar.subtitle}
                    </span>
                    <h3 className="font-serif-luxury text-xl text-[#191411] mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#665D52] font-sans-clean leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
