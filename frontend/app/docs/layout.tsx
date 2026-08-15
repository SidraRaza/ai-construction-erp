import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-construction-erp-eight.vercel.app";

export const metadata: Metadata = {
  title: "Documentation & User Manual — AI Construction ERP",
  description:
    "Complete user and developer documentation for AI Construction ERP. Step-by-step guides for Company Admins, Site Engineers, Clients, and Super Admins, plus full REST API reference.",
  openGraph: {
    title: "Documentation & User Manual — AI Construction ERP",
    description:
      "Complete user and developer documentation for AI Construction ERP. Step-by-step guides for Company Admins, Site Engineers, Clients, and Super Admins.",
    images: [
      {
        url: `${SITE_URL}/logo-512px.png`,
        width: 512,
        height: 512,
        type: "image/png",
        alt: "Documentation - AI Construction ERP Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Documentation & User Manual — AI Construction ERP",
    description:
      "Complete user and developer documentation for AI Construction ERP. Step-by-step guides for Company Admins, Site Engineers, Clients, and Super Admins.",
    images: [`${SITE_URL}/logo-512px.png`],
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
