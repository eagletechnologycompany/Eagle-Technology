import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, ArrowLeft, EyeOff } from "lucide-react";
import { SITE_CONFIG } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy practices, client data protection, and disclosure for Eagle Technology.",
};

export default function PrivacyPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="section-padding max-w-4xl mx-auto">
        {/* Navigation & Status Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-brown-gold)] hover:underline whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
            <span>Back to Home</span>
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 whitespace-nowrap shrink-0">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span>Document Status: [Founder approval required]</span>
          </span>
        </div>

        <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-8 md:p-12 shadow-sm">
          <div className="mb-8 border-b border-[var(--color-soft-sand)] pb-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-brown-gold)] uppercase">
              Data Protection &amp; Confidentiality
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-dark-brown)] md:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-[var(--color-muted-brown)] leading-relaxed">
              Last updated: November 2026 · Commercial Entity Status: In Formation (Addis Ababa, Ethiopia)
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 mb-8 text-xs text-amber-900 leading-relaxed">
            <strong>Transparency Notice (CR-10):</strong> At Eagle Technology, data privacy and intellectual property confidentiality are core architectural priorities. We never monetize, rent, or share client project details, user inquiries, or proprietary codebases with third parties.
          </div>

          <div className="space-y-8 text-sm text-[var(--color-foreground)] leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-[var(--color-dark-brown)] mb-3 flex items-center gap-2">
                <Lock className="h-4 w-4 text-[var(--color-brown-gold)]" />
                1. Information We Collect
              </h2>
              <p>
                We collect only information essential to providing engineering and digital services:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1 text-xs text-[var(--color-muted-brown)]">
                <li>Project inquiry information submitted via our public contact form (name, email, project scope, budget).</li>
                <li>Authentication credentials for authorized client portal accounts (securely salted and hashed using scrypt).</li>
                <li>Operational audit logs for platform security and unauthorized access prevention.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--color-dark-brown)] mb-3 flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-[var(--color-brown-gold)]" />
                2. Non-Disclosure &amp; Project Confidentiality
              </h2>
              <p>
                All technical architectures, business logic, customer databases, and creative assets shared with Eagle Technology during discovery or delivery are treated with strict confidentiality under bilateral Non-Disclosure Agreements (NDAs).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--color-dark-brown)] mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[var(--color-brown-gold)]" />
                3. Security Measures
              </h2>
              <p>
                Our infrastructure incorporates cryptographic token signing (HMAC-SHA256), scrypt password hashing with per-user cryptographic salts, HTTP-only secure cookie transport, and strict Role-Based Access Controls (RBAC).
              </p>
            </section>

            <section className="border-t border-[var(--color-soft-sand)] pt-6 text-xs text-[var(--color-muted-brown)]">
              <p>
                For inquiries regarding data protection policies or compliance, please reach out to:{" "}
                <span className="font-semibold text-[var(--color-dark-brown)]">{SITE_CONFIG.contact.emailPlaceholder}</span>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
