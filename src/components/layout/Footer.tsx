import React from "react";
import Link from "next/link";
import { Mail, MapPin, Globe } from "lucide-react";
import { EagleLogo } from "@/components/ui/EagleLogo";
import { SITE_CONFIG } from "@/data/site";

const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/about#team", label: "Founding Team" },
    { href: "/about#values", label: "Core Values" },
    { href: "/work", label: "Our Work" },
  ],
  solutions: [
    { href: "/solutions#software", label: "Software Development" },
    { href: "/solutions#web", label: "Web & Digital Platforms" },
    { href: "/solutions#design", label: "UI/UX & Creative Design" },
    { href: "/solutions#ai", label: "AI & Automation" },
    { href: "/solutions#digital", label: "Digital Transformation" },
  ],
  connect: [
    { href: "/insights", label: "Insights" },
    { href: "/contact", label: "Contact Us" },
    { href: "/contact?service=software", label: "Start a Project" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-dark-brown)] bg-[var(--color-deep-brown)] text-[var(--color-soft-sand)]">
      <div className="section-padding py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div>
            <Link href="/" className="inline-block mb-4" aria-label="Eagle Technology home">
              <EagleLogo
                size={120}
                color="var(--color-white)"
                accentColor="var(--color-brown-gold)"
              />
            </Link>
            <p className="mb-4 max-w-xs text-sm leading-relaxed text-[var(--color-soft-sand)]/85">
              {SITE_CONFIG.origin}. Focused on practical software engineering, creative design,
              and intelligent digital transformation.
            </p>
            <p className="text-xs font-semibold tracking-wider text-[var(--color-brown-gold)] uppercase">
              {SITE_CONFIG.slogan}
            </p>
          </div>

          {/* Company links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-[0.18em] text-white uppercase">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-soft-sand)]/75 transition-colors hover:text-[var(--color-brown-gold)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-[0.18em] text-white uppercase">
              Solutions
            </h3>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-soft-sand)]/75 transition-colors hover:text-[var(--color-brown-gold)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact placeholders */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-[0.18em] text-white uppercase">
              Connect
            </h3>
            <ul className="mb-6 space-y-3">
              {footerLinks.connect.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-soft-sand)]/75 transition-colors hover:text-[var(--color-brown-gold)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-2.5 rounded-xl border border-[var(--color-muted-brown)]/30 bg-[var(--color-dark-brown)]/40 p-4 text-xs">
              <div className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-brown-gold)]" />
                <div>
                  <p className="font-medium text-white">{SITE_CONFIG.contact.emailPlaceholder}</p>
                  <p className="text-[11px] text-[var(--color-soft-sand)]/60">
                    {SITE_CONFIG.contact.emailNotice}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-brown-gold)]" />
                <p className="text-[var(--color-soft-sand)]/80">{SITE_CONFIG.contact.location}</p>
              </div>
              <div className="flex items-start gap-2.5">
                <Globe className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-brown-gold)]" />
                <p className="text-[var(--color-soft-sand)]/70">
                  {SITE_CONFIG.contact.socialNotice}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-muted-brown)]/30 pt-8 sm:flex-row">
          <p className="text-xs text-[var(--color-soft-sand)]/60">
            © {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-soft-sand)]/60">
            {SITE_CONFIG.origin} · {SITE_CONFIG.teamSizeLabel}
          </p>
        </div>
      </div>
    </footer>
  );
}
