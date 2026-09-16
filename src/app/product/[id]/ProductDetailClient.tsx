"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Heart,
  ShieldCheck,
  Package,
  Sparkles,
  ChevronDown,
  Check,
  Truck,
  RotateCcw,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Product, ProductColor } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUI } from "@/context/UIContext";
import { ProductCard } from "@/components/product/ProductCard";
import { PRODUCTS } from "@/data/products";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
  relatedProducts,
}) => {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useUI();

  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  const inWish = isInWishlist(product.id);

  // Track recently viewed products in localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("velora_recent");
      let ids: string[] = stored ? JSON.parse(stored) : [];
      ids = [product.id, ...ids.filter((id) => id !== product.id)].slice(0, 5);
      localStorage.setItem("velora_recent", JSON.stringify(ids));

      const recentItems = ids
        .filter((id) => id !== product.id)
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter(Boolean) as Product[];
      setRecentlyViewed(recentItems);
    } catch (e) {
      console.error(e);
    }
  }, [product.id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleAddToCart = () => {
    addItem(product, selectedColor, quantity);
    showToast(`Added ${quantity} × ${product.name} (${selectedColor.name}) to your shopping bag.`);
  };

  const handleBuyNow = () => {
    addItem(product, selectedColor, quantity);
    router.push("/checkout");
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <main className="min-h-screen bg-[#FBF9F5] text-[#191411] pb-24">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="text-[11px] font-sans-clean uppercase tracking-[0.2em] text-[#7A6F62]">
          <Link href="/" className="hover:text-[#191411] transition-colors">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/shop" className="hover:text-[#191411] transition-colors">
            Shop
          </Link>{" "}
          /{" "}
          <Link
            href={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-[#191411] transition-colors"
          >
            {product.category}
          </Link>{" "}
          / <span className="text-[#191411] font-medium">{product.name}</span>
        </nav>
      </div>

      {/* Main Editorial Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Gallery & Zoom Showcase (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Big Image with Subtle Zoom Lens */}
            <div
              className="relative aspect-[4/5] bg-[#F2EDE5] border border-[#E8E1D5] overflow-hidden cursor-crosshair"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <Image
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className={`object-cover object-center transition-transform duration-200 ${
                  isZoomed ? "scale-150" : "scale-100"
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                      }
                    : undefined
                }
              />

              <div className="absolute top-4 left-4 bg-[#191411]/90 text-[#FAF8F5] text-[9px] uppercase tracking-[0.2em] font-sans-clean px-3 py-1 font-semibold backdrop-blur-xs">
                {product.materials.includes("Italian") ? "Italian Sourcing" : "Atelier Edition"}
              </div>

              <div className="absolute bottom-3 right-3 text-[10px] text-[#7A6F62] bg-[#FAF8F5]/80 px-2 py-1 font-sans-clean backdrop-blur-xs">
                Hover to inspect leather grain
              </div>
            </div>

            {/* Thumbnails Row */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-[4/5] relative overflow-hidden bg-[#ECE5DB] border transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? "border-[#9A7B4F] ring-1 ring-[#9A7B4F]"
                      : "border-[#E0D7CB] opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Editorial Story Callout */}
            <div className="bg-[#F5F1EB] p-6 border border-[#E8E1D5] mt-8">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7B4F] font-sans-clean font-semibold block mb-1">
                The Silhouette Narrative
              </span>
              <p className="font-serif-luxury text-lg text-[#191411] italic mb-2">
                &ldquo;{product.story}&rdquo;
              </p>
              <p className="text-xs text-[#7A6F62] font-sans-clean leading-relaxed">
                Handcrafted in limited batches by third-generation Tuscan artisans using traditional bookbinding seam constructions.
              </p>
            </div>
          </div>

          {/* Right: Sticky Purchasing & Specs Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="border-b border-[#EAE3D9] pb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7B4F] font-sans-clean font-semibold">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-xs font-sans-clean text-[#9A7B4F]">
                  <Star className="w-3.5 h-3.5 fill-[#C5A880] text-[#C5A880]" />
                  <span className="font-medium text-[#191411]">{product.rating}</span>
                  <span className="text-[#8C7F72]">({product.reviewsCount} verified reviews)</span>
                </div>
              </div>

              <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#191411] font-normal tracking-tight">
                {product.name}
              </h1>

              <p className="text-xs font-sans-clean text-[#7A6F62] leading-relaxed">
                {product.subtitle}
              </p>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="font-serif-luxury text-3xl text-[#191411]">
                  ${product.price} USD
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#9E9283] line-through font-sans-clean">
                    ${product.originalPrice} USD
                  </span>
                )}
                <span className="text-[11px] text-[#2E4A3B] font-sans-clean font-medium ml-2">
                  Complimentary Shipping Included
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm font-sans-clean text-[#554C42] leading-relaxed font-light">
              {product.description}
            </p>

            {/* Color Swatch Selection */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-sans-clean">
                <span className="text-[#191411] font-medium uppercase tracking-wider">
                  Colorway:
                </span>
                <span className="text-[#9A7B4F] font-semibold">{selectedColor.name}</span>
              </div>

              <div className="flex items-center gap-3">
                {product.colors.map((color) => {
                  const isSelected = selectedColor.name === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select color ${color.name}`}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#191411] ring-2 ring-[#C5A880]/50 scale-110"
                          : "border-[#D8CEBF] opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
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
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-sans-clean text-[#191411] uppercase tracking-wider font-medium">
                Quantity:
              </span>
              <div className="flex items-center border border-[#DCD3C7] bg-[#FAF8F5]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1.5 text-xs text-[#554C42] hover:bg-[#EFEBE4] transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 text-xs font-sans-clean font-semibold text-[#191411]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-1.5 text-xs text-[#554C42] hover:bg-[#EFEBE4] transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs: Add to Bag & Buy Now & Wishlist */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#191411] hover:bg-[#382E26] text-[#FAF8F5] py-4 text-xs uppercase tracking-[0.22em] font-sans-clean font-semibold transition-all shadow-md cursor-pointer"
                >
                  Add to Bag • ${product.price * quantity} USD
                </button>

                <button
                  onClick={() => {
                    toggleWishlist(product.id);
                    showToast(
                      inWish
                        ? `Removed ${product.name} from Wishlist`
                        : `Saved ${product.name} to Wishlist`
                    );
                  }}
                  className={`px-4 border transition-colors cursor-pointer flex items-center justify-center ${
                    inWish
                      ? "border-[#9A7B4F] bg-[#9A7B4F]/10 text-[#9A7B4F]"
                      : "border-[#D8CEBF] text-[#3A322A] hover:border-[#191411]"
                  }`}
                  aria-label="Wishlist toggle"
                >
                  <Heart className={`w-5 h-5 ${inWish ? "fill-[#9A7B4F]" : ""}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full bg-[#FAF8F5] hover:bg-[#EFEBE4] border border-[#191411] text-[#191411] py-4 text-xs uppercase tracking-[0.22em] font-sans-clean font-semibold transition-all cursor-pointer"
              >
                Buy It Now — Express Checkout
              </button>
            </div>

            {/* Value Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#EAE3D9] text-xs font-sans-clean text-[#554C42]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#9A7B4F]" />
                <span>Complimentary Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#9A7B4F]" />
                <span>30-Day Easy Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#9A7B4F]" />
                <span>Lifetime Atelier Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#9A7B4F]" />
                <span>Luxury Signature Gift Box</span>
              </div>
            </div>

            {/* Accordion Details */}
            <div className="border-t border-[#EAE3D9] divide-y divide-[#EAE3D9] text-xs font-sans-clean">
              {/* 1. Details & Dimensions */}
              <div>
                <button
                  onClick={() => toggleAccordion("details")}
                  className="w-full py-4 flex items-center justify-between text-left font-medium uppercase tracking-[0.16em] text-[#191411] hover:text-[#9A7B4F] transition-colors cursor-pointer"
                >
                  <span>Details & Measurements</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      openAccordion === "details" ? "rotate-180 text-[#9A7B4F]" : ""
                    }`}
                  />
                </button>
                {openAccordion === "details" && (
                  <div className="pb-5 space-y-2.5 text-[#554C42]">
                    <p>
                      <strong className="text-[#191411]">Dimensions:</strong> {product.dimensions}
                    </p>
                    <p>
                      <strong className="text-[#191411]">Strap Drop:</strong> {product.strapDrop}
                    </p>
                    <p>
                      <strong className="text-[#191411]">Lining:</strong> {product.lining}
                    </p>
                    <ul className="list-disc pl-4 space-y-1 pt-1 text-[#665D52]">
                      {product.details.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 2. Materials & Hardware */}
              <div>
                <button
                  onClick={() => toggleAccordion("materials")}
                  className="w-full py-4 flex items-center justify-between text-left font-medium uppercase tracking-[0.16em] text-[#191411] hover:text-[#9A7B4F] transition-colors cursor-pointer"
                >
                  <span>Materials & Hardware</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      openAccordion === "materials" ? "rotate-180 text-[#9A7B4F]" : ""
                    }`}
                  />
                </button>
                {openAccordion === "materials" && (
                  <div className="pb-5 space-y-2 text-[#554C42]">
                    <p>
                      <strong className="text-[#191411]">Leather Grade:</strong> {product.materials}
                    </p>
                    <p>
                      <strong className="text-[#191411]">Hardware:</strong> {product.hardware}
                    </p>
                    <p className="pt-1 text-[#665D52] leading-relaxed">
                      All skins originate from audited tanneries adhering to strict European environmental standards. Every hide is tanned organically without heavy toxic salts.
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Shipping & Complimentary Returns */}
              <div>
                <button
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full py-4 flex items-center justify-between text-left font-medium uppercase tracking-[0.16em] text-[#191411] hover:text-[#9A7B4F] transition-colors cursor-pointer"
                >
                  <span>Shipping & Returns</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      openAccordion === "shipping" ? "rotate-180 text-[#9A7B4F]" : ""
                    }`}
                  />
                </button>
                {openAccordion === "shipping" && (
                  <div className="pb-5 space-y-2 text-[#665D52] leading-relaxed">
                    <p>
                      Orders dispatched within 24 hours from our Milan atelier. Complimentary carbon-neutral express courier delivery on all orders over $150 USD.
                    </p>
                    <p>
                      Returns are accepted within 30 days of delivery. Every order arrives presented in an archival cotton dust bag, certificate of provenance, and velvet gift box.
                    </p>
                  </div>
                )}
              </div>

              {/* 4. Leather Care Guide */}
              <div>
                <button
                  onClick={() => toggleAccordion("care")}
                  className="w-full py-4 flex items-center justify-between text-left font-medium uppercase tracking-[0.16em] text-[#191411] hover:text-[#9A7B4F] transition-colors cursor-pointer"
                >
                  <span>Atelier Care Guide</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      openAccordion === "care" ? "rotate-180 text-[#9A7B4F]" : ""
                    }`}
                  />
                </button>
                {openAccordion === "care" && (
                  <div className="pb-5 space-y-2 text-[#665D52] leading-relaxed">
                    <p>
                      Store in the included archival cotton dust bag away from direct sunlight and extreme heat.
                    </p>
                    <p>
                      Should the bag encounter rain, gently dab dry with an uncolored microfiber cloth. Condition annually with organic beeswax leather balm.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[#EAE3D9]">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7B4F] font-sans-clean font-semibold block mb-2">
                  Harmonious Complements
                </span>
                <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#191411]">
                  You May Also Admire
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-xs uppercase tracking-wider font-sans-clean font-semibold text-[#191411] hover:text-[#9A7B4F] flex items-center gap-1 transition-colors"
              >
                View Collection <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="mt-20 pt-16 border-t border-[#EAE3D9]">
            <h3 className="font-serif-luxury text-2xl text-[#191411] mb-8">
              Recently Viewed
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {recentlyViewed.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="group block bg-[#FAF8F5] border border-[#E8E1D5] p-3 transition-all hover:border-[#9A7B4F]"
                >
                  <div className="aspect-[4/5] relative overflow-hidden bg-[#ECE5DB] mb-3">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="font-serif-luxury text-base text-[#191411] group-hover:text-[#9A7B4F] transition-colors line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-xs font-sans-clean text-[#7A6F62]">${item.price} USD</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
