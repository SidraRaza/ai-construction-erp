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

export const metadata: Metadata = {
  title: "AI Construction ERP — Enterprise SaaS Platform",
  description: "Next.js App Router AI Construction Management ERP System created by Sidra Raza",
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
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo-16px.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo-32px.png" />
        <link rel="icon" type="image/png" sizes="64x64" href="/logo-64px.png" />
        <link rel="icon" type="image/png" sizes="128x128" href="/logo-128px.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/logo-512px.png" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
