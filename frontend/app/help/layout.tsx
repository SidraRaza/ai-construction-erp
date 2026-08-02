import type { Metadata } from "next";

const SITE_URL = "https://ai-construction-erp.vercel.app";

export const metadata: Metadata = {
  title: "Help Center & Documentation",
  description:
    "Explore platform guides, Super Admin owner portal walkthroughs, QR attendance check-ins, custom production fields, and FAQs for AI Construction ERP.",
  openGraph: {
    title: "Help Center & Documentation — AI Construction ERP",
    description: "Search guides and FAQs for AI Construction ERP.",
    images: [
      {
        url: `${SITE_URL}/logo-512px.png`,
        width: 512,
        height: 512,
        type: "image/png",
        alt: "Help Center - AI Construction ERP Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Help Center & Documentation — AI Construction ERP",
    description: "Search guides and FAQs for AI Construction ERP.",
    images: [`${SITE_URL}/logo-512px.png`],
  },
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
