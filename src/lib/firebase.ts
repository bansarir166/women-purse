import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics, logEvent } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC86PZyYz0H6g8usIogw4rn_p9sDive1WE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "purse-da572.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "purse-da572",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "purse-da572.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "412666532894",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:412666532894:web:251ffa022eba1789478a0f",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-QRL9GLVVH4",
};

// Initialize Firebase (singleton pattern safe for Next.js SSR & HMR)
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let analyticsInstance: Analytics | null = null;
let initPromise: Promise<Analytics | null> | null = null;

/**
 * Initializes Firebase Analytics safely on the client side.
 * Returns null during SSR or if analytics is unsupported in the current browser.
 */
export const initFirebaseAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === "undefined") return null;
  if (analyticsInstance) return analyticsInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const supported = await isSupported();
      if (supported) {
        analyticsInstance = getAnalytics(app);
        return analyticsInstance;
      }
    } catch (err) {
      console.warn("[Firebase Analytics] Initialization skipped or unsupported:", err);
    }
    return null;
  })();

  return initPromise;
};

/**
 * Log a custom or e-commerce event to both Firebase Analytics & Google Analytics gtag
 */
export const logAnalyticsEvent = async (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  if (typeof window === "undefined") return;

  // 1. Log to Firebase Analytics if available
  try {
    const analytics = await initFirebaseAnalytics();
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  } catch (err) {
    console.debug("[Analytics] Firebase logEvent error:", err);
  }

  // 2. Also forward to window.gtag if present
  try {
    const customWindow = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof customWindow.gtag === "function") {
      customWindow.gtag("event", eventName, eventParams);
    }
  } catch (err) {
    console.debug("[Analytics] gtag event error:", err);
  }
};
