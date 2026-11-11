import React from "react";
import type { Metadata } from "next";
import { ShieldAlert, Layers, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { WORK_DEMONSTRATIONS } from "@/data/work";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Explore Eagle Technology's internal foundation builds, pre-launch demonstration concepts, and transparent portfolio standards.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Work"
        title="Demonstrating capability with honesty"
        description="Eagle Technology is an early-stage company. Rather than inventing clients or metrics, we document our internal foundation builds and pre-launch demonstration concepts transparently."
        badge="Pre-Launch Portfolio & Placeholders"
      />

      <section className="border-b border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] py-16 md:py-24">
        <div className="section-padding">
          {/* Transparency Banner */}
          <div className="mb-10 flex items-start gap-4 rounded-2xl border border-[var(--color-brown-gold)]/40 bg-[var(--color-pale-gold)]/60 p-6">
            <ShieldAlert
              className="mt-0.5 h-6 w-6 shrink-0 text-[var(--color-dark-brown)]"
              aria-hidden="true"
            />
            <div className="text-sm leading-relaxed text-[var(--color-dark-brown)]">
              <p className="font-bold">Transparency Commitment</p>
              <p className="mt-1 text-[var(--color-muted-brown)]">
                Items labeled as <strong>Demonstration Placeholder</strong> represent
                planned showcase builds in our initial 90-day roadmap. Verified customer
                case studies and measurable outcomes will only be published after real
                delivery and with explicit client permission.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {WORK_DEMONSTRATIONS.map((work) => (
              <article
                key={work.id}
                className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-7 md:p-9"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-soft-sand)] pb-5">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-[var(--color-brown-gold)] uppercase">
                      {work.category}
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-[var(--color-dark-brown)]">
                      {work.title}
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-soft-sand)] bg-[var(--color-pale-gold)]/60 px-3.5 py-1 text-xs font-semibold text-[var(--color-dark-brown)]">
                    <Layers className="h-3.5 w-3.5 text-[var(--color-brown-gold)]" aria-hidden="true" />
                    {work.status}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-xs font-semibold tracking-wider text-[var(--color-dark-brown)] uppercase">
                      Problem / Opportunity
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-brown)]">
                      {work.problemOrOpportunity}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold tracking-wider text-[var(--color-dark-brown)] uppercase">
                      Solution Approach
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-brown)]">
                      {work.proposedSolution}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold tracking-wider text-[var(--color-dark-brown)] uppercase">
                      Team Contribution
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-brown)]">
                      {work.teamContribution}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold tracking-wider text-[var(--color-dark-brown)] uppercase">
                      Outcome / Status
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-brown)]">
                      {work.outcomeNote}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-[var(--color-soft-sand)] pt-5">
                  <span className="mr-2 text-xs font-semibold text-[var(--color-dark-brown)]">
                    Technologies:
                  </span>
                  {work.technologyStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-2.5 py-1 font-mono text-xs text-[var(--color-dark-brown)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-[var(--color-deep-brown)] p-8 text-white md:flex md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold">Interested in an early collaboration?</h2>
              <p className="mt-2 text-sm text-[var(--color-soft-sand)]/85">
                We welcome discovery conversations with organizations looking for a
                committed founding engineering and design team.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Button href="/contact" className="gap-2">
                Start a Project
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
