"use client";

import React from "react";
import { FilterState } from "@/types";
import { X, RotateCcw } from "lucide-react";

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalProducts: number;
}

const CATEGORIES = ["All", "Handbags", "Shoulder Bags", "Totes", "Mini Bags", "Clutches"];
const COLORS = [
  { name: "All", hex: "transparent" },
  { name: "Warm Ivory", hex: "#F5F2EB" },
  { name: "Soft Champagne", hex: "#C5A880" },
  { name: "Espresso", hex: "#231B16" },
  { name: "Noir", hex: "#111111" },
  { name: "Warm Taupe", hex: "#B7A89A" },
  { name: "Caramel Cognac", hex: "#8A5333" },
  { name: "Forest Emerald", hex: "#2A4036" },
];
const SIZES = ["All", "Mini", "Small", "Medium", "Large"];
const MATERIALS = [
  "All",
  "Full-Grain Italian Calfskin",
  "Semi-Vegetable Tanned Leather",
  "Supple Glove Nappa",
  "Boxcalf Leather",
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalProducts,
}) => {
  const hasActiveFilters =
    filters.category !== "All" ||
    filters.color !== "All" ||
    filters.size !== "All" ||
    filters.material !== "All" ||
    filters.maxPrice < 350 ||
    filters.searchQuery !== "";

  return (
    <div className="space-y-8 text-xs font-sans-clean">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D9]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#191411]">
            Filter Catalog
          </span>
          <span className="text-[11px] text-[#8C7F72]">({totalProducts} pieces)</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-[10px] uppercase tracking-wider text-[#9A7B4F] hover:text-[#191411] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#191411] mb-3">
          Silhouette
        </h4>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onFilterChange({ category: cat })}
              className={`block w-full text-left py-1 text-xs transition-colors cursor-pointer ${
                filters.category === cat
                  ? "text-[#9A7B4F] font-semibold"
                  : "text-[#554C42] hover:text-[#191411]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#191411] mb-3">
          Palette
        </h4>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => {
            const isSelected = filters.color === color.name;
            return (
              <button
                key={color.name}
                onClick={() => onFilterChange({ color: color.name })}
                title={color.name}
                className={`flex items-center gap-2 px-2.5 py-1.5 border transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#191411] bg-[#191411] text-white"
                    : "border-[#E0D7CB] bg-[#FAF8F5] text-[#554C42] hover:border-[#191411]"
                }`}
              >
                {color.hex !== "transparent" && (
                  <span
                    className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                )}
                <span className="text-[11px]">{color.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#191411] mb-3">
          Proportions
        </h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onFilterChange({ size })}
              className={`px-3 py-1.5 border text-xs tracking-wider transition-colors cursor-pointer ${
                filters.size === size
                  ? "bg-[#191411] text-white border-[#191411]"
                  : "border-[#E0D7CB] bg-[#FAF8F5] text-[#554C42] hover:border-[#191411]"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#191411]">
            Maximum Price
          </h4>
          <span className="text-xs font-semibold text-[#9A7B4F]">${filters.maxPrice} USD</span>
        </div>
        <input
          type="range"
          min={100}
          max={350}
          step={10}
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
          className="w-full accent-[#191411] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#8C7F72] mt-1">
          <span>$100</span>
          <span>$350</span>
        </div>
      </div>

      {/* Material */}
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#191411] mb-3">
          Leather Sourcing
        </h4>
        <div className="space-y-2">
          {MATERIALS.map((mat) => (
            <button
              key={mat}
              onClick={() => onFilterChange({ material: mat })}
              className={`block w-full text-left py-1 text-xs transition-colors cursor-pointer ${
                filters.material === mat
                  ? "text-[#9A7B4F] font-semibold"
                  : "text-[#554C42] hover:text-[#191411]"
              }`}
            >
              {mat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
