import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artisanal Heritage & Craftsmanship | Atelier Milano & Firenze",
  description:
    "Learn the story of VELORA. Discover our Florentine leathercraft traditions, sustainable full-grain provenance, and architectural approach to modern women's accessories.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Atelier Heritage & Craftsmanship | VELORA",
    description:
      "Sculpted Italian leather handbags crafted with meticulous care in Florence, Italy. The philosophy of restraint.",
    url: "/about",
    type: "article",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
