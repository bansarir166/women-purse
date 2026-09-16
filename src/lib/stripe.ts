import { loadStripe, Stripe as StripeClient } from "@stripe/stripe-js";
import Stripe from "stripe";

// Client-side Stripe instance memoizer
let stripePromise: Promise<StripeClient | null> | null = null;

export const getStripe = (): Promise<StripeClient | null> => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey || publishableKey.includes("your_publishable_key")) {
    return Promise.resolve(null);
  }

  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};

// Server-side Stripe instance helper
export const getServerStripe = (): Stripe | null => {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey || secretKey.includes("your_secret_key")) {
    return null;
  }

  return new Stripe(secretKey, {
    apiVersion: "2026-08-26.dahlia",
    typescript: true,
  });
};

// VELORA Luxury Atelier Theme for Stripe Elements
export const VELORA_STRIPE_APPEARANCE: import("@stripe/stripe-js").Appearance = {
  theme: "flat",
  variables: {
    colorPrimary: "#9A7B4F",
    colorBackground: "#FFFFFF",
    colorText: "#191411",
    colorDanger: "#A33B3B",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    spacingUnit: "4px",
    borderRadius: "2px",
    focusBoxShadow: "0 0 0 1.5px #9A7B4F",
  },
  rules: {
    ".Input": {
      border: "1px solid #D8CEBF",
      backgroundColor: "#FFFFFF",
      padding: "12px 14px",
      fontSize: "13px",
      color: "#191411",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    },
    ".Input:focus": {
      borderColor: "#9A7B4F",
      boxShadow: "0 0 0 1.5px #9A7B4F",
    },
    ".Input--invalid": {
      borderColor: "#A33B3B",
    },
    ".Label": {
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: "#7A6F62",
      fontWeight: "500",
      marginBottom: "6px",
    },
    ".Tab": {
      border: "1px solid #EAE3D9",
      backgroundColor: "#FAF8F5",
      color: "#7A6F62",
      borderRadius: "2px",
    },
    ".Tab--selected": {
      borderColor: "#191411",
      backgroundColor: "#FFFFFF",
      color: "#191411",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    },
    ".Tab:focus": {
      borderColor: "#9A7B4F",
    },
  },
};
