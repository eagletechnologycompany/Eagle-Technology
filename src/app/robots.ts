import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eagle-technology.example";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/api/dashboard", "/api/auth", "/login", "/unauthorized"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
