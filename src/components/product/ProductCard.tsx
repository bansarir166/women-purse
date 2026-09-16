"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, Plus, Check } from "lucide-react";
import { Product, ProductColor } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUI } from "@/context/UIContext";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { openQuickView, showToast } = useUI();

  const inWishlist = isInWishlist(product.id);
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, selectedColor, 1);
    setAddedAnimation(true);
    showToast(`Added ${product.name} (${selectedColor.name}) to your shopping bag.`);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    showToast(
      inWishlist ? `Removed ${product.name} from Wishlist` : `Saved ${product.name} to Wishlist`
    );
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  return (
    <div
      className="group flex flex-col justify-between relative bg-transparent text-[#191411]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Hover Crossfade & Controls */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F2EDE5] border border-[#EAE3D9] transition-all duration-500">
        <Link href={`/product/${product.id}`} className="block w-full h-full relative">
          {/* Primary image */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className={`object-cover object-center transition-all duration-700 ease-out ${
              isHovered && secondaryImage ? "opacity-0 scale-105" : "opacity-100 scale-100"
            }`}
          />
          {/* Secondary image for luxury reveal */}
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.name} alternate angle`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={`object-cover object-center absolute inset-0 transition-all duration-700 ease-out ${
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.isSignature && (
            <span className="bg-[#191411]/90 text-[#F5F2EB] text-[9px] uppercase tracking-[0.2em] font-sans-clean px-2.5 py-1 backdrop-blur-xs font-semibold">
              Signature
            </span>
          )}
          {product.isNewArrival && !product.isSignature && (
            <span className="bg-[#C5A880] text-[#191411] text-[9px] uppercase tracking-[0.2em] font-sans-clean px-2.5 py-1 font-semibold">
              New Arrival
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#FAF8F5]/85 backdrop-blur-xs flex items-center justify-center text-[#191411] hover:bg-[#FAF8F5] transition-all duration-300 shadow-xs cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              inWishlist ? "fill-[#9A7B4F] text-[#9A7B4F]" : "text-[#554C42] hover:text-[#191411]"
            }`}
          />
        </button>

        {/* Hover Action Bar: Quick Add & Quick View */}
        <div
          className={`absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-[#15110E]/80 via-[#15110E]/40 to-transparent transition-all duration-300 flex items-center gap-2 z-10 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <button
            onClick={handleQuickAdd}
            className="flex-1 bg-[#FAF8F5] hover:bg-[#FFFFFF] text-[#191411] py-2.5 px-3 text-[11px] uppercase tracking-[0.18em] font-sans-clean font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#2E4A3B]" /> Added
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Quick Add
              </>
            )}
          </button>
          <button
            onClick={handleQuickViewClick}
            aria-label="Quick View"
            className="w-10 h-10 bg-[#FAF8F5]/90 hover:bg-[#FFFFFF] text-[#191411] flex items-center justify-center transition-colors shadow-md shrink-0 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#3A322A]" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="pt-4 pb-2 space-y-2">
        {/* Color Swatches */}
        <div className="flex items-center gap-2">
          {product.colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color)}
              title={color.name}
              aria-label={`Select color ${color.name}`}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                selectedColor.name === color.name
                  ? "border-[#191411] ring-1 ring-[#9A7B4F] scale-110"
                  : "border-[#C5B9AC] opacity-80 hover:opacity-100"
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
          <span className="text-[10px] text-[#8C7F72] font-sans-clean ml-1">
            {product.colors.length > 1 ? `+${product.colors.length} shades` : ""}
          </span>
        </div>

        {/* Title & Price */}
        <div>
          <Link
            href={`/product/${product.id}`}
            className="font-serif-luxury text-lg text-[#191411] hover:text-[#9A7B4F] transition-colors block line-clamp-1"
          >
            {product.name}
          </Link>
          <p className="text-[11px] text-[#7A6F62] font-sans-clean line-clamp-1">
            {product.subtitle}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-serif-luxury text-base text-[#191411]">
              ${product.price} USD
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#9E9283] line-through font-sans-clean">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <span className="text-[10px] text-[#9A7B4F] font-sans-clean tracking-wider uppercase">
            {selectedColor.name}
          </span>
        </div>
      </div>
    </div>
  );
};
