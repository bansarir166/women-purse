import { NextResponse } from "next/server";
import { getServerStripe } from "@/lib/stripe";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const stripe = getServerStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe) {
    return NextResponse.json(
      { message: "Stripe not configured on server." },
      { status: 200 }
    );
  }

  const signature = req.headers.get("stripe-signature");

  let event: import("stripe").Stripe.Event;

  try {
    const rawBody = await req.text();

    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } else {
      // In development without webhook secret, parse raw payload directly
      event = JSON.parse(rawBody);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed.";
    console.error(`[Stripe Webhook Error]: ${message}`);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Handle specific Stripe events
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as import("stripe").Stripe.PaymentIntent;
      console.log(`[Stripe Webhook] PaymentIntent succeeded: ${paymentIntent.id}, Amount: $${(paymentIntent.amount / 100).toFixed(2)}`);

      // Optionally dispatch notification email via nodemailer if configured
      const recipientEmail = process.env.NOTIFICATION_EMAIL || "bansarir166@gmail.com";
      const emailUser = process.env.EMAIL_USER;
      const emailPass = process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASS;

      if (emailUser && emailPass) {
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: emailUser, pass: emailPass },
          });

          await transporter.sendMail({
            from: `"VELORA Atelier Gateway" <${emailUser}>`,
            to: recipientEmail,
            subject: `💳 Payment Captured: $${(paymentIntent.amount / 100).toFixed(2)} USD (#${paymentIntent.metadata?.orderId || paymentIntent.id})`,
            text: `Payment Confirmed!\n\nOrder ID: ${paymentIntent.metadata?.orderId || "N/A"}\nCustomer: ${paymentIntent.metadata?.customerName || "Collector"} (${paymentIntent.receipt_email || paymentIntent.metadata?.customerEmail || "N/A"})\nAmount: $${(paymentIntent.amount / 100).toFixed(2)} USD\nStripe ID: ${paymentIntent.id}`,
          });
        } catch (mailErr) {
          console.error("[Stripe Webhook Mail Error]:", mailErr);
        }
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const failedIntent = event.data.object as import("stripe").Stripe.PaymentIntent;
      console.warn(`[Stripe Webhook] Payment failed for intent: ${failedIntent.id}, Reason: ${failedIntent.last_payment_error?.message}`);
      break;
    }

    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
