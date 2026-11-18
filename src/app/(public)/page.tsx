import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { SolutionIcon } from "@/components/ui/SolutionIcon";
import { SITE_CONFIG } from "@/data/site";
import {
  COMPANY_FOUNDATION,
  VALUE_PROPOSITION,
  WORKING_PROCESS,
} from "@/data/company";
import { SOLUTION_AREAS } from "@/data/solutions";
import { WORK_DEMONSTRATIONS } from "@/data/work";
import { EagleEyeRadar } from "@/components/home/EagleEyeRadar";
import { TechPlayground } from "@/components/home/TechPlayground";
import { ProjectEstimator } from "@/components/home/ProjectEstimator";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section — Distinctive "Quiet Wow" Architectural Composition */}
      <section className="relative overflow-hidden border-b border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] py-20 md:py-28 lg:py-32">
        {/* Subtle Architectural Linework & Grid Background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(to right, #4B2E0F 1px, transparent 1px), linear-gradient(to bottom, #4B2E0F 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />

        {/* Ambient Warm Glow */}
        <div
          className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-[var(--color-brown-gold)]/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-[var(--color-dark-brown)]/5 blur-3xl"
          aria-hidden="true"
        />

        <div className="section-padding relative z-10 grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {/* Origin & Readiness Badge */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-soft-sand)] bg-white/90 px-4 py-1.5 text-xs font-semibold tracking-wide text-[var(--color-dark-brown)] shadow-xs backdrop-blur-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-brown-gold)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-brown-gold)]" />
              </span>
              <span>{SITE_CONFIG.origin}</span>
              <span className="text-[var(--color-soft-sand)]">|</span>
              <span className="text-[var(--color-muted-brown)]">{SITE_CONFIG.teamSizeLabel}</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-[var(--color-dark-brown)] sm:text-5xl lg:text-6xl lg:leading-[1.12]">
              {SITE_CONFIG.slogan}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-muted-brown)] md:text-xl">
              {SITE_CONFIG.heroSupportingMessage}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/contact" size="lg" className="group gap-2 shadow-md hover:shadow-lg transition-all duration-200">
                Start a Project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
              <Button href="/solutions" variant="outline" size="lg" className="hover:border-[var(--color-brown-gold)]">
                Explore Our Solutions
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 border-t border-[var(--color-soft-sand)] pt-8 sm:grid-cols-3">
              <div className="relative pl-3 border-l-2 border-[var(--color-brown-gold)]">
                <p className="text-xs font-semibold tracking-wider text-[var(--color-brown-gold)] uppercase">
                  Initial Market
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-dark-brown)]">
                  Ethiopia
                </p>
                <p className="text-[11px] text-[var(--color-muted-brown)]">Local needs, localized value</p>
              </div>
              <div className="relative pl-3 border-l-2 border-[var(--color-brown-gold)]/60">
                <p className="text-xs font-semibold tracking-wider text-[var(--color-brown-gold)] uppercase">
                  Long-Term Ambition
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-dark-brown)]">
                  Africa &amp; Global Markets
                </p>
                <p className="text-[11px] text-[var(--color-muted-brown)]">Scalable cloud &amp; platforms</p>
              </div>
              <div className="relative pl-3 border-l-2 border-[var(--color-brown-gold)]/30">
                <p className="text-xs font-semibold tracking-wider text-[var(--color-brown-gold)] uppercase">
                  Founding Structure
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-dark-brown)]">
                  5 Core Founding Roles
                </p>
                <p className="text-[11px] text-[var(--color-muted-brown)]">End-to-end technical delivery</p>
              </div>
            </div>
          </div>

          {/* Brand Emblem Showcase Card with Geometric Linework */}
          <div className="lg:col-span-5">
            <MotionReveal>
              <div className="relative rounded-2xl border border-[var(--color-brown-gold)]/30 bg-gradient-to-b from-[var(--color-deep-brown)] to-[#180e05] p-8 text-white shadow-2xl sm:p-10">
                {/* Decorative Linework Accents */}
                <div className="absolute top-3 left-3 h-3 w-3 border-t border-l border-[var(--color-brown-gold)]/50" />
                <div className="absolute top-3 right-3 h-3 w-3 border-t border-r border-[var(--color-brown-gold)]/50" />
                <div className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[var(--color-brown-gold)]/50" />
                <div className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[var(--color-brown-gold)]/50" />

                <div className="border-b border-[var(--color-muted-brown)]/30 pb-6 text-center">
                  <EagleEyeRadar />
                  <p className="mt-3 text-xs font-semibold tracking-[0.2em] text-[var(--color-brown-gold)] uppercase">
                    Official Brand Identity
                  </p>
                  <p className="mt-1.5 max-w-xs mx-auto text-xs text-[var(--color-soft-sand)]/80">
                    Vision, practical engineering, and human collaboration built on
                    substance rather than appearance.
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

      {/* 2. Short Company Introduction */}
      <section className="border-b border-[var(--color-soft-sand)] bg-white py-20 md:py-24">
        <div className="section-padding">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-brown-gold)] uppercase">
                Who We Are
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-[var(--color-dark-brown)] md:text-4xl">
                Built on practical engineering and honest growth.
              </h2>
            </div>
            <div className="space-y-4 text-base leading-relaxed text-[var(--color-muted-brown)] lg:col-span-7">
              {COMPANY_FOUNDATION.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-dark-brown)] transition-colors hover:text-[var(--color-brown-gold)]"
                >
                  Read our vision, mission, and founding team
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Services / Solutions */}
      <section className="border-b border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] py-20 md:py-24">
        <div className="section-padding">
          <SectionHeading
            label="Solutions"
            title="Focused capabilities for real operational needs"
            description="Our five proposed service areas combine software engineering, design clarity, and practical automation. Every engagement is scoped directly with our founding team."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SOLUTION_AREAS.map((solution, index) => (
              <MotionReveal key={solution.id} delay={index * 0.05}>
                <div className="flex h-full flex-col justify-between rounded-2xl border border-[var(--color-soft-sand)] bg-white p-7 transition-shadow hover:shadow-md">
                  <div>
                    <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-pale-gold)] text-[var(--color-dark-brown)]">
                      <SolutionIcon id={solution.id} />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-dark-brown)]">
                      {solution.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted-brown)]">
                      {solution.shortExplanation}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-[var(--color-soft-sand)] pt-4">
                    <Link
                      href={`/solutions#${solution.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brown-gold)] transition-colors hover:text-[var(--color-dark-brown)]"
                    >
                      Explore deliverables
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </MotionReveal>
            ))}

            {/* Honest Capability Card */}
            <MotionReveal delay={0.25}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-[var(--color-brown-gold)]/40 bg-[var(--color-pale-gold)]/45 p-7">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-brown-gold)] uppercase">
                    Future Direction
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-[var(--color-dark-brown)]">
                    Growing Into Products &amp; Platforms
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted-brown)]">
                    While Eagle begins with focused client software and digital services,
                    our long-term direction includes building proprietary products and
                    platforms as capacity matures.
                  </p>
                </div>
                <div className="mt-6">
                  <Button href="/solutions" variant="secondary" size="sm">
                    View Full Solutions Scope
                  </Button>
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* 4. Interactive Developer Platform & Engine Showcase */}
      <section className="border-b border-[var(--color-dark-brown)] bg-[var(--color-deep-brown)] py-20 md:py-28">
        <div className="section-padding">
          <TechPlayground />
        </div>
      </section>

      {/* 5. Why Choose Eagle */}
      <section className="border-b border-[var(--color-soft-sand)] bg-white py-20 md:py-24">
        <div className="section-padding">
          <SectionHeading
            label="Why Choose Eagle"
            title="Substance, clarity, and dependable execution"
            description="Our goal is not simply to write software, but to build solutions that are useful, understandable, and maintainable for the people who rely on them."
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUE_PROPOSITION.map((item, idx) => (
              <MotionReveal key={item.title} delay={idx * 0.04}>
                <div className="h-full rounded-2xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-6">
                  <CheckCircle2
                    className="mb-3 h-5 w-5 text-[var(--color-brown-gold)]"
                    aria-hidden="true"
                  />
                  <h3 className="text-lg font-bold text-[var(--color-dark-brown)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-brown)]">
                    {item.description}
                  </p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Projects / Early-Stage Demonstrations */}
      <section className="border-b border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] py-20 md:py-24">
        <div className="section-padding">
          <SectionHeading
            label="Our Work"
            title="Transparent early-stage demonstrations"
            description="In line with our commitment to integrity, we clearly distinguish internal builds and demonstration placeholders from future verified client case studies."
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {WORK_DEMONSTRATIONS.map((item, idx) => (
              <MotionReveal key={item.id} delay={idx * 0.05}>
                <article className="flex h-full flex-col justify-between rounded-2xl border border-[var(--color-soft-sand)] bg-white p-7">
                  <div>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-[var(--color-pale-gold)] px-3 py-1 text-[11px] font-semibold text-[var(--color-dark-brown)]">
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--color-dark-brown)]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-[var(--color-brown-gold)]">
                      {item.category}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted-brown)]">
                      {item.proposedSolution}
                    </p>
                  </div>
                  <div className="mt-5 border-t border-[var(--color-soft-sand)] pt-4">
                    <p className="text-xs text-[var(--color-muted-brown)]">
                      {item.outcomeNote}
                    </p>
                  </div>
                </article>
              </MotionReveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button href="/work" variant="outline">
              Explore Our Work &amp; Transparency Policy
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Working Process */}
      <section className="border-b border-[var(--color-soft-sand)] bg-white py-20 md:py-24">
        <div className="section-padding">
          <SectionHeading
            label="How We Work"
            title="A clear, disciplined eight-step delivery process"
            description="Every engagement follows a transparent structure from problem discovery to review and ongoing evaluation."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WORKING_PROCESS.map((stage) => (
              <div
                key={stage.step}
                className="rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-5"
              >
                <span className="font-mono text-xs font-bold text-[var(--color-brown-gold)]">
                  STEP {stage.step}
                </span>
                <h3 className="mt-2 text-base font-bold text-[var(--color-dark-brown)]">
                  {stage.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted-brown)]">
                  {stage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Connected Ecosystem: What Happens After You Partner With Us */}
      <section className="border-b border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] py-20 md:py-24">
        <div className="section-padding">
          <SectionHeading
            label="Digital Ecosystem"
            title="What happens after you partner with Eagle"
            description="Our relationship is not a static exchange of files. Every client gains access to the private Eagle Platform to track milestones, inspect deliverables, and integrate developer tools."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MotionReveal delay={0.05}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 shadow-xs">
                <div>
                  <span className="font-mono text-xs font-bold text-[var(--color-brown-gold)]">
                    PHASE 1
                  </span>
                  <h3 className="mt-2 text-base font-bold text-[var(--color-dark-brown)]">
                    Scoping &amp; Discovery
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted-brown)]">
                    Our founding team holds an in-depth alignment conversation to define your exact business challenge, target users, and deliverable constraints.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--color-soft-sand)] text-[11px] font-semibold text-[var(--color-dark-brown)]">
                  Founder direct consultation
                </div>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.1}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 shadow-xs">
                <div>
                  <span className="font-mono text-xs font-bold text-[var(--color-brown-gold)]">
                    PHASE 2
                  </span>
                  <h3 className="mt-2 text-base font-bold text-[var(--color-dark-brown)]">
                    Platform Onboarding
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted-brown)]">
                    You receive secure access credentials to the private Customer Portal where active sprints, team leads, and project timelines are published.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--color-soft-sand)] text-[11px] font-semibold text-[var(--color-dark-brown)]">
                  Dedicated customer workspace
                </div>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.15}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 shadow-xs">
                <div>
                  <span className="font-mono text-xs font-bold text-[var(--color-brown-gold)]">
                    PHASE 3
                  </span>
                  <h3 className="mt-2 text-base font-bold text-[var(--color-dark-brown)]">
                    Deliverable Sign-Off
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted-brown)]">
                    Review UI prototypes, architecture contracts, and code milestones directly. Approve deliverables or request revisions with full audit tracking.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--color-soft-sand)] text-[11px] font-semibold text-[var(--color-dark-brown)]">
                  Milestone-based acceptance
                </div>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.2}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 shadow-xs">
                <div>
                  <span className="font-mono text-xs font-bold text-[var(--color-brown-gold)]">
                    PHASE 4
                  </span>
                  <h3 className="mt-2 text-base font-bold text-[var(--color-dark-brown)]">
                    Developer APIs &amp; Growth
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted-brown)]">
                    Leverage the Developer Sandbox, API keys, webhook simulators, and SDK documentation to connect your systems and scale your operations.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--color-soft-sand)] text-[11px] font-semibold text-[var(--color-dark-brown)]">
                  Eagle Platform SDK &amp; APIs
                </div>
              </div>
            </MotionReveal>
          </div>

          <div className="mt-10 rounded-2xl border border-[var(--color-brown-gold)]/30 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brown-gold)]">
                Already Partnered with Eagle?
              </span>
              <h3 className="text-lg font-bold text-[var(--color-dark-brown)] mt-1">
                Access your Customer &amp; Partner Platform Portal
              </h3>
              <p className="text-xs text-[var(--color-muted-brown)] mt-1">
                Sign in to review active sprint deliverables, submit change inquiries, or test API sandbox keys.
              </p>
            </div>
            <Button href="/login" variant="secondary" size="md">
              Sign In to Platform
            </Button>
            <Button href="/signup" size="md" className="gap-1.5">
              Create Customer Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* 8. Interactive Project Discovery & Scoping Estimator */}
      <section className="border-b border-[var(--color-soft-sand)] bg-white py-20 md:py-24">
        <div className="section-padding max-w-6xl mx-auto">
          <ProjectEstimator />
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="bg-[var(--color-dark-brown)] py-20 text-white">
        <div className="section-padding flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-brown-gold)] uppercase">
              Start a Conversation
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
              Have a real-world challenge worth solving?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-soft-sand)]/85">
              Share what your organization is working on. Our founding team will review your
              goals honestly and discuss practical next steps.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button href="/contact" size="lg" className="gap-2">
              Start a Project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
