"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";

export default function WishlistPage() {
  const { wishlistProducts, toggleWishlist, wishlistCount } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useUI();

  const handleMoveToBag = (product: any) => {
    addItem(product, product.colors[0], 1);
    toggleWishlist(product.id);
    showToast(`Moved ${product.name} to your shopping bag.`);
  };

  return (
    <main className="min-h-screen bg-[#FBF9F5] py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7B4F] font-sans-clean font-semibold block mb-2">
            Private Archive
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl text-[#191411]">
            Your Saved Curations
          </h1>
          <p className="text-xs font-sans-clean text-[#7A6F62] mt-2">
            {wishlistCount} {wishlistCount === 1 ? "piece" : "pieces"} saved in your private atelier wishlist
          </p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-4 bg-[#FAF8F5] border border-[#EAE3D9] p-8">
            <div className="w-14 h-14 rounded-full bg-[#F2EDE5] text-[#9A7B4F] flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 stroke-1" />
            </div>
            <h3 className="font-serif-luxury text-2xl text-[#191411]">
              Your Wishlist is Empty
            </h3>
            <p className="text-xs font-sans-clean text-[#7A6F62]">
              Explore our permanent silhouettes and flagship editions. Click the heart on any piece to preserve it here.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-4 px-8 py-3.5 bg-[#191411] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-sans-clean font-semibold hover:bg-[#382E26] transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#FAF8F5] border border-[#E8E1D5] flex flex-col justify-between group"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-[#ECE5DB]">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Remove from wishlist"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FAF8F5]/90 flex items-center justify-center text-[#7A6F62] hover:text-red-700 transition-colors shadow-xs"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#9A7B4F] font-sans-clean font-semibold">
                      {product.category}
                    </span>
                    <Link
                      href={`/product/${product.id}`}
                      className="font-serif-luxury text-xl text-[#191411] hover:text-[#9A7B4F] transition-colors block line-clamp-1 mt-0.5"
                    >
                      {product.name}
                    </Link>
                    <p className="font-serif-luxury text-base text-[#191411] mt-1">
                      ${product.price} USD
                    </p>
                  </div>

                  <button
                    onClick={() => handleMoveToBag(product)}
                    className="w-full bg-[#191411] hover:bg-[#382E26] text-[#FAF8F5] py-3 text-xs uppercase tracking-[0.18em] font-sans-clean font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
