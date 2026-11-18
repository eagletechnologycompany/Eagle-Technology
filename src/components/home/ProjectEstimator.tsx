"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calculator,
  ArrowRight,
  Layers,
  CheckCircle2,
  Calendar,
  ShieldCheck,
} from "lucide-react";

const CAPABILITY_OPTIONS = [
  {
    id: "software",
    name: "Software Development",
    desc: "Custom full-stack web applications, business systems & APIs",
    baseMilestones: 4,
    timelineWeeks: "8-12 weeks",
  },
  {
    id: "web",
    name: "Web Platforms",
    desc: "High-performance digital platforms, responsive portals & CMS",
    baseMilestones: 3,
    timelineWeeks: "6-8 weeks",
  },
  {
    id: "design",
    name: "UI/UX & Creative Design",
    desc: "End-to-end user research, interactive design systems & brand assets",
    baseMilestones: 3,
    timelineWeeks: "4-6 weeks",
  },
  {
    id: "ai",
    name: "AI & Automation",
    desc: "Workflow automation, cognitive APIs, intelligent data ingestion",
    baseMilestones: 4,
    timelineWeeks: "8-10 weeks",
  },
  {
    id: "digital",
    name: "Digital Transformation",
    desc: "Modernization of legacy operations, cloud adoption & workflow audit",
    baseMilestones: 5,
    timelineWeeks: "10-14 weeks",
  },
];

const SCOPE_TIERS = [
  {
    id: "mvp",
    label: "Foundation & MVP",
    desc: "Core functionality, initial customer validation, rapid market launch",
    multiplier: 1,
  },
  {
    id: "growth",
    label: "Growth & Multi-Tenant",
    desc: "Advanced RBAC, customer portal, developer API hooks, scaling support",
    multiplier: 1.4,
  },
  {
    id: "enterprise",
    label: "Enterprise & Ecosystem",
    desc: "High-throughput infrastructure, complete compliance, automated SLA",
    multiplier: 1.8,
  },
];

export function ProjectEstimator() {
  const [selectedService, setSelectedService] = useState(CAPABILITY_OPTIONS[0]);
  const [selectedScope, setSelectedScope] = useState(SCOPE_TIERS[0]);
  const [includeSandbox, setIncludeSandbox] = useState(true);

  const totalMilestones = Math.round(selectedService.baseMilestones * selectedScope.multiplier);

  const contactUrl = `/contact?service=${selectedService.id}&tier=${selectedScope.id}&milestones=${totalMilestones}`;

  return (
    <div className="rounded-3xl border border-[var(--color-soft-sand)] bg-white p-6 shadow-xl md:p-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-soft-sand)] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-pale-gold)] px-3 py-1 text-xs font-semibold text-[var(--color-dark-brown)]">
            <Calculator className="h-3.5 w-3.5 text-[var(--color-brown-gold)]" />
            Interactive Discovery
          </div>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-dark-brown)] md:text-3xl">
            Project Scope &amp; Milestone Estimator
          </h3>
          <p className="mt-1 text-xs text-[var(--color-muted-brown)]">
            Configure your project parameters to preview structured milestone delivery phases and timeline estimates.
          </p>
        </div>

        <span className="text-xs font-semibold text-[var(--color-brown-gold)] bg-[var(--color-pale-gold)]/60 px-3 py-1.5 rounded-lg border border-[var(--color-soft-sand)]">
          Milestone-Based Governance (CR-04)
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Input Selection */}
        <div className="space-y-6 lg:col-span-7">
          {/* 1. Capability Area */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-dark-brown)] uppercase tracking-wider mb-2.5">
              1. Choose Capability Pillar
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {CAPABILITY_OPTIONS.map((cap) => {
                const isSelected = selectedService.id === cap.id;
                return (
                  <button
                    key={cap.id}
                    type="button"
                    onClick={() => setSelectedService(cap)}
                    className={`rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? "border-[var(--color-brown-gold)] bg-[var(--color-pale-gold)]/40 shadow-xs"
                        : "border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] hover:border-[var(--color-muted-brown)]/40 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--color-dark-brown)]">
                        {cap.name}
                      </span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-[var(--color-brown-gold)]" />}
                    </div>
                    <p className="mt-1 text-[11px] text-[var(--color-muted-brown)] leading-snug">
                      {cap.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Project Scope Tier */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-dark-brown)] uppercase tracking-wider mb-2.5">
              2. Select Scope &amp; Scale Tier
            </label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {SCOPE_TIERS.map((tier) => {
                const isSelected = selectedScope.id === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedScope(tier)}
                    className={`rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? "border-[var(--color-brown-gold)] bg-[var(--color-pale-gold)]/40 shadow-xs"
                        : "border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] hover:border-[var(--color-muted-brown)]/40 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--color-dark-brown)]">
                        {tier.label}
                      </span>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-brown-gold)]" />}
                    </div>
                    <p className="mt-1 text-[10px] text-[var(--color-muted-brown)] leading-snug">
                      {tier.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Developer Sandbox Checkbox */}
          <div className="flex items-center gap-3 rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-3">
            <input
              type="checkbox"
              id="sandboxCheckbox"
              checked={includeSandbox}
              onChange={(e) => setIncludeSandbox(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--color-soft-sand)] text-[var(--color-brown-gold)] focus:ring-[var(--color-brown-gold)]"
            />
            <label htmlFor="sandboxCheckbox" className="text-xs text-[var(--color-dark-brown)] cursor-pointer">
              <span className="font-semibold">Include Developer Platform &amp; Sandbox API Access</span>{" "}
              <span className="text-[var(--color-muted-brown)]">(Webhooks, testing keys, API SDK integration)</span>
            </label>
          </div>
        </div>

        {/* Right: Estimated Output Summary Card */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-6">
          <div>
            <span className="text-xs font-semibold text-[var(--color-brown-gold)] uppercase tracking-wider">
              Scope Summary Preview
            </span>
            <h4 className="mt-1 text-xl font-bold text-[var(--color-dark-brown)]">
              {selectedService.name}
            </h4>
            <p className="text-xs text-[var(--color-muted-brown)]">
              Tier: <strong className="text-[var(--color-dark-brown)]">{selectedScope.label}</strong>
            </p>

            {/* Metrics Breakdown */}
            <div className="mt-5 space-y-3 border-t border-[var(--color-soft-sand)] pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-[var(--color-muted-brown)]">
                  <Calendar className="h-4 w-4 text-[var(--color-brown-gold)]" />
                  Estimated Schedule
                </span>
                <span className="font-bold text-[var(--color-dark-brown)]">
                  {selectedService.timelineWeeks}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-[var(--color-muted-brown)]">
                  <Layers className="h-4 w-4 text-[var(--color-brown-gold)]" />
                  Review Milestones
                </span>
                <span className="font-bold text-[var(--color-dark-brown)]">
                  {totalMilestones} Structured Phases
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-[var(--color-muted-brown)]">
                  <ShieldCheck className="h-4 w-4 text-[var(--color-brown-gold)]" />
                  Payment Protocol
                </span>
                <span className="font-bold text-[var(--color-dark-brown)]">
                  Milestone-Gated
                </span>
              </div>
            </div>

            {/* Milestone Payment Schedule Breakdown */}
            <div className="mt-5 rounded-xl bg-white p-3.5 border border-[var(--color-soft-sand)] text-[11px] space-y-1.5">
              <p className="font-bold text-[var(--color-dark-brown)] mb-1">
                Standard Milestone Distribution:
              </p>
              <div className="flex justify-between text-[var(--color-muted-brown)]">
                <span>Phase 1: Architecture &amp; Discovery</span>
                <span className="font-semibold text-[var(--color-dark-brown)]">25%</span>
              </div>
              <div className="flex justify-between text-[var(--color-muted-brown)]">
                <span>Phase 2: Core Engineering &amp; UI</span>
                <span className="font-semibold text-[var(--color-dark-brown)]">40%</span>
              </div>
              <div className="flex justify-between text-[var(--color-muted-brown)]">
                <span>Phase 3: Integration &amp; Sandbox</span>
                <span className="font-semibold text-[var(--color-dark-brown)]">20%</span>
              </div>
              <div className="flex justify-between text-[var(--color-muted-brown)]">
                <span>Phase 4: Launch &amp; Deliverables Sign-off</span>
                <span className="font-semibold text-[var(--color-dark-brown)]">15%</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={contactUrl}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-brown-gold)] px-5 py-3 text-xs font-semibold text-white shadow-md transition-all hover:bg-[var(--accent-hover)]"
            >
              Start Project Inquiry With This Scope
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-2 text-center text-[10px] text-[var(--color-muted-brown)]">
              No immediate commitment. Pre-fills your project inquiry with configured parameters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
