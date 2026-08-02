import type { Metadata } from "next";

const SITE_URL = "https://ai-construction-erp-eight.vercel.app";

export const metadata: Metadata = {
  title: "About Us & Leadership — Sidra Raza Architect",
  description:
    "Learn about Sidra Raza (Founder & Lead Architect) and the architectural vision behind AI Construction ERP. Reimagining construction site operations with multi-tenant data isolation and dynamic production fields.",
  openGraph: {
    title: "About Us — Sidra Raza Founder & Architect",
    description: "Architectural vision behind AI Construction ERP platform.",
    images: [
      {
        url: `${SITE_URL}/logo-512px.png`,
        width: 512,
        height: 512,
        type: "image/png",
        alt: "About Us - AI Construction ERP Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us — Sidra Raza Founder & Architect",
    description: "Architectural vision behind AI Construction ERP platform.",
    images: [`${SITE_URL}/logo-512px.png`],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
