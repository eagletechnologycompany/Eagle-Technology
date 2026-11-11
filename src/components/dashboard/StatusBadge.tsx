import React from "react";

const TONE_MAP: Record<string, string> = {
  // Task & project statuses
  Backlog: "bg-stone-100 text-stone-700 border-stone-200",
  Ready: "bg-amber-50 text-amber-900 border-amber-200",
  "In Progress": "bg-[var(--color-pale-gold)] text-[var(--color-dark-brown)] border-[var(--color-brown-gold)]/40",
  "In Review": "bg-sky-50 text-sky-900 border-sky-200",
  Blocked: "bg-red-50 text-red-800 border-red-200",
  Completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Archived: "bg-stone-100 text-stone-500 border-stone-200",
  // Project extra statuses
  Idea: "bg-stone-100 text-stone-700 border-stone-200",
  Discovery: "bg-amber-50 text-amber-900 border-amber-200",
  Planning: "bg-[var(--color-pale-gold)] text-[var(--color-dark-brown)] border-[var(--color-soft-sand)]",
  Active: "bg-emerald-50 text-emerald-800 border-emerald-200",
  "On Hold": "bg-orange-50 text-orange-800 border-orange-200",
  Delivered: "bg-emerald-100 text-emerald-900 border-emerald-300",
  // Priorities
  Low: "bg-stone-100 text-stone-700 border-stone-200",
  Normal: "bg-[var(--color-warm-off-white)] text-[var(--color-dark-brown)] border-[var(--color-soft-sand)]",
  High: "bg-amber-100 text-amber-900 border-amber-300",
  Urgent: "bg-red-100 text-red-900 border-red-300",
  // Goals & Decisions
  "Not started": "bg-stone-100 text-stone-700 border-stone-200",
  "In progress": "bg-[var(--color-pale-gold)] text-[var(--color-dark-brown)] border-[var(--color-brown-gold)]/40",
  "At risk": "bg-red-50 text-red-800 border-red-200",
  Proposed: "bg-amber-50 text-amber-900 border-amber-200",
  "Under discussion": "bg-sky-50 text-sky-900 border-sky-200",
  Approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Rejected: "bg-red-50 text-red-800 border-red-200",
  Deferred: "bg-stone-100 text-stone-700 border-stone-200",
  Superseded: "bg-stone-100 text-stone-500 border-stone-200",
};

export function StatusBadge({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const tone =
    TONE_MAP[value] ??
    "bg-[var(--color-warm-off-white)] text-[var(--color-dark-brown)] border-[var(--color-soft-sand)]";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${tone} ${className}`}
    >
      {value}
    </span>
  );
}
