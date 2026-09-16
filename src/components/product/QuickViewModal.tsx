"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Check, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { useUI } from "@/context/UIContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ProductColor } from "@/types";

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView, showToast } = useUI();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const currentColor = selectedColor || quickViewProduct.colors[0];
  const inWish = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addItem(quickViewProduct, currentColor, quantity);
    showToast(`Added ${quickViewProduct.name} (${currentColor.name}) to your shopping bag.`);
    closeQuickView();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeQuickView}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#FBF9F5] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8E1D5] z-10 grid grid-cols-1 md:grid-cols-2"
        >
          {/* Close button */}
          <button
            onClick={closeQuickView}
            aria-label="Close preview"
            className="absolute top-4 right-4 z-20 p-2 bg-[#FBF9F5]/90 hover:bg-[#EFEBE4] text-[#191411] transition-colors border border-[#E8E1D5]"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Image Gallery */}
          <div className="p-6 sm:p-8 bg-[#F5F1EB] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8E1D5]">
            <div className="aspect-[4/5] relative overflow-hidden bg-[#ECE6DC]">
              <Image
                src={quickViewProduct.images[selectedImageIndex] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnails */}
            {quickViewProduct.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-16 relative overflow-hidden border transition-all ${
                      selectedImageIndex === idx
                        ? "border-[#9A7B4F] ring-1 ring-[#9A7B4F]"
                        : "border-[#DCD3C7] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Order Controls */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7B4F] font-sans-clean font-semibold">
                  {quickViewProduct.category}
                </span>
                <div className="flex items-center gap-1 text-[#9A7B4F] text-xs font-sans-clean">
                  <Star className="w-3.5 h-3.5 fill-[#C5A880] text-[#C5A880]" />
                  <span>{quickViewProduct.rating}</span>
                  <span className="text-[#8C7F72]">({quickViewProduct.reviewsCount})</span>
                </div>
              </div>

              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#191411] mb-2 leading-snug">
                {quickViewProduct.name}
              </h2>
              <p className="text-xs text-[#7A6F62] font-sans-clean mb-4">
                {quickViewProduct.subtitle}
              </p>

              <div className="flex items-baseline gap-3 mb-5">
                <span className="font-serif-luxury text-2xl text-[#191411]">
                  ${quickViewProduct.price} USD
                </span>
                {quickViewProduct.originalPrice && (
                  <span className="text-sm font-sans-clean text-[#9E9283] line-through">
                    ${quickViewProduct.originalPrice} USD
                  </span>
                )}
              </div>

              <p className="text-xs text-[#554C42] font-sans-clean leading-relaxed mb-6 line-clamp-3">
                {quickViewProduct.description}
              </p>

              {/* Color Selector */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-sans-clean mb-2.5">
                  <span className="text-[#191411] font-medium">Color</span>
                  <span className="text-[#7A6F62]">{currentColor.name}</span>
                </div>
                <div className="flex gap-2.5">
                  {quickViewProduct.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select ${color.name}`}
                      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                        currentColor.name === color.name
                          ? "border-[#191411] ring-2 ring-[#C5A880]/50"
                          : "border-[#D8CEBF] hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {currentColor.name === color.name && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            color.hex.toLowerCase() === "#ffffff" ||
                            color.hex.toLowerCase() === "#f5f2eb" ||
                            color.hex.toLowerCase() === "#f3ece3" ||
                            color.hex.toLowerCase() === "#faf8f5"
                              ? "text-black"
                              : "text-white"
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-sans-clean text-[#191411] font-medium">Quantity</span>
                <div className="flex items-center border border-[#DCD3C7] bg-[#FAF8F5]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-xs text-[#554C42] hover:bg-[#EFEBE4] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-sans-clean font-medium text-[#191411]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-xs text-[#554C42] hover:bg-[#EFEBE4] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-[#E8E1D5]">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#191411] hover:bg-[#382E26] text-[#FAF8F5] py-3.5 text-xs uppercase tracking-[0.2em] font-sans-clean font-semibold transition-colors cursor-pointer"
                >
                  Add to Bag • ${quickViewProduct.price * quantity} USD
                </button>
                <button
                  onClick={() => {
                    toggleWishlist(quickViewProduct.id);
                    showToast(
                      inWish
                        ? `Removed ${quickViewProduct.name} from Wishlist`
                        : `Saved ${quickViewProduct.name} to Wishlist`
                    );
                  }}
                  className={`p-3.5 border transition-colors cursor-pointer ${
                    inWish
                      ? "border-[#9A7B4F] bg-[#9A7B4F]/10 text-[#9A7B4F]"
                      : "border-[#DCD3C7] text-[#3A322A] hover:border-[#191411]"
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`w-4 h-4 ${inWish ? "fill-[#9A7B4F]" : ""}`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs font-sans-clean text-[#7A6F62]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9A7B4F]" /> Lifetime Atelier Guarantee
                </span>
                <Link
                  href={`/product/${quickViewProduct.id}`}
                  onClick={closeQuickView}
                  className="text-[#9A7B4F] hover:underline flex items-center gap-1 font-medium"
                >
                  Full product editorial <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
