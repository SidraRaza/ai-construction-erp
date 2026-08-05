import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast-provider";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-construction-erp-eight.vercel.app";

export const viewport: Viewport = {
  themeColor: "#0F2D4A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI Construction ERP — Replace WhatsApp & Spreadsheets with One System",
    template: "%s | AI Construction ERP",
  },
  description:
    "Manage projects, site labour, materials, expenses, and client billing in one AI-powered construction management system. Built for real construction companies.",
  keywords: [
    "AI Construction ERP",
    "Construction Management Software",
    "Site Labour Tracking",
    "Materials & Capped Expenses",
    "Client Billing & Invoicing",
    "Civil Engineering SaaS",
    "BuildCorp ERP",
  ],
  authors: [{ name: "AI Construction ERP", url: SITE_URL }],
  creator: "AI Construction ERP Team",
  publisher: "AI Construction ERP",
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "AI Construction ERP",
    title: "AI Construction ERP — Enterprise Construction Management SaaS",
    description:
      "Manage projects, site labour, materials, expenses, and client billing in one AI-powered construction management system.",
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/lgo.png`,
        secureUrl: `${SITE_URL}/lgo.png`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "AI Construction ERP",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Construction ERP — Enterprise Construction Management SaaS",
    description:
      "Manage projects, site labour, materials, expenses, and client billing in one AI-powered construction management system.",
    images: [`${SITE_URL}/lgo.png`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/lgo.png", type: "image/png" },
    ],
    apple: [
      { url: "/lgo.png", sizes: "180x180" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AI Construction ERP",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "AI-powered construction management ERP for projects, labour, materials, expenses, quotations, invoices, and client billing.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: SITE_URL,
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/lgo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/lgo.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
