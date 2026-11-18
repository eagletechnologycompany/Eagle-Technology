"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Layers, ShieldCheck, Users } from "lucide-react";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { EagleEyeRadar } from "@/components/home/EagleEyeRadar";
import { SITE_CONFIG } from "@/data/site";

function MagneticAnchor({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [shift, setShift] = useState({ x: 0, y: 0 });

  function onMove(event: React.MouseEvent<HTMLAnchorElement>) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    setShift({
      x: Math.max(-8, Math.min(8, x * 0.16)),
      y: Math.max(-6, Math.min(6, y * 0.2)),
    });
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={() => setShift({ x: 0, y: 0 })}
      className={className}
      style={{
        transform: `translate(${shift.x}px, ${shift.y}px)`,
        transition: "transform 180ms ease-out",
      }}
    >
      {children}
    </Link>
  );
}

export function QuietHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [glow, setGlow] = useState({ x: 72, y: 28 });

  function onMove(event: React.MouseEvent<HTMLElement>) {
    const node = sectionRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setGlow({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative overflow-hidden border-b border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] py-20 md:py-28 lg:py-32"
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-[var(--color-dark-brown)]"
        aria-hidden="true"
      >
        <defs>
          <pattern id="eagle-arch-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.16" />
            <circle cx="0" cy="0" r="1.1" fill="currentColor" opacity="0.28" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#eagle-arch-grid)" />
        <path
          d="M0 88 H220 L280 28 H520"
          fill="none"
          stroke="#B87333"
          strokeWidth="1"
          opacity="0.35"
        />
        <path
          d="M100% 70% H78% L72% 82% H48%"
          fill="none"
          stroke="#4B2E0F"
          strokeWidth="1"
          opacity="0.2"
        />
      </svg>

      <div
        className="pointer-events-none absolute h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-brown-gold)]/15 blur-3xl transition-all duration-300"
        style={{ left: `${glow.x}%`, top: `${glow.y}%` }}
        aria-hidden="true"
      />

      <div className="section-padding relative z-10 grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-soft-sand)] bg-white/90 px-4 py-1.5 text-xs font-semibold tracking-wide text-[var(--color-dark-brown)] shadow-xs backdrop-blur-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-brown-gold)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-brown-gold)]" />
              </span>
              <span>{SITE_CONFIG.origin}</span>
              <span className="text-[var(--color-soft-sand)]">|</span>
              <span className="text-[var(--color-muted-brown)]">{SITE_CONFIG.teamSizeLabel}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-brown-gold)]/30 bg-[var(--color-pale-gold)]/80 px-3 py-1.5 text-[11px] font-semibold text-[var(--color-dark-brown)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
              Preview systems stable
              <span className="text-[var(--color-muted-brown)]">·</span>
              Ethiopia launch: foundation stage
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-dark-brown)] sm:text-5xl lg:text-6xl lg:leading-[1.12]">
            {SITE_CONFIG.slogan}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-muted-brown)] md:text-xl">
            {SITE_CONFIG.heroSupportingMessage}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <MagneticAnchor
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-lg bg-[var(--color-brown-gold)] px-8 py-4 text-base font-semibold text-white shadow-md hover:bg-[var(--accent-hover)]"
            >
              Start a Project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </MagneticAnchor>
            <MagneticAnchor
              href="#technology-showcase"
              className="inline-flex items-center rounded-lg border-2 border-[var(--color-brown-gold)] px-8 py-4 text-base font-semibold text-[var(--color-brown-gold)] hover:bg-[var(--color-brown-gold)] hover:text-white"
            >
              Preview the Platform
            </MagneticAnchor>
          </div>
          <p className="mt-3 text-xs text-[var(--color-muted-brown)]">
            Production uptime and a public SLA are [Coming soon]. This indicator reflects the local preview only.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 border-t border-[var(--color-soft-sand)] pt-8 sm:grid-cols-3">
            <div className="relative border-l-2 border-[var(--color-brown-gold)] pl-3">
              <p className="text-xs font-semibold tracking-wider text-[var(--color-brown-gold)] uppercase">
                Initial Market
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-dark-brown)]">Ethiopia</p>
              <p className="text-[11px] text-[var(--color-muted-brown)]">Local needs, localized value</p>
            </div>
            <div className="relative border-l-2 border-[var(--color-brown-gold)]/60 pl-3">
              <p className="text-xs font-semibold tracking-wider text-[var(--color-brown-gold)] uppercase">
                Long-Term Ambition
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-dark-brown)]">
                Africa &amp; Global Markets
              </p>
              <p className="text-[11px] text-[var(--color-muted-brown)]">Scalable cloud &amp; platforms</p>
            </div>
            <div className="relative border-l-2 border-[var(--color-brown-gold)]/30 pl-3">
              <p className="text-xs font-semibold tracking-wider text-[var(--color-brown-gold)] uppercase">
                Founding Structure
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-dark-brown)]">5 Core Founding Roles</p>
              <p className="text-[11px] text-[var(--color-muted-brown)]">End-to-end technical delivery</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <MotionReveal>
            <div className="relative rounded-2xl border border-[var(--color-brown-gold)]/30 bg-gradient-to-b from-[var(--color-deep-brown)] to-[#180e05] p-8 text-white shadow-2xl sm:p-10">
              <div className="absolute top-3 left-3 h-3 w-3 border-t border-l border-[var(--color-brown-gold)]/50" />
              <div className="absolute top-3 right-3 h-3 w-3 border-t border-r border-[var(--color-brown-gold)]/50" />
              <div className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[var(--color-brown-gold)]/50" />
              <div className="absolute right-3 bottom-3 h-3 w-3 border-r border-b border-[var(--color-brown-gold)]/50" />

              <div className="border-b border-[var(--color-muted-brown)]/30 pb-6 text-center">
                <EagleEyeRadar />
                <p className="mt-3 text-xs font-semibold tracking-[0.2em] text-[var(--color-brown-gold)] uppercase">
                  Official Brand Identity
                </p>
                <p className="mx-auto mt-1.5 max-w-xs text-xs text-[var(--color-soft-sand)]/80">
                  Vision, practical engineering, and human collaboration built on substance rather than appearance.
                </p>
              </div>

              <div className="mt-6 space-y-3.5 text-xs text-[var(--color-soft-sand)]/85">
                <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[var(--color-brown-gold)]" aria-hidden="true" />
                    Founding Team
                  </span>
                  <span className="font-semibold text-white">5 Members</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[var(--color-brown-gold)]" aria-hidden="true" />
                    Core Focus
                  </span>
                  <span className="font-semibold text-white">Software &amp; Digital Solutions</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[var(--color-brown-gold)]" aria-hidden="true" />
                    Stage
                  </span>
                  <span className="font-semibold text-[var(--color-brown-gold)]">
                    Foundation &amp; Launch Readiness
                  </span>
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
