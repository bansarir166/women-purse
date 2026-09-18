"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Check, Loader2 } from "lucide-react";
import { FaInstagram, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import { BrandLogo } from "@/components/ui/BrandLogo";


export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "Footer" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Subscription failed. Please try again.");
      }

      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 6000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-[#171310] text-[#EFEBE4] pt-20 pb-12 border-t border-[#29221C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Brand Promise Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#2C241E]">
          <div className="lg:col-span-5 space-y-4">
            <BrandLogo variant="light" size="lg" subtext="Atelier Milano & Firenze" />
            <p className="text-sm font-sans-clean text-[#ADA193] font-light leading-relaxed max-w-md">
              Atelier of quiet luxury, sculpted silhouettes, and master-crafted Italian leather goods. Designed to endure generations, never seasons.
            </p>
            <div className="pt-2 flex items-center gap-6 text-[#9A7B4F] text-xs font-sans-clean tracking-wider uppercase">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" /> Lifetime Guarantee
              </span>
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A880]" /> Florence Sourcing
              </span>
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#C5A880] font-sans-clean font-semibold mb-2">
              Privilege Circle
            </p>
            <h3 className="font-serif-luxury text-2xl text-[#FAF8F5] mb-3">
              Receive Invitations to Private Releases
            </h3>
            <p className="text-xs text-[#9E9283] font-sans-clean leading-relaxed mb-5 max-w-lg">
              Subscribers receive early access to seasonal allocations, atelier journal entries, and private invitations.
            </p>

            <form onSubmit={handleSubscribe} className="flex max-w-md relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="Enter your email address"
                required
                disabled={isLoading || subscribed}
                className="w-full bg-[#241D17] border border-[#3E342B] text-xs tracking-wider text-[#FBF9F5] px-4 py-3.5 focus:outline-hidden focus:border-[#C5A880] placeholder-[#766A5D] transition-colors font-sans-clean disabled:opacity-60"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                disabled={isLoading || subscribed}
                className="bg-[#C5A880] hover:bg-[#B39366] text-[#140F0C] px-6 text-xs uppercase tracking-[0.2em] font-sans-clean font-semibold transition-colors flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : subscribed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </form>
            {errorMessage && (
              <p className="text-[11px] text-red-400 mt-2 font-sans-clean">
                {errorMessage}
              </p>
            )}
            {subscribed && (
              <p className="text-[11px] text-[#C5A880] mt-2 font-sans-clean">
                Thank you. Welcome to the world of VELORA.
              </p>
            )}
          </div>
        </div>

        {/* Navigation Links Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 text-xs font-sans-clean">
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#F5EFEB] font-semibold mb-5">
              The Collection
            </h4>
            <ul className="space-y-3 text-[#9E9283]">
              <li>
                <Link href="/shop?category=Handbags" className="hover:text-[#FAF8F5] transition-colors">
                  Signature Handbags
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Shoulder+Bags" className="hover:text-[#FAF8F5] transition-colors">
                  Shoulder Bags
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Totes" className="hover:text-[#FAF8F5] transition-colors">
                  Architectural Totes
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Mini+Bags" className="hover:text-[#FAF8F5] transition-colors">
                  Evening Mini Bags
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Clutches" className="hover:text-[#FAF8F5] transition-colors">
                  Envelope Clutches
                </Link>
              </li>
              <li>
                <Link href="/shop?sort=newest" className="hover:text-[#FAF8F5] transition-colors">
                  New In: Autumn 26
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#F5EFEB] font-semibold mb-5">
              Client Care
            </h4>
            <ul className="space-y-3 text-[#9E9283]">
              <li>
                <Link href="/about#shipping" className="hover:text-[#FAF8F5] transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/about#returns" className="hover:text-[#FAF8F5] transition-colors">
                  Complimentary Returns
                </Link>
              </li>
              <li>
                <Link href="/about#guarantee" className="hover:text-[#FAF8F5] transition-colors">
                  Lifetime Guarantee
                </Link>
              </li>
              <li>
                <Link href="/about#care" className="hover:text-[#FAF8F5] transition-colors">
                  Leather Care Guide
                </Link>
              </li>
              <li>
                <a href="mailto:concierge@velora.com" className="hover:text-[#FAF8F5] transition-colors">
                  Private Concierge
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#F5EFEB] font-semibold mb-5">
              The Atelier
            </h4>
            <ul className="space-y-3 text-[#9E9283]">
              <li>
                <Link href="/about" className="hover:text-[#FAF8F5] transition-colors">
                  Our Florence Heritage
                </Link>
              </li>
              <li>
                <Link href="/about#leather" className="hover:text-[#FAF8F5] transition-colors">
                  Tuscan Tannery Sourcing
                </Link>
              </li>
              <li>
                <Link href="/about#sustainability" className="hover:text-[#FAF8F5] transition-colors">
                  Sustainable Practices
                </Link>
              </li>
              <li>
                <Link href="/about#press" className="hover:text-[#FAF8F5] transition-colors">
                  Press & Editorial
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FAF8F5] transition-colors">
                  Careers at VELORA
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#F5EFEB] font-semibold mb-5">
              Connect
            </h4>
            <p className="text-xs text-[#9E9283] leading-relaxed mb-4">
              Via Montenapoleone 18, Milan<br />
              Atelier Appointments by Request
            </p>
            <div className="flex items-center space-x-4 text-[#C5A880] mb-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 border border-[#3E342B] flex items-center justify-center hover:border-[#C5A880] hover:text-[#FAF8F5] transition-colors"
              >
                <FaInstagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 border border-[#3E342B] flex items-center justify-center hover:border-[#C5A880] hover:text-[#FAF8F5] transition-colors"
              >
                <FaFacebookF className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-9 h-9 border border-[#3E342B] flex items-center justify-center hover:border-[#C5A880] hover:text-[#FAF8F5] transition-colors"
              >
                <FaXTwitter className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-[11px] text-[#7A6E61]">
              concierge@velora.com
            </p>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-8 border-t border-[#261F1A] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#766A5D] font-sans-clean space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} VELORA ATELIER S.R.L. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center space-x-6">
            <Link href="/about" className="hover:text-[#ADA193] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-[#ADA193] transition-colors">
              Terms of Service
            </Link>
            <Link href="/about" className="hover:text-[#ADA193] transition-colors">
              Cookie Preferences
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
