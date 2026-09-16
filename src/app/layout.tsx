import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { UIProvider } from "@/context/UIContext";
import { AuthProvider } from "@/context/AuthContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { SearchModal } from "@/components/search/SearchModal";
import { Toast } from "@/components/layout/Toast";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VELORA | Luxury Women's Handbags & Purses",
  description:
    "Carry Your Confidence. Discover VELORA's sculpted, timeless women's luxury purses, crafted from full-grain Italian leather in Florence.",
  keywords: [
    "luxury handbags",
    "women's purses",
    "Italian leather bags",
    "VELORA atelier",
    "designer tote bags",
    "shoulder bags",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} ${playfair.variable} scroll-smooth`}
    >
      <body className="font-sans-clean bg-[#FBF9F5] text-[#191411] antialiased selection:bg-[#C5A880] selection:text-white flex flex-col min-h-screen">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <UIProvider>
                <AnnouncementBar />
                <Navbar />
                <div className="flex-1">{children}</div>
                <Footer />
                <CartDrawer />
                <QuickViewModal />
                <SearchModal />
                <Toast />
              </UIProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
