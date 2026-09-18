"use client";

import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  variant?: "dark" | "light" | "gold";
  size?: "sm" | "md" | "lg" | "xl";
  showSubtext?: boolean;
  subtext?: string;
  iconOnly?: boolean;
  href?: string;
  className?: string;
  whiteBg?: boolean;
}

export const BrandCrestEmblem: React.FC<{
  size?: number;
  className?: string;
  variant?: "dark" | "light" | "gold";
  whiteFill?: boolean;
}> = ({ size = 42, className = "", variant = "dark", whiteFill = false }) => {
  const gradId = React.useId();
  const isLight = variant === "light";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-500 ease-out group-hover:scale-[1.05] ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`gold-${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isLight ? "#F5EAD9" : "#DFC399"} />
          <stop offset="35%" stopColor={isLight ? "#DFC299" : "#C5A880"} />
          <stop offset="70%" stopColor={isLight ? "#BA9762" : "#9A7B4F"} />
          <stop offset="100%" stopColor={isLight ? "#967543" : "#72532A"} />
        </linearGradient>
        <radialGradient id={`glow-${gradId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C5A880" stopOpacity={isLight ? "0.22" : "0.1"} />
          <stop offset="100%" stopColor="#C5A880" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient Radial Backlight */}
      <circle cx="40" cy="40" r="36" fill={`url(#glow-${gradId})`} />

      {/* Optional White Medallion Base if explicitly requested */}
      {whiteFill && (
        <circle
          cx="40"
          cy="40"
          r="37.5"
          fill="#FFFFFF"
          stroke="#EAE3D9"
          strokeWidth="1.2"
        />
      )}

      {/* Outer Florentine Cartouche Frame */}
      <path
        d="M40 5 L68 17 L76 44 L62 70 L40 75 L18 70 L4 44 L12 17 Z"
        stroke={`url(#gold-${gradId})`}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill={whiteFill ? "#FFFFFF" : "none"}
        className="transition-opacity duration-300 group-hover:stroke-opacity-100"
        strokeOpacity={isLight ? "0.95" : "0.85"}
      />

      {/* Inset Dotted Atelier Stitching Line */}
      <path
        d="M40 10 L64 20 L71 44 L59 66 L40 70 L21 66 L9 44 L16 20 Z"
        stroke={`url(#gold-${gradId})`}
        strokeWidth="0.8"
        strokeDasharray="2.5 2.5"
        fill="none"
        strokeOpacity={isLight ? "0.7" : "0.55"}
      />

      {/* Top 4-point Florentine Star Finial */}
      <path
        d="M40 14 C40 17 43 18 45.5 18 C43 18 40 19 40 22 C40 19 37 18 34.5 18 C37 18 40 17 40 14 Z"
        fill={`url(#gold-${gradId})`}
      />

      {/* Sculpted 'V' Monogram - Primary Silhouette */}
      <path
        d="M23 27 L40 62 L57 27 H50.5 L40 50 L29.5 27 Z"
        fill={`url(#gold-${gradId})`}
      />

      {/* Inner Architectural V Accent Line */}
      <path
        d="M33 27 L40 42 L47 27"
        stroke={`url(#gold-${gradId})`}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Center Artisan Micro-Rivet */}
      <circle cx="40" cy="65.5" r="1.5" fill={`url(#gold-${gradId})`} />
    </svg>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "dark",
  size = "md",
  showSubtext = true,
  subtext = "Atelier Milano",
  iconOnly = false,
  href = "/",
  className = "",
  whiteBg = false,
}) => {
  // If whiteBg is true, we force dark typography for optimal contrast against white
  const activeVariant = whiteBg ? "dark" : variant;

  // Size metrics
  const sizeConfig = {
    sm: {
      iconSize: 30,
      titleSize: "text-lg sm:text-xl",
      subtextSize: "text-[7.5px] tracking-[0.38em]",
      gap: "gap-2.5",
      pad: "p-2 px-3",
    },
    md: {
      iconSize: 40,
      titleSize: "text-2xl sm:text-[27px] lg:text-[30px]",
      subtextSize: "text-[8.5px] sm:text-[9px] tracking-[0.44em]",
      gap: "gap-3 sm:gap-3.5",
      pad: "p-2.5 px-4",
    },
    lg: {
      iconSize: 50,
      titleSize: "text-3xl sm:text-4xl",
      subtextSize: "text-[10px] sm:text-[10.5px] tracking-[0.48em]",
      gap: "gap-4",
      pad: "p-3 px-5",
    },
    xl: {
      iconSize: 68,
      titleSize: "text-4xl sm:text-5xl lg:text-6xl",
      subtextSize: "text-xs tracking-[0.52em]",
      gap: "gap-5",
      pad: "p-4 px-6",
    },
  }[size];

  const textColorClass =
    activeVariant === "light"
      ? "text-[#FFFFFF] group-hover:text-[#DFC399]"
      : activeVariant === "gold"
      ? "text-[#C5A880] group-hover:text-[#DFC399]"
      : "text-[#191411] group-hover:text-[#9A7B4F]";

  const subtextColorClass =
    activeVariant === "light"
      ? "text-[#C5A880]"
      : activeVariant === "gold"
      ? "text-[#EAE3D9]/70"
      : "text-[#8C7F72]";

  const innerContent = (
    <div
      className={`inline-flex items-center ${sizeConfig.gap} group select-none ${
        whiteBg
          ? `bg-white border border-[#EAE3D9] rounded-2xl shadow-xs ${sizeConfig.pad}`
          : ""
      } ${className}`}
    >
      {/* Monogram Crest Emblem */}
      <BrandCrestEmblem
        size={sizeConfig.iconSize}
        variant={activeVariant}
        whiteFill={whiteBg}
      />

      {/* Typographic Wordmark */}
      {!iconOnly && (
        <div className="flex flex-col justify-center leading-none">
          <span
            className={`font-serif-luxury ${sizeConfig.titleSize} tracking-[0.24em] font-normal uppercase transition-colors duration-300 ${textColorClass}`}
          >
            VELORA
          </span>
          {showSubtext && (
            <span
              className={`block ${sizeConfig.subtextSize} uppercase font-sans-clean font-medium mt-1 transition-colors duration-300 ${subtextColorClass}`}
            >
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A880] rounded">
        {innerContent}
      </Link>
    );
  }

  return innerContent;
};
