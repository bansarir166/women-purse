import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { EditorialSection } from "@/components/home/EditorialSection";
import { SignatureShowcase } from "@/components/home/SignatureShowcase";
import { CraftsmanshipSection } from "@/components/home/CraftsmanshipSection";
import { BestSellersGrid } from "@/components/home/BestSellersGrid";
import { CampaignBanner } from "@/components/home/CampaignBanner";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { SocialGallery } from "@/components/home/SocialGallery";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata = {
  title: "VELORA | Luxury Women's Handbags & Purses",
  description:
    "Carry Your Confidence. Discover VELORA's sculpted, timeless women's luxury purses, crafted from full-grain Italian leather in Florence.",
};

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* 3. Hero Section */}
      <HeroSection />

      {/* 4. Featured Collection (Flagship 4) */}
      <FeaturedCollection />

      {/* 5. Editorial Fashion Section */}
      <EditorialSection />

      {/* 6. Signature Collection Showcase */}
      <SignatureShowcase />

      {/* 7. Craftsmanship Section */}
      <CraftsmanshipSection />

      {/* 8. Best Sellers with Filtering & Sorting */}
      <BestSellersGrid />

      {/* 9. Luxury Campaign Banner */}
      <CampaignBanner />

      {/* 10. Customer Reviews & Press Quotes */}
      <CustomerReviews />

      {/* 11. Instagram / Social Gallery */}
      <SocialGallery />

      {/* 12. Newsletter Subscription */}
      <NewsletterSection />
    </main>
  );
}
