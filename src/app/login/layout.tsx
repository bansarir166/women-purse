import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atelier Client Portal & Privilege Sign In",
  description: "Sign in to your VELORA Atelier Dossier for saved addresses, order tracking, and private allocations.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
