"use client";

import React, { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "Homepage Circle" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Subscription failed. Please try again.");
      }

      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 7000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 sm:py-32 bg-[#F3EFE9] border-b border-[#EAE3D9] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#9A7B4F] font-sans-clean font-semibold block mb-3">
          The Atelier Circle
        </span>

        <h2 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl text-[#191411] font-light tracking-tight mb-5">
          Enter the World of <span className="italic font-normal">VELORA.</span>
        </h2>

        <p className="text-sm sm:text-base font-sans-clean text-[#665D52] font-light max-w-xl mx-auto mb-10 leading-relaxed">
          Be the first to discover new collections, private releases, and exclusive offers.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMessage) setErrorMessage("");
            }}
            placeholder="Your email address"
            required
            disabled={isLoading || subscribed}
            className="flex-1 bg-[#FAF8F5] border border-[#D8CEBF] text-xs tracking-wider px-5 py-4 focus:outline-hidden focus:border-[#9A7B4F] text-[#191411] placeholder-[#9E9283] font-sans-clean transition-colors disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading || subscribed}
            className="bg-[#191411] hover:bg-[#382E26] text-[#FAF8F5] px-8 py-4 text-xs uppercase tracking-[0.2em] font-sans-clean font-semibold transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#C5A880]" /> Sending...
              </>
            ) : subscribed ? (
              <>
                <Check className="w-4 h-4 text-[#C5A880]" /> Joined
              </>
            ) : (
              <>
                Subscribe <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {errorMessage && (
          <p className="text-xs text-red-600 font-sans-clean mt-3 font-medium">
            {errorMessage}
          </p>
        )}

        {subscribed && (
          <p className="text-xs text-[#2E4A3B] font-sans-clean mt-3 font-medium">
            Welcome. An invitation to our latest seasonal edit has been dispatched to your inbox.
          </p>
        )}

        <p className="text-[10px] text-[#8C7F72] font-sans-clean tracking-wider uppercase mt-5">
          By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};
