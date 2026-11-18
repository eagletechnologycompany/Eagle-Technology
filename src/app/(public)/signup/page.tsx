import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Shield, Code2, Layers } from "lucide-react";
import { EagleLogo } from "@/components/ui/EagleLogo";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { SITE_CONFIG } from "@/data/site";

export const metadata: Metadata = {
  title: "Create Customer Account — Eagle Technology",
  description:
    "Register for the Eagle Technology customer and partner platform for milestone review, structured project inquiries, and developer sandbox tools.",
};

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[var(--color-warm-off-white)] py-12 md:py-20">
      <div className="section-padding mx-auto max-w-7xl">
        {/* Navigation Bar */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-brown-gold)] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Public Website
          </Link>
          <div className="text-xs text-[var(--color-muted-brown)]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[var(--color-brown-gold)] hover:underline">
              Sign In
            </Link>
          </div>
        </div>

        {/* Split Screen Container */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Left Hero Brand Showcase */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl border border-[var(--color-brown-gold)]/30 bg-gradient-to-b from-[var(--color-deep-brown)] to-[#180e05] p-8 text-white shadow-2xl md:p-12">
              {/* Subtle Linework Accents */}
              <div className="absolute top-4 left-4 h-4 w-4 border-t border-l border-[var(--color-brown-gold)]/50" />
              <div className="absolute top-4 right-4 h-4 w-4 border-t border-r border-[var(--color-brown-gold)]/50" />
              <div className="absolute bottom-4 left-4 h-4 w-4 border-b border-l border-[var(--color-brown-gold)]/50" />
              <div className="absolute bottom-4 right-4 h-4 w-4 border-b border-r border-[var(--color-brown-gold)]/50" />

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-soft-sand)]/20 bg-white/5 px-3 py-1 text-xs font-semibold text-[var(--color-brown-gold)] backdrop-blur-xs">
                <Shield className="h-3.5 w-3.5" />
                <span>{SITE_CONFIG.origin} · Technology Platform</span>
              </div>

              <div className="mb-6">
                <EagleLogo
                  size={160}
                  color="var(--color-white)"
                  accentColor="var(--color-brown-gold)"
                />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Collaborate with Eagle Technology
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-soft-sand)]/80">
                Experience structured milestone delivery, transparent change requests, and direct developer sandbox access within our connected digital ecosystem.
              </p>

              {/* 3 Core Platform Capabilities */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5 rounded-xl bg-white/5 p-3.5 border border-white/5">
                  <div className="rounded-lg bg-[var(--color-brown-gold)]/20 p-2 text-[var(--color-brown-gold)]">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Interactive Milestone Review</h3>
                    <p className="mt-0.5 text-xs text-[var(--color-soft-sand)]/70">
                      Inspect design Figma links, source deliverables, and approve milestones with full audit trails.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-xl bg-white/5 p-3.5 border border-white/5">
                  <div className="rounded-lg bg-[var(--color-brown-gold)]/20 p-2 text-[var(--color-brown-gold)]">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Structured Scope Inquiries</h3>
                    <p className="mt-0.5 text-xs text-[var(--color-soft-sand)]/70">
                      Submit feature requests, revisions, and technical queries with direct status updates from the founding team.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-xl bg-white/5 p-3.5 border border-white/5">
                  <div className="rounded-lg bg-[var(--color-brown-gold)]/20 p-2 text-[var(--color-brown-gold)]">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Developer Sandbox &amp; SDK</h3>
                    <p className="mt-0.5 text-xs text-[var(--color-soft-sand)]/70">
                      Generate sandbox keys, trigger simulated webhook events, and test integration code in TypeScript &amp; Python.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Founding Principle Note */}
              <div className="mt-8 border-t border-[var(--color-muted-brown)]/30 pt-6 text-[11px] text-[var(--color-soft-sand)]/60">
                <p className="italic">
                  &ldquo;Vision, practical engineering, and human collaboration built on substance rather than appearance.&rdquo;
                </p>
                <p className="mt-1 font-semibold text-[var(--color-brown-gold)]">
                  — Eagle Technology Founding Charter
                </p>
              </div>
            </div>
          </div>

          {/* Right Registration Card */}
          <div className="flex justify-center lg:col-span-6">
            <SignUpForm />
          </div>
        </div>
      </div>
    </main>
  );
}
