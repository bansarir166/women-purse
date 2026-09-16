"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const ANNOUNCEMENTS = [
  "Complimentary Shipping on Orders Over $150",
  "Handcrafted in Italy with Traceable Tuscan Leather",
  "30-Day Complimentary Returns & Lifetime Atelier Guarantee",
];

export const AnnouncementBar: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#191411] text-[#E8E1D5] text-[11px] tracking-[0.2em] uppercase font-sans-clean font-medium border-b border-[#2C241E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between">
        {/* Left: Region & Currency */}
        <div className="hidden md:flex items-center gap-4 text-[#A89F93]">
          <span className="hover:text-[#F5F1EB] transition-colors cursor-pointer">
            US (USD $)
          </span>
          <span className="text-[#3E342B]">•</span>
          <Link href="/about" className="hover:text-[#F5F1EB] transition-colors">
            Our Atelier
          </Link>
        </div>

        {/* Center: Rotating messages */}
        <div className="flex-1 flex justify-center items-center overflow-hidden h-6 relative">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-center font-normal tracking-[0.22em] text-[#F3EFE9]"
            >
              {ANNOUNCEMENTS[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Right: Client services & Contact */}
        <div className="hidden md:flex items-center gap-4 text-[#A89F93]">
          <Link href="/shop" className="hover:text-[#C5A880] transition-colors">
            New In: Autumn 26
          </Link>
          <span className="text-[#3E342B]">•</span>
          <a href="mailto:concierge@velora.com" className="hover:text-[#F5F1EB] transition-colors">
            Concierge
          </a>
        </div>
      </div>
    </div>
  );
};
