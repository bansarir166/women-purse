import type { Metadata, Viewport } from "next";
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
import { JsonLd } from "@/components/seo/JsonLd";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://velorapurse.com";

export const viewport: Viewport = {
  themeColor: "#191411",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VELORA | Luxury Women's Handbags & Italian Leather Purses",
    template: "%s | VELORA Atelier",
  },
  description:
    "Carry Your Confidence. Discover VELORA's sculpted, timeless women's luxury purses, handcrafted from full-grain Italian calfskin leather in Florence.",
  keywords: [
    "luxury handbags",
    "women's designer purses",
    "Italian leather bags",
    "handcrafted leather purses",
    "shoulder bags",
    "designer tote bags",
    "sculptural mini bags",
    "VELORA atelier",
    "quiet luxury handbags",
    "Florence artisan leather",
  ],
  authors: [{ name: "VELORA Atelier Milano & Firenze", url: SITE_URL }],
  creator: "VELORA",
  publisher: "VELORA Luxury Atelier",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "VELORA | Sculpted Luxury Women's Handbags & Purses",
    description:
      "Handcrafted from full-grain Italian leather in Florence. Architectural silhouettes designed for effortless elegance and lifetime longevity.",
    url: SITE_URL,
    siteName: "VELORA Luxury Atelier",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "VELORA Luxury Italian Leather Handbags & Purses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VELORA | Luxury Women's Handbags & Purses",
    description:
      "Sculpted Italian leather purses handcrafted in Florence, Italy. Timeless organic geometry meets modern luxury.",
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop"],
    creator: "@velora_atelier",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VELORA",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description: "Artisanal luxury women's handbags and purses handcrafted in Florence, Italy.",
  foundingLocation: {
    "@type": "Place",
    name: "Florence, Italy",
  },
  sameAs: [
    "https://instagram.com/velora_atelier",
    "https://pinterest.com/velora_atelier",
  ],
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "VELORA Luxury Atelier",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
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
      <head>
        <JsonLd data={ORGANIZATION_SCHEMA} />
        <JsonLd data={WEBSITE_SCHEMA} />
      </head>
      <body className="font-sans-clean bg-[#FBF9F5] text-[#191411] antialiased selection:bg-[#C5A880] selection:text-white flex flex-col min-h-screen">
        <GoogleAnalytics />
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
