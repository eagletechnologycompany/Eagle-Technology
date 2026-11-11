"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { EagleLogoMark } from "@/components/ui/EagleLogo";
import { PRIMARY_NAV, SITE_CONFIG } from "@/data/site";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-soft-sand)] bg-white/95 backdrop-blur-md">
      <div className="section-padding flex h-16 items-center justify-between md:h-20">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-brown-gold)]"
          aria-label={`${SITE_CONFIG.name} home`}
        >
          <EagleLogoMark
            size={48}
            color="var(--color-dark-brown)"
            accentColor="var(--color-brown-gold)"
            className="transition-transform duration-200 group-hover:scale-[1.03]"
          />
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-[var(--color-dark-brown)] sm:text-lg">
              {SITE_CONFIG.name}
            </span>
            <span className="hidden text-[11px] font-medium tracking-wide text-[var(--color-muted-brown)] sm:block">
              {SITE_CONFIG.slogan}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {PRIMARY_NAV.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative py-1 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[var(--color-dark-brown)] font-semibold"
                    : "text-[var(--color-muted-brown)] hover:text-[var(--color-dark-brown)]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-[var(--color-brown-gold)]"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Primary CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden items-center gap-2 rounded-lg bg-[var(--color-brown-gold)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--accent-hover)] md:inline-flex"
          >
            Start a Project
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-soft-sand)] text-[var(--color-dark-brown)] transition-colors hover:bg-[var(--color-pale-gold)] lg:hidden"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <nav
          className="border-t border-[var(--color-soft-sand)] bg-white lg:hidden animate-fade-in"
          aria-label="Mobile navigation"
        >
          <div className="section-padding flex flex-col gap-1 py-4">
            {PRIMARY_NAV.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--color-pale-gold)] font-semibold text-[var(--color-dark-brown)]"
                      : "text-[var(--color-muted-brown)] hover:bg-[var(--color-warm-off-white)] hover:text-[var(--color-dark-brown)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-brown-gold)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              Start a Project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
