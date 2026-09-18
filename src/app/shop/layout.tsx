import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Handbags & Purses | Italian Leather Collection",
  description:
    "Explore VELORA's full collection of luxury Italian calfskin shoulder bags, spacious everyday totes, architectural clutches, and evening mini bags.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop Luxury Handbags & Purses | VELORA Atelier Collection",
    description:
      "Handcrafted in Florence from full-grain Italian leather. Discover our iconic shoulder bags, totes, and mini bags.",
    url: "/shop",
    type: "website",
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
