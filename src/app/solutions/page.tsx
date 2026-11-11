import React from "react";
import type { Metadata } from "next";
import { ArrowRight, Check, Sparkles, Building2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { SolutionIcon } from "@/components/ui/SolutionIcon";
import {
  INTENDED_TARGET_SECTORS,
  LONG_TERM_OPPORTUNITIES,
  SOLUTION_AREAS,
} from "@/data/solutions";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Explore Eagle Technology's initial focus areas: software development, web platforms, UI/UX design, AI & automation, and digital transformation.",
};

export default function SolutionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Solutions"
        title="Practical technology built around real problems"
        description="Eagle Technology begins with five core service areas. Final scope and deliverables are always confirmed after problem discovery and team review."
        badge="Initial Service Focus"
      />

      {/* Core Service Areas */}
      <section className="border-b border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] py-16 md:py-24">
        <div className="section-padding space-y-8">
          {SOLUTION_AREAS.map((solution) => (
            <article
              key={solution.id}
              id={solution.id}
              className="scroll-mt-24 rounded-2xl border border-[var(--color-soft-sand)] bg-white p-7 md:p-10"
            >
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-pale-gold)] text-[var(--color-dark-brown)]">
                    <SolutionIcon id={solution.id} className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--color-dark-brown)]">
                    {solution.name}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-[var(--color-muted-brown)]">
                    {solution.shortExplanation}
                  </p>
                  <p className="mt-4 rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3.5 py-2.5 text-xs text-[var(--color-muted-brown)]">
                    {solution.statusNote}
                  </p>
                  <div className="mt-6">
                    <Button
                      href={`/contact?service=${solution.id}`}
                      size="md"
                      className="gap-2"
                    >
                      Inquire About {solution.name}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
                  <div className="rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-5 sm:col-span-2">
                    <h3 className="text-xs font-semibold tracking-[0.16em] text-[var(--color-brown-gold)] uppercase">
                      Problem It Addresses
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-deep-brown)]">
                      {solution.problemAddressed}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[var(--color-soft-sand)] bg-white p-5">
                    <h3 className="text-xs font-semibold tracking-[0.16em] text-[var(--color-brown-gold)] uppercase">
                      What Eagle Can Deliver
                    </h3>
                    <ul className="mt-3 space-y-2.5 text-sm text-[var(--color-muted-brown)]">
                      {solution.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brown-gold)]"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-[var(--color-soft-sand)] bg-white p-5">
                    <h3 className="text-xs font-semibold tracking-[0.16em] text-[var(--color-brown-gold)] uppercase">
                      Capabilities &amp; Approach
                    </h3>
                    <ul className="mt-3 space-y-2.5 text-sm text-[var(--color-muted-brown)]">
                      {solution.capabilities.map((cap) => (
                        <li key={cap} className="flex items-start gap-2">
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-dark-brown)]"
                            aria-hidden="true"
                          />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Intended Target Sectors + Long-Term Exploration */}
      <section className="bg-white py-16 md:py-24">
        <div className="section-padding grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-8">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-pale-gold)] text-[var(--color-dark-brown)]">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-brown-gold)] uppercase">
              Initial Market Focus · Ethiopia
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[var(--color-dark-brown)]">
              Organizations We Aim to Serve
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted-brown)]">
              These are our intended customer groups as we establish our foundation in
              Ethiopia—not claimed past clients.
            </p>
            <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {INTENDED_TARGET_SECTORS.map((sector) => (
                <li
                  key={sector}
                  className="rounded-lg border border-[var(--color-soft-sand)] bg-white px-3.5 py-2.5 text-sm font-medium text-[var(--color-dark-brown)]"
                >
                  {sector}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--color-dark-brown)]/15 bg-[var(--color-deep-brown)] p-8 text-white">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brown-gold)]/20 text-[var(--color-brown-gold)]">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-brown-gold)] uppercase">
              Areas of Exploration
            </p>
            <h2 className="mt-2 text-2xl font-bold">Long-Term Opportunities</h2>
            <p className="mt-2 text-sm text-[var(--color-soft-sand)]/80">
              Future directions Eagle may explore as the company grows. These are
              long-term possibilities rather than current product claims.
            </p>
            <ul className="mt-5 space-y-2.5">
              {LONG_TERM_OPPORTUNITIES.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 rounded-lg border border-[var(--color-muted-brown)]/30 bg-[var(--color-dark-brown)]/40 px-4 py-2.5 text-sm text-[var(--color-soft-sand)]"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-[var(--color-brown-gold)]"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
