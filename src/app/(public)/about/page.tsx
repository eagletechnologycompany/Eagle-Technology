import React from "react";
import type { Metadata } from "next";
import { UserRound, Compass, Eye, Target } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { COMPANY_FOUNDATION, CORE_VALUES } from "@/data/company";
import { FOUNDING_TEAM } from "@/data/team";
import { SITE_CONFIG } from "@/data/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Eagle Technology—our Ethiopian origin, vision, mission, core values, and five-person founding team.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Ethiopian-founded. Built for real impact."
        description="Eagle Technology is an early-stage technology company focused on combining thoughtful software engineering, user-centered design, and practical automation."
        badge={SITE_CONFIG.teamSizeLabel}
      />

      {/* Who We Are & Story */}
      <section className="border-b border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] py-16 md:py-24">
        <div className="section-padding grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-brown-gold)] uppercase">
              Our Story &amp; Philosophy
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[var(--color-dark-brown)]">
              Substance over appearance.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted-brown)]">
              {COMPANY_FOUNDATION.startingPhilosophy}
            </p>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-[var(--color-muted-brown)] lg:col-span-7">
            {COMPANY_FOUNDATION.overview.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <div className="rounded-xl border border-[var(--color-soft-sand)] bg-white p-5 text-sm text-[var(--color-dark-brown)]">
              <strong className="font-semibold">Our Organizational Approach:</strong>{" "}
              {COMPANY_FOUNDATION.structureNote}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="border-b border-[var(--color-soft-sand)] bg-white py-16 md:py-24">
        <div className="section-padding grid grid-cols-1 gap-8 md:grid-cols-2">
          <MotionReveal>
            <div className="h-full rounded-2xl border border-[var(--color-soft-sand)] bg-[var(--color-deep-brown)] p-8 text-white md:p-10">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-brown-gold)]/20 text-[var(--color-brown-gold)]">
                <Eye className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-brown-gold)] uppercase">
                Our Vision
              </p>
              <h2 className="mt-2 text-2xl font-bold">Where We Are Going</h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-soft-sand)]/90">
                {COMPANY_FOUNDATION.vision}
              </p>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.08}>
            <div className="h-full rounded-2xl border border-[var(--color-soft-sand)] bg-[var(--color-pale-gold)]/45 p-8 md:p-10">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-dark-brown)] text-white">
                <Target className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-brown-gold)] uppercase">
                Our Mission
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[var(--color-dark-brown)]">
                How We Work Every Day
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-muted-brown)]">
                {COMPANY_FOUNDATION.mission}
              </p>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* Core Values */}
      <section id="values" className="border-b border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] py-16 md:py-24">
        <div className="section-padding">
          <SectionHeading
            label="Core Values"
            title="Eight principles guiding how we build and collaborate"
            description="Every technical decision, customer conversation, and creative deliverable is grounded in these shared standards."
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_VALUES.map((value, idx) => (
              <div
                key={value.title}
                className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6"
              >
                <span className="font-mono text-xs font-semibold text-[var(--color-brown-gold)]">
                  0{idx + 1}
                </span>
                <h3 className="mt-2 text-lg font-bold text-[var(--color-dark-brown)]">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-brown)]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Team (Exact 5 roles) */}
      <section id="team" className="bg-white py-16 md:py-24">
        <div className="section-padding">
          <SectionHeading
            label="Founding Team"
            title="Five founding roles working side by side"
            description="Eagle Technology is led and built by a five-person founding team. Individual names and portraits are shown as honest placeholders until confirmed for public release."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FOUNDING_TEAM.map((member) => (
              <article
                key={member.id}
                className="flex h-full flex-col justify-between rounded-2xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-7"
              >
                <div>
                  {/* Honest Portrait Placeholder */}
                  <div className="mb-5 flex items-center gap-4">
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-[var(--color-brown-gold)] bg-[var(--color-pale-gold)]/70 text-[var(--color-dark-brown)]"
                      aria-label={member.portraitPlaceholder}
                    >
                      <UserRound className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="inline-block rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-brown-gold)] border border-[var(--color-soft-sand)]">
                        Role 0{member.order}
                      </span>
                      <p className="mt-1 text-xs font-medium text-[var(--color-muted-brown)]">
                        {member.placeholderName}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[var(--color-dark-brown)]">
                    {member.roleTitle}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-[var(--color-brown-gold)]">
                    {member.primaryResponsibility}
                  </p>

                  <ul className="mt-4 space-y-2 text-sm text-[var(--color-muted-brown)]">
                    {member.responsibilities.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brown-gold)]"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {member.earlyStageNote && (
                  <p className="mt-5 border-t border-[var(--color-soft-sand)] pt-4 text-xs leading-relaxed text-[var(--color-muted-brown)]">
                    {member.earlyStageNote}
                  </p>
                )}
              </article>
            ))}

            {/* Structure Note Card */}
            <div className="flex flex-col justify-between rounded-2xl border border-[var(--color-dark-brown)]/15 bg-[var(--color-deep-brown)] p-7 text-white">
              <div>
                <Compass className="mb-4 h-7 w-7 text-[var(--color-brown-gold)]" aria-hidden="true" />
                <h3 className="text-xl font-bold">Intentional Team Structure</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-soft-sand)]/85">
                  At this stage, we operate as one collaborative five-person founding unit
                  rather than separate departments. Each member owns a primary discipline
                  while supporting shared company goals.
                </p>
              </div>
              <div className="mt-6">
                <Button href="/contact" size="sm">
                  Connect With Our Team
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
