import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Dossier & Atelier Ledger",
  description: "View past allocations, tracked courier deliveries, and membership privileges.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
