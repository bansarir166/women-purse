import { NextResponse } from "next/server";
import { getServerStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, customerEmail, customerName, itemsCount, orderId } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid order amount. Amount must be greater than zero." },
        { status: 400 }
      );
    }

    // Amount in cents (e.g. $450.00 -> 45000)
    const amountInCents = Math.round(amount * 100);

    // Minimum charge for Stripe is 50 cents
    if (amountInCents < 50) {
      return NextResponse.json(
        { error: "Order total must be at least $0.50 USD to process via Stripe." },
        { status: 400 }
      );
    }

    const stripe = getServerStripe();

    // Graceful fallback if Stripe secret key is not set or placeholder
    if (!stripe) {
      return NextResponse.json({
        clientSecret: null,
        isDemo: true,
        amount: amountInCents,
        currency: "usd",
        message:
          "Stripe keys are not configured in .env.local. Running in Atelier Simulation Mode.",
      });
    }

    // Create a real Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: customerEmail || undefined,
      description: `VELORA Luxury Atelier Order${orderId ? ` #${orderId}` : ""}`,
      metadata: {
        brand: "VELORA Luxury Atelier",
        orderId: orderId || `VEL-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName: customerName || "Private Collector",
        customerEmail: customerEmail || "",
        itemsCount: itemsCount ? itemsCount.toString() : "1",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      isDemo: false,
    });
  } catch (error: unknown) {
    console.error("[Stripe Create Payment Intent Error]:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to initialize Stripe PaymentIntent.";

    return NextResponse.json(
      {
        error: errorMessage,
        isDemo: true,
      },
      { status: 500 }
    );
  }
}
