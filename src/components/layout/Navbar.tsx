"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, Menu, X, User, ChevronRight, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUI } from "@/context/UIContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/ui/BrandLogo";

interface MegaMenuSection {
  subcategoriesTitle: string;
  subcategories: { label: string; href: string }[];
  editsTitle: string;
  edits: { label: string; href: string }[];
  featured: {
    tag: string;
    name: string;
    price: number;
    href: string;
    image: string;
    subtitle: string;
  }[];
}

const MEGA_MENU_DATA: Record<string, MegaMenuSection> = {
  "New Arrivals": {
    subcategoriesTitle: "Autumn / Winter 2026 Drops",
    subcategories: [
      { label: "All New Arrivals (Seasonal Edit)", href: "/shop?sort=newest" },
      { label: "Limited Atelier Allocations", href: "/shop?sort=newest" },
      { label: "Runway Evening Editions", href: "/shop?category=Mini+Bags&sort=newest" },
      { label: "Tuscan Warm Neutrals Capsule", href: "/shop?color=Warm+Ivory&sort=newest" },
    ],
    editsTitle: "Featured Debuts",
    edits: [
      { label: "Quilted Leather Silhouettes", href: "/shop?category=Shoulder+Bags&sort=newest" },
      { label: "Architectural Bucket Bags", href: "/shop?category=Handbags&sort=newest" },
      { label: "Convertible Belt & Slings", href: "/shop?category=Mini+Bags&sort=newest" },
      { label: "Grand Tuscan Weekenders", href: "/shop?category=Totes&sort=newest" },
    ],
    featured: [
      {
        tag: "Explore Catalogue",
        name: "New Autumn Arrivals",
        price: 199,
        href: "/shop?sort=newest",
        image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=600&auto=format&fit=crop",
        subtitle: "View Full Seasonal Catalogue",
      },
      {
        tag: "Explore Catalogue",
        name: "Architectural Releases",
        price: 179,
        href: "/shop?category=Handbags&sort=newest",
        image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=600&auto=format&fit=crop",
        subtitle: "View Handbag Catalogue",
      },
    ],
  },
  "Best Sellers": {
    subcategoriesTitle: "Most Coveted Silhouettes",
    subcategories: [
      { label: "All Best Sellers Catalogue", href: "/shop?sort=popular" },
      { label: "Top-Rated Shoulder Bags", href: "/shop?category=Shoulder+Bags&sort=popular" },
      { label: "Everyday Signature Totes", href: "/shop?category=Totes&sort=popular" },
      { label: "Evening Minis & Clutches", href: "/shop?category=Mini+Bags&sort=popular" },
    ],
    editsTitle: "Collector Acclaim",
    edits: [
      { label: "Highest Rated Collector Pieces", href: "/shop?sort=rating" },
      { label: "Full-Grain Italian Calfskin Icons", href: "/shop?material=Full-Grain+Italian+Calfskin" },
      { label: "Heritage Top-Handle Satchels", href: "/shop?category=Handbags&sort=popular" },
      { label: "Slouchy Buttery Nappa Hobos", href: "/shop?category=Shoulder+Bags&sort=popular" },
    ],
    featured: [
      {
        tag: "Explore Catalogue",
        name: "Best-Selling Shoulder Bags",
        price: 189,
        href: "/shop?category=Shoulder+Bags&sort=popular",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop",
        subtitle: "View Shoulder Bag Catalogue",
      },
      {
        tag: "Explore Catalogue",
        name: "Best-Selling Everyday Totes",
        price: 229,
        href: "/shop?category=Totes&sort=popular",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop",
        subtitle: "View All Totes Catalogue",
      },
    ],
  },
  "Shop by Category": {
    subcategoriesTitle: "Explore All Silhouettes",
    subcategories: [
      { label: "Handbags & Top Handles", href: "/shop?category=Handbags" },
      { label: "Shoulder & Baguette Bags", href: "/shop?category=Shoulder+Bags" },
      { label: "Architectural Totes", href: "/shop?category=Totes" },
      { label: "Mini Bags & Crossbodies", href: "/shop?category=Mini+Bags" },
      { label: "Envelope Clutches", href: "/shop?category=Clutches" },
    ],
    editsTitle: "Curated Formats",
    edits: [
      { label: "Work & Laptop Ready Bags", href: "/shop?category=Totes" },
      { label: "Gala & Black-Tie Editions", href: "/shop?category=Mini+Bags" },
      { label: "Hands-Free Crossbodies", href: "/shop?category=Handbags" },
      { label: "Explore Entire 12-Piece Atelier", href: "/shop" },
    ],
    featured: [
      {
        tag: "Explore Catalogue",
        name: "Shoulder Bags Catalogue",
        price: 169,
        href: "/shop?category=Shoulder+Bags",
        image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=600&auto=format&fit=crop",
        subtitle: "Browse All Shoulder Bags",
      },
      {
        tag: "Explore Catalogue",
        name: "Mini Purses & Clutches",
        price: 149,
        href: "/shop?category=Mini+Bags",
        image: "https://images.unsplash.com/photo-1575032617751-6ddec2089882?q=80&w=600&auto=format&fit=crop",
        subtitle: "Browse All Mini Bags",
      },
    ],
  },
  "Featured Collection": {
    subcategoriesTitle: "Curated Flagships",
    subcategories: [
      { label: "The Flagship 4 Pieces", href: "/shop?tag=Featured" },
      { label: "Full Atelier Catalogue", href: "/shop" },
      { label: "Double-Faced Tuscan Leathers", href: "/shop?material=Semi-Vegetable+Tanned+Leather" },
      { label: "Full-Grain Italian Calfskin", href: "/shop?material=Full-Grain+Italian+Calfskin" },
    ],
    editsTitle: "Signature Capsules",
    edits: [
      { label: "The Warm Ivory & Alabaster Edit", href: "/shop?color=Warm+Ivory" },
      { label: "Deep Espresso & Cognac Capsule", href: "/shop?color=Espresso" },
      { label: "Heritage Structured Satchels", href: "/shop?category=Handbags" },
      { label: "Slouchy Glove Nappa Hobos", href: "/shop?category=Shoulder+Bags" },
    ],
    featured: [
      {
        tag: "Explore Catalogue",
        name: "The Flagship Collection",
        price: 149,
        href: "/shop?tag=Featured",
        image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=600&auto=format&fit=crop",
        subtitle: "View 4 Flagship Editions",
      },
      {
        tag: "Explore Catalogue",
        name: "Complete Handbag Archive",
        price: 129,
        href: "/shop",
        image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=600&auto=format&fit=crop",
        subtitle: "Browse All 12 Creations",
      },
    ],
  },
};

const MAIN_HEADER_LINKS = [
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "Best Sellers", href: "/shop?sort=popular" },
  { label: "Shop by Category", href: "/shop" },
  { label: "Featured Collection", href: "/shop?tag=Featured" },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  const pathname = usePathname();
  const { setIsOpen: setCartOpen, totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { openSearch } = useUI();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu and mega menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMegaMenu(null);
  }, [pathname]);

  const currentMenu = activeMegaMenu ? MEGA_MENU_DATA[activeMegaMenu] : null;

  return (
    <header
      onMouseLeave={() => setActiveMegaMenu(null)}
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FBF9F5]/95 backdrop-blur-md shadow-xs border-b border-[#E8E1D5]/80 py-3.5"
          : "bg-[#FBF9F5] border-b border-[#EAE3D9]/60 py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Brand Logo (at start) & Mobile Menu Toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#191411] hover:text-[#C5A880] transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo with Monogram Crest */}
            <BrandLogo size="md" />
          </div>

          {/* Center: Desktop Main Links (New Arrivals, Best Sellers, Shop by Category, Featured Collection) */}
          <nav className="hidden lg:flex items-center space-x-8">
            {MAIN_HEADER_LINKS.map((link) => (
              <div
                key={link.label}
                onMouseEnter={() => {
                  if (MEGA_MENU_DATA[link.label]) {
                    setActiveMegaMenu(link.label);
                  } else {
                    setActiveMegaMenu(null);
                  }
                }}
                className="relative py-1"
              >
                <Link
                  href={link.href}
                  className={`text-[12px] uppercase tracking-[0.18em] font-sans-clean font-medium transition-colors flex items-center gap-1 relative ${
                    activeMegaMenu === link.label
                      ? "text-[#191411]"
                      : pathname === link.href
                      ? "text-[#111111]"
                      : "text-[#554C42] hover:text-[#111111]"
                  }`}
                >
                  {link.label}
                  {MEGA_MENU_DATA[link.label] && (
                    <ChevronDown className="w-3 h-3 text-[#A89F93]" />
                  )}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-[-6px] left-0 right-0 h-[1.5px] bg-[#C5A880]"
                    />
                  )}
                </Link>
              </div>
            ))}
          </nav>

          {/* Right: About Link & Action Icons */}
          <div className="flex items-center space-x-5 sm:space-x-6">
            <nav className="hidden lg:flex items-center space-x-7 mr-2">
              <Link
                href="/about"
                className="text-[12px] uppercase tracking-[0.18em] font-sans-clean font-medium text-[#554C42] hover:text-[#111111] transition-colors"
              >
                About
              </Link>
            </nav>

            {/* Search Icon */}
            <button
              onClick={openSearch}
              className="text-[#3A322A] hover:text-[#111111] transition-colors p-1 cursor-pointer"
              aria-label="Search collection"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Account Link */}
            {isAuthenticated ? (
              <Link
                href="/account"
                className="hidden sm:inline-flex items-center gap-1.5 text-[#3A322A] hover:text-[#111111] transition-colors p-1"
                aria-label="My Atelier Account"
              >
                <div className="relative">
                  <User className="w-[18px] h-[18px]" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#9A7B4F] rounded-full border border-white" />
                </div>
                <span className="text-[11px] font-sans-clean font-medium text-[#554C42] max-w-[85px] truncate hidden md:inline-block">
                  {user?.firstName || "Privé"}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-block text-[#3A322A] hover:text-[#111111] transition-colors p-1"
                aria-label="Sign In"
              >
                <User className="w-[18px] h-[18px]" />
              </Link>
            )}

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="text-[#3A322A] hover:text-[#111111] transition-colors p-1 relative"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart className="w-[18px] h-[18px]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C5A880] text-white text-[9px] font-sans-clean font-semibold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="text-[#3A322A] hover:text-[#111111] transition-colors p-1 relative group cursor-pointer"
              aria-label={`Shopping Bag (${totalItemsCount} items)`}
            >
              <ShoppingBag className="w-[19px] h-[19px]" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 bg-[#1A1410] text-[#F9F6F0] text-[9px] font-sans-clean font-semibold rounded-full flex items-center justify-center border border-[#E8E1D5]">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Mega Menu Dropdown */}
      <AnimatePresence>
        {activeMegaMenu && currentMenu && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
            onMouseLeave={() => setActiveMegaMenu(null)}
            className="hidden lg:block absolute left-0 right-0 top-full bg-[#FBF9F5] border-b border-[#E8E1D5] shadow-2xl z-30"
          >
            <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-4 gap-8">
              {/* Column 1: Specific Subcategories */}
              <div>
                <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#9A7B4F] font-sans-clean font-semibold mb-4">
                  {currentMenu.subcategoriesTitle}
                </h4>
                <ul className="space-y-3 font-serif-luxury text-[#3A322A]">
                  {currentMenu.subcategories.map((item, idx) => (
                    <li key={idx}>
                      <Link
                        href={item.href}
                        onClick={() => setActiveMegaMenu(null)}
                        className="hover:text-[#9A7B4F] transition-colors text-base block"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Curated Edits for this exact category */}
              <div>
                <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#9A7B4F] font-sans-clean font-semibold mb-4">
                  {currentMenu.editsTitle}
                </h4>
                <ul className="space-y-3 font-serif-luxury text-[#3A322A]">
                  {currentMenu.edits.map((item, idx) => (
                    <li key={idx}>
                      <Link
                        href={item.href}
                        onClick={() => setActiveMegaMenu(null)}
                        className="hover:text-[#9A7B4F] transition-colors text-base block"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3 & 4: Two Tailored Featured Products */}
              <div className="col-span-2 grid grid-cols-2 gap-4">
                {currentMenu.featured.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setActiveMegaMenu(null)}
                    className="group block relative overflow-hidden bg-[#F2EDE5] p-4 border border-[#E8E1D5] hover:border-[#9A7B4F] transition-all"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden mb-3 bg-[#ECE5DB]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A7B4F] font-sans-clean font-semibold">
                      {item.tag}
                    </p>
                    <p className="font-serif-luxury text-lg text-[#191411] group-hover:text-[#9A7B4F] transition-colors">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#7A6F62] font-sans-clean">
                      ${item.price} USD • {item.subtitle}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-[#FBF9F5] z-50 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#E8E1D5]">
                  <BrandLogo size="sm" />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-[#3A322A] hover:text-[#191411]"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="py-6 space-y-4">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openSearch();
                    }}
                    className="flex items-center gap-2.5 text-xs uppercase tracking-[0.16em] font-sans-clean font-medium text-[#554C42] py-2.5 px-3.5 bg-[#F2EDE5] rounded-xs border border-[#E0D7CB] mb-2 hover:bg-[#EAE3D9] transition-colors w-full text-left cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-[#9A7B4F]" />
                    <span>Search Collection</span>
                  </button>
                  {MAIN_HEADER_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between text-sm uppercase tracking-[0.16em] font-sans-clean font-medium text-[#221C17] py-2 hover:text-[#9A7B4F] transition-colors"
                    >
                      {link.label}
                      <ChevronRight className="w-4 h-4 text-[#C5B9AC]" />
                    </Link>
                  ))}

                  {/* Mobile Shop by Category Sub-options */}
                  <div className="pt-2 pl-3 border-l-2 border-[#E8E1D5] space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#9A7B4F] font-sans-clean font-semibold mb-2">
                      Silhouettes
                    </p>
                    <Link
                      href="/shop?category=Handbags"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs font-serif-luxury text-[#554C42] hover:text-[#191411] py-1"
                    >
                      Handbags
                    </Link>
                    <Link
                      href="/shop?category=Shoulder+Bags"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs font-serif-luxury text-[#554C42] hover:text-[#191411] py-1"
                    >
                      Shoulder Bags
                    </Link>
                    <Link
                      href="/shop?category=Totes"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs font-serif-luxury text-[#554C42] hover:text-[#191411] py-1"
                    >
                      Architectural Totes
                    </Link>
                    <Link
                      href="/shop?category=Mini+Bags"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs font-serif-luxury text-[#554C42] hover:text-[#191411] py-1"
                    >
                      Mini Bags & Clutches
                    </Link>
                  </div>

                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between text-sm uppercase tracking-[0.16em] font-sans-clean font-medium text-[#221C17] py-2 hover:text-[#9A7B4F] transition-colors"
                  >
                    About The Atelier
                    <ChevronRight className="w-4 h-4 text-[#C5B9AC]" />
                  </Link>

                  {/* Mobile Account Action */}
                  <div className="pt-2">
                    {isAuthenticated ? (
                      <div className="p-3 bg-[#F5F1EB] border border-[#E8E1D5] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase tracking-[0.2em] text-[#9A7B4F] font-semibold font-sans-clean">
                            {user?.membershipTier}
                          </span>
                          <span className="text-xs text-[#191411] font-serif-luxury font-semibold">
                            {user?.firstName}
                          </span>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Link
                            href="/account"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex-1 py-2 bg-[#191411] text-[#F9F6F0] text-center text-[10px] uppercase tracking-[0.16em] font-semibold font-sans-clean"
                          >
                            My Account
                          </Link>
                          <button
                            onClick={() => {
                              setMobileMenuOpen(false);
                              logout();
                            }}
                            className="px-3 py-2 border border-[#D8CEBF] text-[#554C42] text-[10px] uppercase tracking-[0.16em] font-semibold font-sans-clean cursor-pointer"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between text-sm uppercase tracking-[0.16em] font-sans-clean font-medium text-[#221C17] py-2 hover:text-[#9A7B4F] transition-colors"
                      >
                        <span>Sign In / Join Privé</span>
                        <ChevronRight className="w-4 h-4 text-[#C5B9AC]" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E8E1D5] space-y-4">
                <div className="text-xs text-[#7A6F62] font-sans-clean leading-relaxed">
                  <p className="font-medium text-[#191411] uppercase tracking-wider mb-1">
                    Atelier Concierge
                  </p>
                  <p>Mon–Fri, 9am–6pm CET</p>
                  <p className="text-[#9A7B4F] mt-1">concierge@velora.com</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
