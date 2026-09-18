import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Private Wishlist & Curated Allocations",
  description: "View and manage your saved Italian leather handbags and luxury accessories.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
