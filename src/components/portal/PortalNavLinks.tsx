"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FolderKanban,
  FileCheck,
  MessageSquarePlus,
  Code2,
  ReceiptText,
  Menu,
  X,
} from "lucide-react";

const PORTAL_LINKS = [
  { href: "/portal", label: "Overview", icon: FolderKanban, exact: true },
  { href: "/portal/deliverables", label: "Deliverables & Review", icon: FileCheck },
  { href: "/portal/requests", label: "Requests & Inquiries", icon: MessageSquarePlus },
  { href: "/portal/developer", label: "Developer Sandbox", icon: Code2 },
  { href: "/portal/billing", label: "Milestones & Billing", icon: ReceiptText },
];

export function PortalNavLinks() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-1 lg:flex" aria-label="Portal Navigation">
        {PORTAL_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = link.exact
            ? pathname === link.href
            : pathname?.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-[var(--color-pale-gold)] text-[var(--color-dark-brown)]"
                  : "text-[var(--color-muted-brown)] hover:bg-[var(--color-warm-off-white)] hover:text-[var(--color-dark-brown)]"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[var(--color-brown-gold)]" : ""}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Toggle Button */}
      <div className="flex items-center lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--color-soft-sand)] bg-white text-[var(--color-dark-brown)] hover:bg-[var(--color-warm-off-white)]"
          aria-expanded={mobileOpen}
          aria-label="Toggle Portal Menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="absolute top-16 right-0 left-0 border-b border-[var(--color-soft-sand)] bg-white/98 p-4 shadow-lg backdrop-blur-md lg:hidden">
          <nav className="flex flex-col space-y-1.5" aria-label="Mobile Portal Navigation">
            {PORTAL_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = link.exact
                ? pathname === link.href
                : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-[var(--color-pale-gold)] text-[var(--color-dark-brown)]"
                      : "text-[var(--color-muted-brown)] hover:bg-[var(--color-warm-off-white)] hover:text-[var(--color-dark-brown)]"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-[var(--color-brown-gold)]" : ""}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-soft-sand)] bg-white px-2.5 py-1.5 text-xs font-semibold text-[var(--color-muted-brown)] transition-colors hover:bg-[var(--color-warm-off-white)] hover:text-red-700"
      title="Sign out of Eagle Platform"
    >
      Sign Out
    </button>
  );
}
