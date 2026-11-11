import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Eagle Technology — See Further. Build Smarter.",
    template: "%s | Eagle Technology",
  },
  description:
    "Eagle Technology is an Ethiopian-founded technology company focused on software development, web development, digital platforms, UI/UX design, AI and automation, and digital transformation solutions.",
  keywords: [
    "Eagle Technology",
    "Ethiopian technology company",
    "software development Ethiopia",
    "web development",
    "digital solutions",
    "UI/UX design",
    "AI automation",
    "digital transformation",
  ],
  authors: [{ name: "Eagle Technology" }],
  openGraph: {
    title: "Eagle Technology — See Further. Build Smarter.",
    description:
      "Ethiopian-founded technology company building meaningful digital solutions through technology, creativity, and innovation.",
    type: "website",
    locale: "en_US",
    siteName: "Eagle Technology",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eagle Technology — See Further. Build Smarter.",
    description:
      "Ethiopian-founded technology company building meaningful digital solutions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
