import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Layers } from "lucide-react";
import { requirePortalPage } from "@/server/auth/session";
import { EagleLogoMark } from "@/components/ui/EagleLogo";
import { PortalNavLinks, LogoutButton } from "@/components/portal/PortalNavLinks";

export const metadata: Metadata = {
  title: "Customer & Developer Platform — Eagle Technology",
  description: "Secure private portal for Eagle Technology customers, project participants, and platform developers.",
  robots: { index: false, follow: false },
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requirePortalPage();
  const isFounder = user.roleId !== "client";

  return (
    <div className="min-h-screen bg-[var(--color-warm-off-white)] text-[var(--color-deep-brown)] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-soft-sand)] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand & Portal Type */}
          <div className="flex items-center gap-3">
            <Link
              href="/portal"
              className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-[var(--color-brown-gold)]"
            >
              <EagleLogoMark
                size={38}
                color="var(--color-dark-brown)"
                accentColor="var(--color-brown-gold)"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-[var(--color-dark-brown)] sm:text-base">
                  Eagle Platform
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-[var(--color-brown-gold)] uppercase">
                  Customer &amp; Partner Portal
                </span>
              </div>
            </Link>

            {isFounder && (
              <span className="hidden items-center gap-1 rounded-full bg-[var(--color-pale-gold)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--color-dark-brown)] md:inline-flex">
                <Shield className="h-3 w-3 text-[var(--color-brown-gold)]" />
                Founder View ({user.shortTitle})
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          <PortalNavLinks />

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            {isFounder ? (
              <Link
                href="/dashboard"
                className="hidden items-center gap-1.5 rounded-lg border border-[var(--color-brown-gold)]/40 bg-[var(--color-pale-gold)]/50 px-3 py-1.5 text-xs font-semibold text-[var(--color-dark-brown)] transition-colors hover:bg-[var(--color-pale-gold)] sm:inline-flex"
              >
                <Layers className="h-3.5 w-3.5 text-[var(--color-brown-gold)]" />
                Founder Workspace
              </Link>
            ) : null}

            <div className="hidden flex-col items-end text-right sm:flex">
              <span className="text-xs font-semibold text-[var(--color-dark-brown)]">
                {user.displayLabel}
              </span>
              <span className="text-[10px] text-[var(--color-muted-brown)]">
                @{user.username}
              </span>
            </div>

            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Portal Footer */}
      <footer className="border-t border-[var(--color-soft-sand)] bg-white py-6 text-xs text-[var(--color-muted-brown)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--color-dark-brown)]">Eagle Technology Platform</span>
            <span>·</span>
            <span>Private Customer &amp; Developer Portal</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/" className="hover:text-[var(--color-dark-brown)]">
              Public Website
            </Link>
            <Link href="/contact" className="hover:text-[var(--color-dark-brown)]">
              Support &amp; Inquiries
            </Link>
            <span>v0.2.0-beta</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
