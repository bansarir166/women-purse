import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Catalog & Bag Silhouettes",
  description:
    "Find your signature purse from our curated collection of Italian calfskin handbags, crossbody totes, and luxury evening clutches.",
  alternates: {
    canonical: "/search",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
