"use client";

import React, { useEffect, Suspense } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { firebaseConfig, initFirebaseAnalytics, logAnalyticsEvent } from "@/lib/firebase";

const MEASUREMENT_ID = firebaseConfig.measurementId;

function AnalyticsRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize Firebase Analytics on client
    initFirebaseAnalytics();
  }, []);

  useEffect(() => {
    if (!pathname || typeof window === "undefined") return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    // Track dynamic route changes in Google Analytics (gtag)
    const customWindow = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof customWindow.gtag === "function") {
      customWindow.gtag("config", MEASUREMENT_ID, {
        page_path: url,
      });
    }

    // Track dynamic route changes in Firebase Analytics
    logAnalyticsEvent("page_view", {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  if (!MEASUREMENT_ID) return null;

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics 4 */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: false
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <AnalyticsRouteTracker />
      </Suspense>
    </>
  );
}
