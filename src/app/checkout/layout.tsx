import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure White-Glove Checkout",
  description:
    "Complete your VELORA allocation with encrypted Stripe authorization and insured courier dispatch from our Florence atelier.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
