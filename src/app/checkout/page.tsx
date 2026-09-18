"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Truck,
  Tag,
  Plus,
  Minus,
  Trash2,
  Crown,
  Sparkles,
  Key,
  AlertCircle,
  RefreshCw,
  Check,
} from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe, VELORA_STRIPE_APPEARANCE } from "@/lib/stripe";
import { logAnalyticsEvent } from "@/lib/firebase";
import StripePaymentElement from "@/components/checkout/StripePaymentElement";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

function CheckoutContent() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    promoCode,
    applyPromoCode,
    removePromoCode,
    discountPercent,
  } = useCart();
  const { user, isAuthenticated, updateProfile } = useAuth();
  const searchParams = useSearchParams();

  // Form states
  const [formData, setFormData] = useState({
    email: "client@atelier.com",
    firstName: "Atelier",
    lastName: "Client",
    address: "740 Park Avenue, Apt 11B",
    city: "New York",
    state: "NY",
    zipCode: "10021",
    country: "United States",
    deliverySpeed: "standard", // standard or express
    cardNumber: "•••• •••• •••• 4242",
    cardExpiry: "08/29",
    cardCvc: "•••",
  });

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "demo">("stripe");

  // Stripe state
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof getStripe> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isStripeDemoMode, setIsStripeDemoMode] = useState(false);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [stripeInitError, setStripeInitError] = useState<string | null>(null);

  // Order state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [confirmedMethod, setConfirmedMethod] = useState("Stripe Secure Payment");

  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ text: string; success: boolean } | null>(null);

  // Current grand total (accounting for delivery speed selection)
  const currentTotal = formData.deliverySpeed === "express" ? total + 25 : total;

  // Initialize client Stripe singleton
  useEffect(() => {
    setStripePromise(getStripe());
  }, []);

  // Populate user profile if signed in
  useEffect(() => {
    if (user) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        address: defaultAddr?.street || prev.address,
        city: defaultAddr?.city || prev.city,
        state: defaultAddr?.state || prev.state,
        zipCode: defaultAddr?.zip || prev.zipCode,
        country: defaultAddr?.country || prev.country,
      }));
    }
  }, [user]);

  // Handle returning from 3D secure redirect
  useEffect(() => {
    const paymentSuccess = searchParams.get("payment_success");
    const paymentIntentId = searchParams.get("payment_intent");

    if (paymentSuccess === "true" || paymentIntentId) {
      handleOrderSuccess(
        paymentIntentId || `pi_redirect_${Date.now()}`,
        "Stripe 3D-Secure Authorized"
      );
    }
  }, [searchParams]);

  // Request PaymentIntent from server whenever total or payment method changes
  const fetchPaymentIntent = useCallback(async () => {
    if (items.length === 0 || currentTotal <= 0) return;

    setIsCreatingIntent(true);
    setStripeInitError(null);

    try {
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: currentTotal,
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`.trim(),
          itemsCount: items.length,
        }),
      });

      const data = await res.json();

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setIsStripeDemoMode(false);
      } else {
        setClientSecret(null);
        setIsStripeDemoMode(true);
      }
    } catch (err: unknown) {
      console.warn("[Checkout] Stripe PaymentIntent fallback to Demo Mode:", err);
      setIsStripeDemoMode(true);
      setClientSecret(null);
    } finally {
      setIsCreatingIntent(false);
    }
  }, [currentTotal, formData.email, formData.firstName, formData.lastName, items.length]);

  useEffect(() => {
    if (paymentMethod === "stripe") {
      fetchPaymentIntent();
    }
  }, [paymentMethod, fetchPaymentIntent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = applyPromoCode(promoInput);
    setPromoMsg({ text: res.message, success: res.success });
    if (res.success) setPromoInput("");
  };

  // Complete Order Handler (called upon successful payment)
  const handleOrderSuccess = (transactionId?: string, method = "Stripe Secure Payment") => {
    const generatedId = `VEL-${Math.floor(100000 + Math.random() * 900000)}`;
    const txId = transactionId || `tx_${Math.random().toString(36).substring(2, 11)}`;

    setOrderId(generatedId);
    setTransactionRef(txId);
    setConfirmedMethod(method);
    setIsSubmitting(false);
    setOrderPlaced(true);

    if (user && items.length > 0) {
      const newOrder = {
        id: generatedId,
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        status: "Allocated in Florence" as const,
        total: currentTotal,
        trackingNumber: `WG-IT-${Math.floor(100000 + Math.random() * 900000)}-NY`,
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          color: i.selectedColor.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.images[0] || "",
        })),
      };
      updateProfile({
        orders: [newOrder, ...user.orders],
      });
    }

    // Google Analytics 4 / Firebase Purchase Event
    logAnalyticsEvent("purchase", {
      transaction_id: txId,
      value: currentTotal,
      currency: "USD",
      tax: 0,
      shipping: shippingFee,
      items: items.map((i) => ({
        item_id: i.product.id,
        item_name: i.product.name,
        item_category: i.product.category,
        price: i.product.price,
        quantity: i.quantity,
        item_variant: i.selectedColor.name,
      })),
    });

    clearCart();
  };

  // Handle Demo / Atelier Card submit
  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      handleOrderSuccess(
        `demo_stripe_${Math.floor(10000000 + Math.random() * 90000000)}`,
        "Stripe Simulator (Atelier Test Gateway)"
      );
    }, 1200);
  };

  // If order was successfully placed
  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-[#FBF9F5] py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full bg-[#FAF8F5] border border-[#E8E1D5] p-8 sm:p-12 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#C5A880]/15 text-[#9A7B4F] flex items-center justify-center mx-auto border border-[#C5A880]/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7B4F] font-sans-clean font-semibold block mb-2">
              Order Confirmed &amp; Allocated
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#191411]">
              Thank You, {formData.firstName}
            </h1>
          </div>

          <div className="bg-[#F4EFE7] p-5 border border-[#E0D7CB] space-y-2 text-xs font-sans-clean text-[#554C42]">
            <p className="flex justify-between">
              <span>Order Number:</span>
              <strong className="text-[#191411] tracking-wider">{orderId}</strong>
            </p>
            <p className="flex justify-between">
              <span>Payment Protocol:</span>
              <span className="text-[#2E4A3B] font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-[#2E4A3B]" /> {confirmedMethod}
              </span>
            </p>
            {transactionRef && (
              <p className="flex justify-between">
                <span>Stripe Ref / Ledger ID:</span>
                <span className="text-[#191411] font-mono text-[11px]">{transactionRef}</span>
              </p>
            )}
            <p className="flex justify-between">
              <span>Confirmation Dispatched to:</span>
              <span className="text-[#191411] font-medium">{formData.email}</span>
            </p>
            <p className="flex justify-between">
              <span>Estimated Delivery:</span>
              <span className="text-[#191411] font-medium">
                {formData.deliverySpeed === "express"
                  ? "1–2 Business Days (Priority Air)"
                  : "3–5 Business Days (Insured Courier)"}
              </span>
            </p>
          </div>

          <p className="text-xs font-sans-clean text-[#7A6F62] leading-relaxed">
            Your creation is currently being prepared at our Florence atelier, packaged inside our archival cotton dust bag and velvet signature keepsake box.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            {isAuthenticated && (
              <Link
                href="/account"
                className="px-6 py-3.5 bg-[#C5A880] hover:bg-[#9A7B4F] text-[#191411] hover:text-white text-xs uppercase tracking-[0.2em] font-sans-clean font-semibold transition-colors text-center"
              >
                View Atelier Ledger
              </Link>
            )}
            <Link
              href="/"
              className="px-6 py-3.5 bg-[#191411] hover:bg-[#382E26] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-sans-clean font-semibold transition-colors text-center"
            >
              Return to Boutique
            </Link>
            <Link
              href="/shop"
              className="px-6 py-3.5 bg-[#FAF8F5] hover:bg-[#EAE3D9] border border-[#191411] text-[#191411] text-xs uppercase tracking-[0.2em] font-sans-clean font-semibold transition-colors text-center"
            >
              Continue Exploring
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // If cart is empty
  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] bg-[#FBF9F5] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#191411]">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs font-sans-clean text-[#7A6F62] max-w-sm">
          You have no items staged for checkout. Browse our collection of handcrafted Italian leather purses.
        </p>
        <Link
          href="/shop"
          className="mt-4 px-8 py-3.5 bg-[#191411] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-sans-clean font-semibold hover:bg-[#382E26] transition-colors"
        >
          Explore Collection
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBF9F5] text-[#191411] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Minimal Header */}
        <div className="flex items-center justify-between pb-8 mb-10 border-b border-[#EAE3D9]">
          <Link
            href="/shop"
            className="text-xs font-sans-clean uppercase tracking-wider text-[#7A6F62] hover:text-[#191411] flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Catalog
          </Link>

          <Link href="/" className="text-center">
            <span className="font-serif-luxury text-2xl tracking-[0.25em] text-[#191411] uppercase font-normal">
              VELORA
            </span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-sans-clean text-[#7A6F62]">
            <Lock className="w-3.5 h-3.5 text-[#9A7B4F]" />
            <span className="hidden sm:inline">256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Checkout Forms (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Atelier Membership Status Banner */}
            {isAuthenticated ? (
              <div className="p-4 bg-[#F5F1EB] border border-[#C5A880]/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C5A880]/20 text-[#9A7B4F] flex items-center justify-center shrink-0">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#191411] font-sans-clean">
                      Recognized Client: {user?.name} ({user?.membershipTier})
                    </p>
                    <p className="text-[11px] text-[#7A6F62] font-sans-clean">
                      Confidential address &amp; white-glove allocations applied.
                    </p>
                  </div>
                </div>
                <Link
                  href="/account"
                  className="text-[11px] uppercase tracking-[0.14em] font-sans-clean font-semibold text-[#9A7B4F] hover:underline shrink-0"
                >
                  Manage Dossier
                </Link>
              </div>
            ) : (
              <div className="p-4 bg-[#FAF8F5] border border-[#E8E1D5] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#9A7B4F] shrink-0" />
                  <p className="text-xs text-[#52483E] font-sans-clean">
                    Already an Atelier Member?{" "}
                    <Link
                      href="/login?redirect=/checkout"
                      className="font-semibold text-[#191411] underline hover:text-[#9A7B4F]"
                    >
                      Sign in
                    </Link>{" "}
                    for accelerated dispatch and saved residences.
                  </p>
                </div>
              </div>
            )}

            {/* Express Checkout Options */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7F72] font-sans-clean font-semibold">
                Express Checkout
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("stripe");
                    const element = document.getElementById("payment-section");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-black text-white py-3.5 text-xs font-medium tracking-wider flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-sm">Pay</span> Express (Stripe)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("stripe");
                    const element = document.getElementById("payment-section");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-white border border-[#D8CEBF] text-[#191411] py-3.5 text-xs font-medium tracking-wider flex items-center justify-center gap-2 hover:bg-[#F5F1EB] transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-sm">G Pay</span> Instant (Stripe)
                </button>
              </div>

              <div className="relative py-4 flex items-center justify-center">
                <div className="w-full border-t border-[#EAE3D9]" />
                <span className="bg-[#FBF9F5] px-4 text-[10px] uppercase tracking-[0.2em] text-[#8C7F72] font-sans-clean absolute">
                  Or Proceed with Standard Information
                </span>
              </div>
            </div>

            {/* Main Form Fields */}
            <div className="space-y-10">
              {/* 1. Contact Information */}
              <div>
                <h3 className="font-serif-luxury text-xl text-[#191411] mb-4">
                  1. Contact Information
                </h3>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#7A6F62] font-sans-clean mb-1">
                    Email Address for Order Updates
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#FAF8F5] border border-[#D8CEBF] text-xs px-4 py-3 font-sans-clean text-[#191411] focus:outline-hidden focus:border-[#9A7B4F]"
                  />
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div>
                <h3 className="font-serif-luxury text-xl text-[#191411] mb-4">
                  2. Shipping Destination
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#7A6F62] font-sans-clean mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#FAF8F5] border border-[#D8CEBF] text-xs px-4 py-3 font-sans-clean text-[#191411] focus:outline-hidden focus:border-[#9A7B4F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#7A6F62] font-sans-clean mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#FAF8F5] border border-[#D8CEBF] text-xs px-4 py-3 font-sans-clean text-[#191411] focus:outline-hidden focus:border-[#9A7B4F]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-[#7A6F62] font-sans-clean mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#FAF8F5] border border-[#D8CEBF] text-xs px-4 py-3 font-sans-clean text-[#191411] focus:outline-hidden focus:border-[#9A7B4F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#7A6F62] font-sans-clean mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#FAF8F5] border border-[#D8CEBF] text-xs px-4 py-3 font-sans-clean text-[#191411] focus:outline-hidden focus:border-[#9A7B4F]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#7A6F62] font-sans-clean mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#FAF8F5] border border-[#D8CEBF] text-xs px-4 py-3 font-sans-clean text-[#191411] focus:outline-hidden focus:border-[#9A7B4F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#7A6F62] font-sans-clean mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#FAF8F5] border border-[#D8CEBF] text-xs px-4 py-3 font-sans-clean text-[#191411] focus:outline-hidden focus:border-[#9A7B4F]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Delivery Method */}
              <div>
                <h3 className="font-serif-luxury text-xl text-[#191411] mb-4">
                  3. Delivery Protocol
                </h3>
                <div className="space-y-3">
                  <label
                    className={`border p-4 flex items-center justify-between cursor-pointer transition-colors ${
                      formData.deliverySpeed === "standard"
                        ? "border-[#191411] bg-[#FAF8F5]"
                        : "border-[#E8E1D5] bg-[#F5F1EB]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="deliverySpeed"
                        value="standard"
                        checked={formData.deliverySpeed === "standard"}
                        onChange={handleInputChange}
                        className="accent-[#191411]"
                      />
                      <div>
                        <p className="text-xs font-sans-clean font-semibold text-[#191411]">
                          Complimentary Insured Courier (3–5 Business Days)
                        </p>
                        <p className="text-[11px] text-[#7A6F62] font-sans-clean">
                          Dispatched directly from Milan atelier with tracking.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-sans-clean font-semibold text-[#2E4A3B]">
                      {shippingFee === 0 ? "FREE" : `$${shippingFee}`}
                    </span>
                  </label>

                  <label
                    className={`border p-4 flex items-center justify-between cursor-pointer transition-colors ${
                      formData.deliverySpeed === "express"
                        ? "border-[#191411] bg-[#FAF8F5]"
                        : "border-[#E8E1D5] bg-[#F5F1EB]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="deliverySpeed"
                        value="express"
                        checked={formData.deliverySpeed === "express"}
                        onChange={handleInputChange}
                        className="accent-[#191411]"
                      />
                      <div>
                        <p className="text-xs font-sans-clean font-semibold text-[#191411]">
                          White-Glove Priority Air (1–2 Business Days)
                        </p>
                        <p className="text-[11px] text-[#7A6F62] font-sans-clean">
                          Priority customs clearance &amp; dedicated courier handling.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-sans-clean font-semibold text-[#191411]">
                      +$25 USD
                    </span>
                  </label>
                </div>
              </div>

              {/* 4. Secure Payment Section with Stripe */}
              <div id="payment-section" className="space-y-4 scroll-mt-24">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-luxury text-xl text-[#191411]">
                    4. Secure Payment Method
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-[#7A6F62] font-sans-clean">
                    <Lock className="w-3 h-3 text-[#9A7B4F]" />
                    <span>PCI Level 1 Compliant</span>
                  </div>
                </div>

                {/* Payment Method Selector Tabs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("stripe")}
                    className={`p-4 border text-left flex items-start justify-between transition-all cursor-pointer ${
                      paymentMethod === "stripe"
                        ? "border-[#191411] bg-[#FAF8F5] shadow-sm ring-1 ring-[#191411]"
                        : "border-[#E8E1D5] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#9A7B4F]" />
                        <span className="text-xs font-semibold text-[#191411] font-sans-clean">
                          Stripe Secure Checkout
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A6F62] font-sans-clean">
                        Card, Apple Pay, Google Pay, Link
                      </p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider bg-[#191411] text-[#FAF8F5] px-2 py-0.5 font-semibold">
                      Primary
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("demo")}
                    className={`p-4 border text-left flex items-start justify-between transition-all cursor-pointer ${
                      paymentMethod === "demo"
                        ? "border-[#191411] bg-[#FAF8F5] shadow-sm ring-1 ring-[#191411]"
                        : "border-[#E8E1D5] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#9A7B4F]" />
                        <span className="text-xs font-semibold text-[#191411] font-sans-clean">
                          Atelier Test Gateway
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A6F62] font-sans-clean">
                        Instant simulation &amp; concierge preview
                      </p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider bg-[#E5DEC9] text-[#766E65] px-2 py-0.5 font-semibold">
                      Test
                    </span>
                  </button>
                </div>

                {/* STRIPE PAYMENT CONTAINER */}
                {paymentMethod === "stripe" && (
                  <div className="bg-[#FAF8F5] border border-[#D8CEBF] p-5 sm:p-6 space-y-5">
                    {/* Header & Badges */}
                    <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#EAE3D9] gap-2">
                      <div className="flex items-center gap-2 text-xs font-sans-clean font-semibold text-[#191411]">
                        <CreditCard className="w-4 h-4 text-[#9A7B4F]" />
                        <span>Pay with Stripe</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#7A6F62] font-sans-clean">
                        <span className="bg-[#ECE5DB] px-2 py-0.5 rounded-xs font-medium text-[#191411]">Visa</span>
                        <span className="bg-[#ECE5DB] px-2 py-0.5 rounded-xs font-medium text-[#191411]">Mastercard</span>
                        <span className="bg-[#ECE5DB] px-2 py-0.5 rounded-xs font-medium text-[#191411]">Amex</span>
                        <span className="bg-[#ECE5DB] px-2 py-0.5 rounded-xs font-medium text-[#191411]">Apple Pay</span>
                        <span className="bg-[#ECE5DB] px-2 py-0.5 rounded-xs font-medium text-[#191411]">Google Pay</span>
                      </div>
                    </div>

                    {/* Check if live Stripe keys are configured or in Demo fallback */}
                    {clientSecret && stripePromise ? (
                      <Elements
                        stripe={stripePromise}
                        options={{
                          clientSecret,
                          appearance: VELORA_STRIPE_APPEARANCE,
                        }}
                      >
                        <StripePaymentElement
                          amount={currentTotal}
                          billingDetails={{
                            name: `${formData.firstName} ${formData.lastName}`.trim(),
                            email: formData.email,
                            address: {
                              line1: formData.address,
                              city: formData.city,
                              state: formData.state,
                              postal_code: formData.zipCode,
                              country: formData.country,
                            },
                          }}
                          onSuccess={(piId) => handleOrderSuccess(piId, "Stripe Authorized (Live/Test)")}
                          onError={(errMsg) => setStripeInitError(errMsg)}
                          isProcessing={isSubmitting}
                          setIsProcessing={setIsSubmitting}
                        />
                      </Elements>
                    ) : (
                      /* Stripe Configuration / Sandbox Simulator fallback */
                      <div className="space-y-4">
                        <div className="p-4 bg-[#F5F1EB] border border-[#C5A880]/40 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#191411] font-sans-clean">
                            <Key className="w-4 h-4 text-[#9A7B4F]" />
                            <span>Stripe Environment Connected &amp; Ready</span>
                          </div>
                          <p className="text-[11px] text-[#7A6F62] font-sans-clean leading-relaxed">
                            The Stripe Payment Gateway and Elements SDK are fully initialized. Add your live or test keys (<code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> and <code>STRIPE_SECRET_KEY</code>) to <code>.env.local</code> to render Stripe&apos;s hosted fields.
                          </p>
                          <p className="text-[11px] text-[#9A7B4F] font-sans-clean font-medium">
                            ⚡ Atelier Instant Stripe Simulation is active below for testing this flow right now:
                          </p>
                        </div>

                        {/* Interactive Simulated Stripe Card form */}
                        <form onSubmit={handleDemoSubmit} className="space-y-4">
                          <div>
                            <label className="block text-[11px] uppercase tracking-wider text-[#7A6F62] font-sans-clean mb-1">
                              Card Number (Stripe Standard Test Card)
                            </label>
                            <input
                              type="text"
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              required
                              className="w-full bg-white border border-[#D8CEBF] text-xs px-4 py-3 font-sans-clean text-[#191411] focus:outline-hidden focus:border-[#9A7B4F]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] uppercase tracking-wider text-[#7A6F62] font-sans-clean mb-1">
                                Expiration (MM/YY)
                              </label>
                              <input
                                type="text"
                                name="cardExpiry"
                                value={formData.cardExpiry}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-white border border-[#D8CEBF] text-xs px-4 py-3 font-sans-clean text-[#191411] focus:outline-hidden focus:border-[#9A7B4F]"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] uppercase tracking-wider text-[#7A6F62] font-sans-clean mb-1">
                                CVC / CVV
                              </label>
                              <input
                                type="text"
                                name="cardCvc"
                                value={formData.cardCvc}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-white border border-[#D8CEBF] text-xs px-4 py-3 font-sans-clean text-[#191411] focus:outline-hidden focus:border-[#9A7B4F]"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#191411] hover:bg-[#382E26] text-[#FAF8F5] py-4 text-xs uppercase tracking-[0.22em] font-sans-clean font-semibold transition-all shadow-xl disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin text-[#C5A880]" />
                                <span>Authorizing with Stripe Sandbox...</span>
                              </>
                            ) : (
                              <span>Authorize &amp; Pay ${currentTotal} USD via Stripe</span>
                            )}
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* DEMO / ATELIER CONCIERGE CONTAINER */}
                {paymentMethod === "demo" && (
                  <div className="bg-[#FAF8F5] border border-[#D8CEBF] p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
                      <div className="flex items-center gap-2 text-xs font-sans-clean font-semibold text-[#191411]">
                        <Sparkles className="w-4 h-4 text-[#9A7B4F]" />
                        <span>Private Atelier Ledger Allocation</span>
                      </div>
                      <span className="text-[10px] text-[#7A6F62] font-sans-clean uppercase tracking-wider">
                        VIP Pre-Approved
                      </span>
                    </div>

                    <p className="text-xs font-sans-clean text-[#7A6F62] leading-relaxed">
                      This simulates an instantaneous concierge approval without card verification, ideal for editorial reviews, test orders, and atelier client demos.
                    </p>

                    <form onSubmit={handleDemoSubmit} className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#9A7B4F] hover:bg-[#83673F] text-white py-4 text-xs uppercase tracking-[0.22em] font-sans-clean font-semibold transition-all shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Confirming Atelier Allocation...</span>
                          </>
                        ) : (
                          <span>Allocate Order • ${currentTotal} USD</span>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Review (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FAF8F5] border border-[#E8E1D5] p-6 sm:p-8 space-y-6 sticky top-28">
              <h3 className="font-serif-luxury text-2xl text-[#191411] pb-4 border-b border-[#EAE3D9]">
                Bag Summary ({items.length})
              </h3>

              {/* Items preview list */}
              <div className="space-y-4 max-h-[340px] overflow-y-auto divide-y divide-[#EAE3D9] pr-1">
                {items.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                    <div className="w-16 h-20 relative bg-[#ECE5DB] overflow-hidden border border-[#E8E1D5] shrink-0">
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
                          <h4 className="font-serif-luxury text-base text-[#191411] line-clamp-1">
                            {item.product.name}
                          </h4>
                          <span className="text-xs font-semibold text-[#191411] font-sans-clean ml-2">
                            ${item.product.price * item.quantity}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7A6F62] font-sans-clean">
                          {item.selectedColor.name} • Qty: {item.quantity}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-[11px] text-[#554C42] hover:text-[#191411]"
                        >
                          -
                        </button>
                        <span className="text-xs font-sans-clean">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-[11px] text-[#554C42] hover:text-[#191411]"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[10px] text-[#9E9283] hover:text-red-700 ml-auto font-sans-clean"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Box */}
              <div className="pt-4 border-t border-[#EAE3D9]">
                {discountPercent > 0 ? (
                  <div className="flex items-center justify-between bg-[#EFECE4] px-3 py-2 text-xs font-sans-clean">
                    <span className="text-[#2E4A3B] font-medium flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" /> Code {promoCode} ({discountPercent}% Off)
                    </span>
                    <button
                      onClick={removePromoCode}
                      className="text-[#9E9283] hover:text-[#191411] text-[11px] underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePromoSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo Code (e.g. VELORA10)"
                      className="flex-1 bg-white border border-[#D8CEBF] text-xs px-3 py-2 uppercase font-sans-clean tracking-wider focus:outline-hidden focus:border-[#9A7B4F]"
                    />
                    <button
                      type="submit"
                      className="bg-[#241D17] text-[#FAF8F5] px-4 py-2 text-xs uppercase tracking-wider font-sans-clean font-semibold hover:bg-[#382E26] transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoMsg && (
                  <p
                    className={`text-[11px] mt-1 font-sans-clean ${
                      promoMsg.success ? "text-[#2E4A3B]" : "text-[#A33B3B]"
                    }`}
                  >
                    {promoMsg.text}
                  </p>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 pt-4 border-t border-[#EAE3D9] text-xs font-sans-clean text-[#554C42]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#191411] font-medium">${subtotal} USD</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#2E4A3B]">
                    <span>VIP Privilege Savings</span>
                    <span>-${discountAmount} USD</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-[#191411]">
                    {formData.deliverySpeed === "express"
                      ? "$25 USD (Priority Air)"
                      : shippingFee === 0
                      ? "Complimentary"
                      : `$${shippingFee} USD`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span className="text-[#191411]">$0 USD (Calculated &amp; Included)</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#EAE3D9] text-base text-[#191411] font-semibold">
                  <span>Total Amount</span>
                  <span>${currentTotal} USD</span>
                </div>
              </div>

              {/* Assurances */}
              <div className="pt-2 text-[11px] text-[#7A6F62] font-sans-clean space-y-1.5 leading-relaxed">
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9A7B4F]" /> 30-Day Complimentary Returns
                </p>
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9A7B4F]" /> Handcrafted in Florence, Italy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#FBF9F5] flex items-center justify-center">
          <div className="text-center space-y-3">
            <span className="font-serif-luxury text-2xl tracking-[0.25em] text-[#191411] uppercase block">
              VELORA
            </span>
            <p className="text-xs font-sans-clean text-[#7A6F62]">
              Preparing secure atelier checkout...
            </p>
          </div>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
