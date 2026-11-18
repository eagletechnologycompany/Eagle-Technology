import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, FileText, ArrowLeft, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service, engagement framework, and legal disclosure for Eagle Technology.",
};

export default function TermsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="section-padding max-w-4xl mx-auto">
        {/* Navigation & Status Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-brown-gold)] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">
            <ShieldAlert className="h-3.5 w-3.5" />
            Document Status: [Founder approval required]
          </span>
        </div>

        <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-8 md:p-12 shadow-sm">
          <div className="mb-8 border-b border-[var(--color-soft-sand)] pb-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-brown-gold)] uppercase">
              Legal Disclosure &amp; Framework
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-dark-brown)] md:text-4xl">
              Terms of Service
            </h1>
            <p className="mt-3 text-sm text-[var(--color-muted-brown)] leading-relaxed">
              Last updated: November 2026 · Commercial Entity Status: In Formation (Addis Ababa, Ethiopia)
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 mb-8 text-xs text-amber-900 leading-relaxed">
            <strong>Transparency Notice (CR-10):</strong> Eagle Technology is an Ethiopian-founded technology company currently in formal corporate formation. This document outlines the engagement principles, client deliverables ownership, and service protocols. Formal commercial execution will be finalized following corporate charter adoption and trade registration.
          </div>

          <div className="space-y-8 text-sm text-[var(--color-foreground)] leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-[var(--color-dark-brown)] mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--color-brown-gold)]" />
                1. Engagement &amp; Scope of Work
              </h2>
              <p>
                All software engineering, digital platform design, AI automation, and strategic advisory projects undertaken by {SITE_CONFIG.name} are defined through structured, milestone-based Statements of Work (SOW). No work commences without mutual agreement on milestones, acceptance criteria, and deliverable review schedules.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--color-dark-brown)] mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-brown-gold)]" />
                2. Intellectual Property &amp; Deliverable Rights
              </h2>
              <p>
                Upon receipt of full milestone payment for agreed deliverables, the client receives exclusive ownership of the custom code, design assets, and tailored configurations produced specifically for that milestone. Proprietary developer tools, internal orchestration scripts, and open-source foundations remain under their respective licenses.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--color-dark-brown)] mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--color-brown-gold)]" />
                3. Customer Portal &amp; Developer Sandbox Access
              </h2>
              <p>
                Access to the Eagle Customer &amp; Partner Portal is granted to verified clients and authorized participants. Users are responsible for safeguarding their authentication credentials and API keys. Sandbox API keys are provided for evaluation and integration planning purposes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--color-dark-brown)] mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-brown-gold)]" />
                4. Governing Law &amp; Jurisdiction
              </h2>
              <p>
                These terms and any disputes arising from contractual engagements shall be governed by and interpreted in accordance with the laws of the Federal Democratic Republic of Ethiopia.
              </p>
            </section>

            <section className="border-t border-[var(--color-soft-sand)] pt-6 text-xs text-[var(--color-muted-brown)]">
              <p>
                For questions regarding engagement terms or custom enterprise agreements, contact:{" "}
                <span className="font-semibold text-[var(--color-dark-brown)]">{SITE_CONFIG.contact.emailPlaceholder}</span>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
