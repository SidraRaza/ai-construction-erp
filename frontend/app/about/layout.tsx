import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us & Leadership — Sidra Raza Architect",
  description:
    "Learn about Sidra Raza (Founder & Lead Architect) and the architectural vision behind AI Construction ERP. Reimagining construction site operations with multi-tenant data isolation and dynamic production fields.",
  openGraph: {
    title: "About Us — Sidra Raza Founder & Architect",
    description: "Architectural vision behind AI Construction ERP platform.",
    images: ["/logo-512px.png"],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
