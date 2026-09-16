"use client";

import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Lock, AlertCircle, Loader2 } from "lucide-react";

interface StripePaymentElementProps {
  amount: number;
  billingDetails: {
    name: string;
    email: string;
    address: {
      line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  onSuccess: (paymentIntentId: string) => void;
  onError: (errorMsg: string) => void;
  isProcessing: boolean;
  setIsProcessing: (loading: boolean) => void;
}

export default function StripePaymentElement({
  amount,
  billingDetails,
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing,
}: StripePaymentElementProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [elementError, setElementError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setElementError("Stripe payment service is initializing. Please wait a moment.");
      return;
    }

    setIsProcessing(true);
    setElementError(null);

    try {
      // 1. Validate fields inside Elements
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setElementError(submitError.message || "Please verify your card details.");
        setIsProcessing(false);
        onError(submitError.message || "Payment form validation failed.");
        return;
      }

      // 2. Confirm Payment with Stripe
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout?payment_success=true`,
          payment_method_data: {
            billing_details: {
              name: billingDetails.name || "Valued Collector",
              email: billingDetails.email || undefined,
              address: {
                line1: billingDetails.address.line1,
                city: billingDetails.address.city,
                state: billingDetails.address.state,
                postal_code: billingDetails.address.postal_code,
                country: billingDetails.address.country === "United States" ? "US" : "US",
              },
            },
          },
        },
        redirect: "if_required",
      });

      if (result.error) {
        const message = result.error.message || "Your payment could not be processed. Please try again.";
        setElementError(message);
        setIsProcessing(false);
        onError(message);
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        // Payment succeeded directly without redirect!
        onSuccess(result.paymentIntent.id);
      } else if (result.paymentIntent && result.paymentIntent.status === "processing") {
        // Asynchronous payment processing
        onSuccess(result.paymentIntent.id);
      } else {
        // Redirect handled by Stripe (e.g. 3D Secure challenge)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected payment error occurred.";
      setElementError(msg);
      setIsProcessing(false);
      onError(msg);
    }
  };

  return (
    <div className="space-y-4">
      {/* Stripe Payment Element with loading placeholder */}
      <div className="relative min-h-[180px]">
        {!isReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF8F5] border border-[#EAE3D9] p-6 text-center z-10">
            <Loader2 className="w-5 h-5 text-[#9A7B4F] animate-spin mb-2" />
            <p className="text-xs font-sans-clean text-[#7A6F62]">
              Establishing secure encrypted session with Stripe...
            </p>
          </div>
        )}

        <div className={isReady ? "opacity-100 transition-opacity duration-300" : "opacity-0"}>
          <PaymentElement
            onReady={() => setIsReady(true)}
            options={{
              layout: "tabs",
              defaultValues: {
                billingDetails: {
                  name: billingDetails.name,
                  email: billingDetails.email,
                  address: {
                    line1: billingDetails.address.line1,
                    city: billingDetails.address.city,
                    state: billingDetails.address.state,
                    postal_code: billingDetails.address.postal_code,
                    country: "US",
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {elementError && (
        <div className="p-3 bg-[#FDF2F2] border border-[#F5C2C2] flex items-start gap-2.5 text-xs text-[#9B2C2C] font-sans-clean">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#C53030]" />
          <span>{elementError}</span>
        </div>
      )}

      {/* Security note */}
      <div className="flex items-center justify-between text-[11px] text-[#7A6F62] font-sans-clean pt-2 border-t border-[#EAE3D9]">
        <div className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-[#9A7B4F]" />
          <span>Stripe End-to-End PCI DSS Level 1 Certified</span>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-[#9A7B4F] font-semibold">
          SSL Protected
        </span>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleSubmitPayment}
        disabled={isProcessing || !stripe || !isReady}
        className="w-full bg-[#191411] hover:bg-[#382E26] text-[#FAF8F5] py-4 text-xs uppercase tracking-[0.22em] font-sans-clean font-semibold transition-all shadow-xl disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-[#C5A880]" />
            <span>Authorizing with Stripe...</span>
          </>
        ) : (
          <span>Authorize &amp; Pay ${amount} USD</span>
        )}
      </button>
    </div>
  );
}
