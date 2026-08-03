import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-construction-erp-eight.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/", "/admin/", "/engineer/", "/client/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

