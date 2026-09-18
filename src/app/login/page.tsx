"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Crown,
  KeyRound,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { BrandLogo } from "@/components/ui/BrandLogo";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const { login, register, isAuthenticated } = useAuth();
  const { showToast } = useUI();

  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // If already authenticated, allow instant navigation
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, redirectUrl, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        showToast("Welcome back to VELORA Atelier", "success");
        router.push(redirectUrl);
      } else {
        setErrorMessage(res.error || "Unable to sign in. Please verify credentials.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName.trim() || !email.trim()) {
      setErrorMessage("Please enter your name and email address.");
      return;
    }

    if (password && password.length < 6) {
      setErrorMessage("Password should be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await register(fullName, email, password);
      if (res.success) {
        showToast("Your Atelier Account has been created", "success");
        router.push(redirectUrl);
      } else {
        setErrorMessage(res.error || "Unable to create account.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      showToast("Atelier password instructions dispatched", "info");
      setIsForgotModalOpen(false);
      setForgotSent(false);
      setForgotEmail("");
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#FBF9F5] flex flex-col justify-center">
      {/* Back to shop navigation header */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-sans-clean text-[#7A6F62] hover:text-[#191411] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Boutique</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 bg-[#FAF8F5] border border-[#E8E1D5] shadow-xl overflow-hidden min-h-[640px]">
          
          {/* Left Column: Atelier Editorial Privilege & Provenance */}
          <div className="lg:col-span-5 relative bg-[#1E1814] text-[#F9F6F0] p-8 sm:p-12 flex flex-col justify-between overflow-hidden">
            {/* Background Editorial Image with Luxury Dark Gradient */}
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
              <Image
                src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1200&auto=format&fit=crop"
                alt="VELORA Atelier Florentine Craftsmanship"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#15110E] via-[#1E1814]/85 to-[#211A16]/90 z-0" />

            {/* Content Top */}
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#DFD3C3] text-[10px] uppercase tracking-[0.25em] font-sans-clean font-semibold rounded-full">
                <Crown className="w-3 h-3 text-[#C5A880]" />
                <span>Maison Privé</span>
              </div>

              <div className="space-y-3">
                <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#F9F6F0] leading-tight">
                  The Art of Refined Living
                </h2>
                <p className="text-xs sm:text-sm text-[#C5B9AC] font-sans-clean leading-relaxed font-light">
                  Join the VELORA circle to unlock private atelier allocations, bespoke monogramming, and personal concierge appointments.
                </p>
              </div>

              {/* Privileges List */}
              <div className="pt-4 space-y-3.5 border-t border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C5A880]/20 text-[#C5A880] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#F5E5C9] font-sans-clean uppercase tracking-wider">
                      Bespoke Monogramming
                    </h4>
                    <p className="text-[11px] text-[#A69B8E] font-light">
                      Complimentary hot-stamped gold foil or blind deboss initials on select silhouettes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C5A880]/20 text-[#C5A880] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#F5E5C9] font-sans-clean uppercase tracking-wider">
                      White-Glove Delivery
                    </h4>
                    <p className="text-[11px] text-[#A69B8E] font-light">
                      Fully insured, climate-controlled dispatch directly from Florence with custom gift packaging.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C5A880]/20 text-[#C5A880] flex items-center justify-center shrink-0 mt-0.5">
                    <KeyRound className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#F5E5C9] font-sans-clean uppercase tracking-wider">
                      Private Salon Previews
                    </h4>
                    <p className="text-[11px] text-[#A69B8E] font-light">
                      48-hour advance access to limited numbered editions before public release.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Bottom Provenance Quote */}
            <div className="relative z-10 pt-8 border-t border-white/10 mt-6">
              <blockquote className="font-editorial italic text-xs text-[#DFD3C3] leading-relaxed">
                &ldquo;A bag should not simply accompany a woman; it should articulate her poise.&rdquo;
              </blockquote>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#9A7B4F] font-sans-clean font-semibold mt-2">
                Atelier Master Artisan • Florence
              </p>
            </div>
          </div>

          {/* Right Column: Authentication Card & Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-center bg-[#FAF8F5]">
            <div className="max-w-md w-full mx-auto space-y-6">
              
              {/* Header Title */}
              <div className="space-y-1.5">
                <div className="mb-3">
                  <BrandLogo size="md" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7B4F] font-sans-clean font-semibold block">
                  Atelier Client Portal
                </span>
                <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#191411]">
                  {mode === "signin" ? "Sign In to Your Account" : "Create an Atelier Account"}
                </h1>
                <p className="text-xs sm:text-sm text-[#766E65] font-sans-clean">
                  {mode === "signin"
                    ? "Access your saved wishlists, custom monogram orders, and delivery status."
                    : "Enter your details below to become a recognized member of VELORA Privé."}
                </p>
              </div>

              {/* Mode Toggle Switch */}
              <div className="flex border-b border-[#E8E1D5]">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setErrorMessage("");
                  }}
                  className={`flex-1 py-3 text-xs uppercase tracking-[0.18em] font-sans-clean font-semibold transition-all relative cursor-pointer ${
                    mode === "signin"
                      ? "text-[#191411]"
                      : "text-[#8E8377] hover:text-[#191411]"
                  }`}
                >
                  Sign In
                  {mode === "signin" && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#9A7B4F]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setErrorMessage("");
                  }}
                  className={`flex-1 py-3 text-xs uppercase tracking-[0.18em] font-sans-clean font-semibold transition-all relative cursor-pointer ${
                    mode === "register"
                      ? "text-[#191411]"
                      : "text-[#8E8377] hover:text-[#191411]"
                  }`}
                >
                  Create Account
                  {mode === "register" && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#9A7B4F]" />
                  )}
                </button>
              </div>

              {/* Error Message if any */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-sans-clean rounded-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form Body */}
              <form
                onSubmit={mode === "signin" ? handleSignIn : handleRegister}
                className="space-y-4"
              >
                {mode === "register" && (
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.16em] font-sans-clean font-semibold text-[#52483E] mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Clara Montague"
                        required
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D8CEBF] text-xs font-sans-clean text-[#191411] placeholder:text-[#B5AAA0] focus:outline-none focus:border-[#9A7B4F] transition-colors"
                      />
                      <User className="w-4 h-4 text-[#9A8F82] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] font-sans-clean font-semibold text-[#52483E] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="clara.montague@atelier.com"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D8CEBF] text-xs font-sans-clean text-[#191411] placeholder:text-[#B5AAA0] focus:outline-none focus:border-[#9A7B4F] transition-colors"
                    />
                    <Mail className="w-4 h-4 text-[#9A8F82] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] uppercase tracking-[0.16em] font-sans-clean font-semibold text-[#52483E]">
                      Password
                    </label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => setIsForgotModalOpen(true)}
                        className="text-[11px] text-[#9A7B4F] hover:text-[#7A6038] transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#D8CEBF] text-xs font-sans-clean text-[#191411] placeholder:text-[#B5AAA0] focus:outline-none focus:border-[#9A7B4F] transition-colors"
                    />
                    <Lock className="w-4 h-4 text-[#9A8F82] absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8377] hover:text-[#191411] cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Extra Options */}
                {mode === "signin" ? (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#52483E] font-sans-clean select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[#9A7B4F]"
                      />
                      <span>Keep me signed in on this device</span>
                    </label>
                  </div>
                ) : (
                  <div className="pt-1">
                    <label className="flex items-start gap-2 cursor-pointer text-[11px] text-[#63574B] font-sans-clean select-none leading-tight">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-3.5 h-3.5 accent-[#9A7B4F] mt-0.5"
                      />
                      <span>
                        I wish to receive private invitations to seasonal salons, secret allocations, and bespoke atelier news.
                      </span>
                    </label>
                  </div>
                )}

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 py-3 bg-[#191411] hover:bg-[#9A7B4F] text-[#F9F6F0] text-xs uppercase tracking-[0.2em] font-sans-clean font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {mode === "signin"
                          ? "Sign In to Atelier"
                          : "Join VELORA Privé"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Atelier Security Assurance */}
              <div className="pt-2 text-center text-[10px] text-[#8E8377] font-sans-clean leading-relaxed">
                By entering the atelier portal, you confirm acceptance of our{" "}
                <Link href="/about" className="underline hover:text-[#191411]">
                  Privacy Charter
                </Link>{" "}
                &amp;{" "}
                <Link href="/about" className="underline hover:text-[#191411]">
                  Atelier Terms
                </Link>
                . Secured with 256-bit encrypted authentication.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Forgot Password Sheet / Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] border border-[#E8E1D5] max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 rounded-full bg-[#C5A880]/15 text-[#9A7B4F] flex items-center justify-center mx-auto border border-[#C5A880]/30">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-2xl text-[#191411]">
                Reset Atelier Password
              </h3>
              <p className="text-xs text-[#7A6F62] font-sans-clean leading-relaxed">
                Provide your registered atelier email address and our concierge will dispatch confidential access restoration instructions.
              </p>
            </div>

            {forgotSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans-clean text-center rounded-sm space-y-1">
                <p className="font-semibold">Dispatch Confirmed</p>
                <p>Instructions have been transmitted to your inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] font-sans-clean font-semibold text-[#52483E] mb-1.5">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="client@atelier.com"
                    required
                    className="w-full px-3 py-2.5 bg-white border border-[#D8CEBF] text-xs font-sans-clean text-[#191411] focus:outline-none focus:border-[#9A7B4F]"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="flex-1 py-2.5 border border-[#D8CEBF] text-[#554C42] hover:bg-[#F5F1EB] text-xs uppercase tracking-[0.16em] font-sans-clean font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#191411] text-[#F9F6F0] hover:bg-[#9A7B4F] text-xs uppercase tracking-[0.16em] font-sans-clean font-semibold transition-colors cursor-pointer"
                  >
                    Send Instructions
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
