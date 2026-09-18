import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { ProductDetailClient } from "./ProductDetailClient";
import { JsonLd } from "@/components/seo/JsonLd";

interface PageProps {
  params: Promise<{ id: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://velorapurse.com";

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return { title: "Product Not Found | VELORA" };

  const productUrl = `${SITE_URL}/product/${product.id}`;

  return {
    title: `${product.name} — ${product.subtitle}`,
    description: product.description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} | VELORA Italian Leather Atelier`,
      description: product.description,
      url: productUrl,
      type: "article",
      images: product.images.map((img) => ({
        url: img,
        width: 1200,
        height: 1200,
        alt: `${product.name} handcrafted by VELORA`,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | VELORA`,
      description: product.description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  // Schema.org Product Rich Snippet
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.id,
    mpn: `VEL-${product.id}`,
    brand: {
      "@type": "Brand",
      name: "VELORA",
    },
    material: product.materials,
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.id}`,
      priceCurrency: "USD",
      price: product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "VELORA Luxury Atelier",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
      bestRating: "5",
      worstRating: "1",
    },
  };

  // Schema.org Breadcrumbs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: `${SITE_URL}/shop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category,
        item: `${SITE_URL}/shop?category=${encodeURIComponent(product.category)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `${SITE_URL}/product/${product.id}`,
      },
    ],
  };

  // Related products from same category or flagship
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.isSignature)
  ).slice(0, 4);

  return (
    <>
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
