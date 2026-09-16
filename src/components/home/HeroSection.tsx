"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] sm:min-h-[95vh] flex items-center justify-center overflow-hidden bg-[#1E1713]"
    >
      {/* Background Editorial Image with Parallax & Subtle Zoom */}
      <motion.div style={{ y: yImage }} className="absolute inset-0 w-full h-[115%] -top-[7%]">
        <Image
          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=85&w=2000&auto=format&fit=crop"
          alt="VELORA Luxury Handbags Autumn Campaign"
          fill
          priority
          className="object-cover object-center brightness-90 filter"
        />
        {/* Editorial Gradients for Legibility & Rich Warm Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#15110E] via-[#15110E]/40 to-[#15110E]/30" />
        <div className="absolute inset-0 bg-[#251A13]/20 mix-blend-multiply" />
      </motion.div>

      {/* Hero Content Overlay */}
      <motion.div
        style={{ opacity: opacityText }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center text-[#FBF9F5] py-20 flex flex-col items-center"
      >
        {/* Sub-header / Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#C5A880]/50 bg-[#1A1410]/60 backdrop-blur-md mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
          <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase font-sans-clean text-[#E8DEC8] font-medium">
            Autumn / Winter Atelier 2026
          </span>
        </motion.div>

        {/* Main Editorial Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.08] mb-6 text-[#FAF8F5] font-light max-w-4xl"
        >
          Carry Your <span className="italic font-normal text-[#F2E5D2]">Confidence.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-sm sm:text-lg md:text-xl font-sans-clean font-light text-[#D8CEBF] max-w-xl mb-10 tracking-wide leading-relaxed"
        >
          Timeless silhouettes, crafted for the modern woman. Sculpted in Florence with full-grain traceable leather.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-4 bg-[#FBF9F5] text-[#191411] hover:bg-[#EAE3D9] text-xs uppercase tracking-[0.22em] font-sans-clean font-semibold transition-all duration-300 shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
          >
            Shop Collection
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/shop?sort=newest"
            className="w-full sm:w-auto px-8 py-4 bg-[#191411]/50 hover:bg-[#191411]/80 text-[#FAF8F5] border border-[#C5A880]/60 text-xs uppercase tracking-[0.22em] font-sans-clean font-semibold backdrop-blur-md transition-all duration-300 flex items-center justify-center cursor-pointer"
          >
            Explore New Arrivals
          </Link>
        </motion.div>
      </motion.div>

      {/* Subtle Scroll Down Prompt */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-[#C5B9AC]/70 flex flex-col items-center gap-1">
        <span className="text-[9px] uppercase tracking-[0.3em] font-sans-clean font-light">
          Scroll
        </span>
        <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
      </div>
    </section>
  );
};
