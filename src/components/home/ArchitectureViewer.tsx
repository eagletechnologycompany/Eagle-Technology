"use client";

import React, { useState } from "react";

const SYSTEMS = [
  {
    id: "web",
    title: "Web platforms",
    summary: "How a customer-facing product is separated so design, application logic, and data can change independently.",
    layers: [
      { name: "Experience", detail: "Public site, portal, and founder workspace share one design system." },
      { name: "Application", detail: "Next.js routes, session checks, and role-scoped pages." },
      { name: "Data", detail: "SQLite with explicit migrations for accounts, projects, and reviews." },
      { name: "Delivery", detail: "Milestone review and revision requests stay in the customer portal." },
    ],
  },
  {
    id: "ai",
    title: "AI pipelines",
    summary: "A planning model for automation work. Production model hosting is not live.",
    layers: [
      { name: "Ingest", detail: "Structured briefs and files enter a defined contract." },
      { name: "Analyze", detail: "Requirements are classified before any generation step." },
      { name: "Transform", detail: "Outputs are reviewed by people before they become deliverables." },
      { name: "Deploy", detail: "Accepted work is released only after milestone approval." },
    ],
  },
  {
    id: "cloud",
    title: "Cloud systems",
    summary: "Target shape for later hosting. Current runtime is this application and a local database.",
    layers: [
      { name: "Edge", detail: "Public pages stay cacheable. Private routes stay authenticated." },
      { name: "Services", detail: "Auth, inquiries, deliverables, and sandbox keys are separate concerns." },
      { name: "Secrets", detail: "Passwords are scrypt-hashed. Sessions use HTTP-only cookies." },
      { name: "Observe", detail: "Audit events exist for sign-in. External monitoring is [Integration pending]." },
    ],
  },
] as const;

export function ArchitectureViewer() {
  const [activeId, setActiveId] = useState<(typeof SYSTEMS)[number]["id"]>("web");
  const [layerIndex, setLayerIndex] = useState(0);
  const active = SYSTEMS.find((system) => system.id === activeId) ?? SYSTEMS[0];
  const layer = active.layers[layerIndex] ?? active.layers[0];

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-black/25 p-5 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-brown-gold)] uppercase">
            Architecture viewer
          </p>
          <h4 className="mt-1 text-lg font-bold text-white">How Eagle structures a system</h4>
        </div>
        <p className="max-w-sm text-[11px] leading-relaxed text-[var(--color-soft-sand)]/70">
          Illustrative planning model. Live multi-region cloud and a published SDK are [Coming soon].
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Architecture systems">
        {SYSTEMS.map((system) => {
          const selected = system.id === active.id;
          return (
            <button
              key={system.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => {
                setActiveId(system.id);
                setLayerIndex(0);
              }}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                selected
                  ? "bg-[var(--color-brown-gold)] text-white"
                  : "bg-white/5 text-[var(--color-soft-sand)] hover:bg-white/10"
              }`}
            >
              {system.title}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-[var(--color-soft-sand)]/85">{active.summary}</p>

      <ol className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        {active.layers.map((item, index) => {
          const selected = index === layerIndex;
          return (
            <li key={item.name}>
              <button
                type="button"
                onClick={() => setLayerIndex(index)}
                className={`flex h-full w-full flex-col rounded-xl border px-3 py-3 text-left transition-colors ${
                  selected
                    ? "border-[var(--color-brown-gold)] bg-[var(--color-brown-gold)]/15"
                    : "border-white/10 bg-white/5 hover:border-white/25"
                }`}
              >
                <span className="font-mono text-[10px] text-[var(--color-brown-gold)]">0{index + 1}</span>
                <span className="mt-1 text-sm font-semibold text-white">{item.name}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <p className="text-xs font-semibold text-white">{layer.name}</p>
        <p className="mt-1 text-xs leading-relaxed text-[var(--color-soft-sand)]/80">{layer.detail}</p>
      </div>
    </div>
  );
}
