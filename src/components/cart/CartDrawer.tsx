"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    promoCode,
    discountPercent,
    applyPromoCode,
    removePromoCode,
    freeShippingThreshold,
    amountNeededForFreeShipping,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage({ text: res.message, success: res.success });
    if (res.success) setPromoInput("");
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-[#FBF9F5] z-50 shadow-2xl flex flex-col justify-between border-l border-[#E8E1D5]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#E8E1D5] flex items-center justify-between">
              <div>
                <h3 className="font-serif-luxury text-2xl text-[#191411] tracking-wide">
                  Shopping Bag
                </h3>
                <p className="text-[11px] tracking-[0.16em] uppercase text-[#7A6F62] font-sans-clean">
                  {items.length} {items.length === 1 ? "Item" : "Items"} Selected
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#3A322A] hover:text-[#191411] hover:bg-[#EFEBE4] transition-colors rounded-xs"
                aria-label="Close bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="px-6 py-3.5 bg-[#F4EFE7] border-b border-[#E8E1D5]">
              {amountNeededForFreeShipping > 0 ? (
                <p className="text-xs font-sans-clean text-[#5A5046] mb-2">
                  Add{" "}
                  <span className="font-semibold text-[#191411]">
                    ${amountNeededForFreeShipping} USD
                  </span>{" "}
                  more for <span className="font-semibold text-[#9A7B4F]">Complimentary Worldwide Shipping</span>.
                </p>
              ) : (
                <p className="text-xs font-sans-clean text-[#2E4A3B] font-medium mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2E4A3B]" />
                  You have unlocked Complimentary Worldwide Shipping!
                </p>
              )}
              <div className="w-full bg-[#E5DDD2] h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-[#C5A880] h-full"
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 divide-y divide-[#EFEBE4]">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#F2EDE5] border border-[#E8E1D5] flex items-center justify-center text-[#9E9283]">
                    <ShieldCheck className="w-7 h-7 stroke-1" />
                  </div>
                  <div>
                    <h4 className="font-serif-luxury text-2xl text-[#191411] mb-1">
                      Your Bag Is Empty
                    </h4>
                    <p className="text-xs text-[#7A6F62] font-sans-clean max-w-xs">
                      Discover our curated collection of timeless Italian leather bags and crafted accessories.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="inline-block mt-2 px-6 py-2.5 bg-[#191411] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-sans-clean hover:bg-[#3E342B] transition-colors"
                  >
                    Explore Collection
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-4 group">
                    <div className="w-20 h-24 relative overflow-hidden bg-[#F2EDE5] shrink-0 border border-[#E8E1D5]">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link
                            href={`/product/${item.product.id}`}
                            onClick={() => setIsOpen(false)}
                            className="font-serif-luxury text-lg text-[#191411] hover:text-[#9A7B4F] transition-colors line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <span className="font-sans-clean text-xs font-semibold text-[#191411] ml-2">
                            ${item.product.price * item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <p className="text-[11px] text-[#7A6F62] font-sans-clean">
                            {item.selectedColor.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#DCD3C7] bg-[#FAF8F5]">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-[#EFEBE4] text-[#554C42] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-sans-clean font-medium text-[#191411]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-[#EFEBE4] text-[#554C42] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#9E9283] hover:text-[#B43838] transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer with Calculation & Checkout */}
            {items.length > 0 && (
              <div className="px-6 py-5 bg-[#FAF8F5] border-t border-[#E8E1D5] space-y-4">
                {/* Promo Code Box */}
                <div>
                  {discountPercent > 0 ? (
                    <div className="flex items-center justify-between bg-[#EFECE4] px-3 py-2 text-xs font-sans-clean">
                      <span className="flex items-center gap-1.5 text-[#2E4A3B] font-medium">
                        <Tag className="w-3.5 h-3.5" />
                        Code {promoCode} ({discountPercent}% Off)
                      </span>
                      <button
                        onClick={removePromoCode}
                        className="text-[#9E9283] hover:text-[#191411] text-[11px] underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Promo Code (e.g. VELORA10)"
                        className="flex-1 bg-white border border-[#DCD3C7] text-xs px-3 py-2 uppercase font-sans-clean tracking-wider focus:outline-hidden focus:border-[#C5A880]"
                      />
                      <button
                        type="submit"
                        className="bg-[#241D17] text-[#FBF9F5] px-4 py-2 text-xs uppercase tracking-wider font-sans-clean font-semibold hover:bg-[#3E342B] transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {promoMessage && (
                    <p
                      className={`text-[11px] mt-1 font-sans-clean ${
                        promoMessage.success ? "text-[#2E4A3B]" : "text-[#A33B3B]"
                      }`}
                    >
                      {promoMessage.text}
                    </p>
                  )}
                </div>

                {/* Subtotals */}
                <div className="space-y-1.5 text-xs font-sans-clean text-[#5A5046] pt-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#191411] font-medium">${subtotal} USD</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#2E4A3B]">
                      <span>VIP Privilege Discount</span>
                      <span>-${discountAmount} USD</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-[#191411]">
                      {shippingFee === 0 ? "Complimentary" : `$${shippingFee} USD`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#E8E1D5] text-sm text-[#191411] font-semibold">
                    <span>Total</span>
                    <span>${total} USD</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-[#191411] text-[#FAF8F5] py-3.5 text-xs uppercase tracking-[0.22em] font-sans-clean font-semibold flex items-center justify-center gap-2 hover:bg-[#3E342B] transition-colors group cursor-pointer"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <p className="text-[10px] text-center text-[#8C7F72] font-sans-clean tracking-wider uppercase">
                  Taxes & duties calculated at checkout • 30-day returns
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
