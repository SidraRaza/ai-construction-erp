import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center & Documentation",
  description:
    "Explore platform guides, Super Admin owner portal walkthroughs, QR attendance check-ins, custom production fields, and FAQs for AI Construction ERP.",
  openGraph: {
    title: "Help Center & Documentation — AI Construction ERP",
    description: "Search guides and FAQs for AI Construction ERP.",
    images: ["/logo-512px.png"],
  },
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
