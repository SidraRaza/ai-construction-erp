import type { Metadata } from "next";
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

const SITE_URL = "https://ai-construction-erp.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI Construction ERP — Next-Gen Construction Management SaaS",
    template: "%s | AI Construction ERP",
  },
  description:
    "AI Construction ERP is a multi-tenant enterprise construction management SaaS platform created and architected by Sidra Raza. Built with Next.js 16, Prisma, real-time site engineer logs, QR labour attendance, capped expense tracking, dynamic custom production fields, and AI cost estimation.",
  keywords: [
    "AI Construction ERP",
    "Construction Management Software",
    "Sidra Raza",
    "Civil Engineering SaaS",
    "Site Engineer QR Attendance",
    "Multi Tenant Construction ERP",
    "Dynamic Custom Production Fields",
    "AI Cost Estimator Construction",
    "Construction Invoicing Software",
    "BuildCorp ERP",
  ],
  authors: [{ name: "Sidra Raza", url: SITE_URL }],
  creator: "Sidra Raza",
  publisher: "AI Construction ERP Platform",
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "AI Construction ERP",
    title: "AI Construction ERP — Enterprise Construction Management SaaS",
    description:
      "Eliminate WhatsApp group chaos and unverified site logs. Next-gen AI Construction Management ERP with QR attendance, capped expense controls, and dynamic custom fields created by Founder Sidra Raza.",
    images: [
      {
        url: `${SITE_URL}/logo-512px.png`,
        width: 512,
        height: 512,
        type: "image/png",
        alt: "AI Construction ERP High-Res Logo Preview",
      },
      {
        url: `${SITE_URL}/logo-256px.png`,
        width: 256,
        height: 256,
        type: "image/png",
        alt: "AI Construction ERP Logo Preview 256px",
      },
      {
        url: `${SITE_URL}/logo-128px.png`,
        width: 128,
        height: 128,
        type: "image/png",
        alt: "AI Construction ERP Logo Preview 128px",
      },
      {
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
        type: "image/png",
        alt: "AI Construction ERP Main Brand Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Construction ERP — Next-Gen SaaS Platform",
    description:
      "Enterprise multi-tenant construction ERP with QR worker attendance, capped site expenses, and AI engineering tools created by Sidra Raza.",
    images: [
      `${SITE_URL}/logo-512px.png`,
      `${SITE_URL}/logo-256px.png`,
      `${SITE_URL}/logo.png`,
    ],
    creator: "@SidraRaza",
  },
  icons: {
    icon: [
      { url: "/logo-16px.png", sizes: "16x16", type: "image/png" },
      { url: "/logo-32px.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-64px.png", sizes: "64x64", type: "image/png" },
      { url: "/logo-128px.png", sizes: "128x128", type: "image/png" },
      { url: "/logo-256px.png", sizes: "256x256", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/logo-512px.png", sizes: "512x512", type: "image/png" },
      { url: "/logo-256px.png", sizes: "256x256", type: "image/png" },
    ],
  },
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
    image: `${SITE_URL}/logo-512px.png`,
    logo: `${SITE_URL}/logo-512px.png`,
    operatingSystem: "Web",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Sidra Raza",
      jobTitle: "Platform Founder & Lead Architect",
    },
    description:
      "AI Construction ERP is a multi-tenant enterprise construction management SaaS platform created and architected by Sidra Raza.",
    url: SITE_URL,
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        {/* Favicons & App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo-16px.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo-32px.png" />
        <link rel="icon" type="image/png" sizes="64x64" href="/logo-64px.png" />
        <link rel="icon" type="image/png" sizes="128x128" href="/logo-128px.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/logo-512px.png" />

        {/* Explicit Social Link Preview Tags for WhatsApp, iMessage, Skype, and LinkedIn */}
        <meta property="og:image" content={`${SITE_URL}/logo-512px.png`} />
        <meta property="og:image:secure_url" content={`${SITE_URL}/logo-512px.png`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:image:alt" content="AI Construction ERP Logo Preview" />

        <meta name="twitter:image" content={`${SITE_URL}/logo-512px.png`} />
        <meta name="twitter:image:alt" content="AI Construction ERP Logo Preview" />

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
