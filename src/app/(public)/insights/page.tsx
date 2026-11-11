import React from "react";
import type { Metadata } from "next";
import { BookOpen, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { PLANNED_INSIGHTS } from "@/data/insights";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Upcoming technical articles, digital transformation notes, and AI automation perspectives from Eagle Technology.",
};

export default function InsightsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Practical thinking on software, design, and automation"
        description="Per our initial website rollout plan, full editorial articles will be published progressively after launch as the team documents lessons from real engineering work."
        badge="Editorial Roadmap · Post-Launch"
      />

      <section className="bg-[var(--color-warm-off-white)] py-16 md:py-24">
        <div className="section-padding">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PLANNED_INSIGHTS.map((topic) => (
              <article
                key={topic.id}
                className="flex h-full flex-col justify-between rounded-2xl border border-[var(--color-soft-sand)] bg-white p-7"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold tracking-wider text-[var(--color-brown-gold)] uppercase">
                      {topic.category}
                    </span>
                    <BookOpen
                      className="h-4 w-4 text-[var(--color-muted-brown)]"
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="text-xl font-bold leading-snug text-[var(--color-dark-brown)]">
                    {topic.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted-brown)]">
                    {topic.summary}
                  </p>
                </div>

                <div className="mt-6 border-t border-[var(--color-soft-sand)] pt-4">
                  <span className="inline-block rounded-full bg-[var(--color-pale-gold)] px-3 py-1 text-[11px] font-semibold text-[var(--color-dark-brown)]">
                    {topic.status}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-[var(--color-soft-sand)] bg-white p-8 text-center">
            <h2 className="text-xl font-bold text-[var(--color-dark-brown)]">
              Want to discuss a specific technical or digital transformation topic?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--color-muted-brown)]">
              Reach out directly to our founding team to share a challenge or request a
              discovery conversation.
            </p>
            <div className="mt-6">
              <Button href="/contact" className="gap-2">
                Contact Eagle Technology
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
