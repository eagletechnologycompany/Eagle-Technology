"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ROLE_LIST } from "@/lib/dashboard-constants";
import { StatusBadge } from "./StatusBadge";
import { EmptyState } from "./DashboardStates";

export interface CalendarEventItem {
  id: string;
  date: string;
  title: string;
  category: "Task Due" | "Milestone" | "Meeting" | "Decision Review";
  projectId?: string | null;
  projectName?: string | null;
  ownerId?: string | null;
  status: string;
  href: string;
}

export function CalendarClient({
  events,
  projects,
}: {
  events: CalendarEventItem[];
  projects: Array<{ id: string; name: string }>;
}) {
  const [view, setView] = useState<"month" | "week" | "upcoming">("month");
  const [projectFilter, setProjectFilter] = useState("");
  const [memberFilter, setMemberFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const today = new Date();
  const [monthCursor, setMonthCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const filtered = useMemo(() => {
    return events.filter((ev) => {
      if (projectFilter && ev.projectId !== projectFilter) return false;
      if (memberFilter && ev.ownerId !== memberFilter) return false;
      if (categoryFilter && ev.category !== categoryFilter) return false;
      return true;
    });
  }, [events, projectFilter, memberFilter, categoryFilter]);

  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const firstDayOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weekStart = useMemo(() => {
    const d = new Date();
    const diff = d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }, []);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  return (
    <div className="space-y-6">
      {/* Header + Controls */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--color-soft-sand)] bg-white p-5 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-dark-brown)]">
            Calendar &amp; Milestones
          </h2>
          <p className="text-xs text-[var(--color-muted-brown)]">
            Internal schedule for task due dates, project milestones, team meetings, and
            decision review dates.
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-1 text-xs">
          {(["month", "week", "upcoming"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded-lg px-3 py-1.5 font-semibold capitalize ${
                view === v
                  ? "bg-[var(--color-dark-brown)] text-white"
                  : "text-[var(--color-muted-brown)]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[var(--color-soft-sand)] bg-white p-4 sm:grid-cols-3 text-xs">
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          aria-label="Filter calendar by project"
          className="rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={memberFilter}
          onChange={(e) => setMemberFilter(e.target.value)}
          aria-label="Filter calendar by role"
          className="rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
        >
          <option value="">All Founding Roles</option>
          {ROLE_LIST.map((r) => (
            <option key={r.id} value={`usr_${r.id}`}>
              {r.shortTitle}
            </option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter calendar by event type"
          className="rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
        >
          <option value="">All Event Types</option>
          <option value="Task Due">Task Due Dates</option>
          <option value="Milestone">Milestones</option>
          <option value="Meeting">Meetings</option>
          <option value="Decision Review">Decision Reviews</option>
        </select>
      </div>

      {view === "month" ? (
        <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-[var(--color-dark-brown)]">
              {monthCursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h3>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setMonthCursor(new Date(year, month - 1, 1))}
                className="rounded-lg border border-[var(--color-soft-sand)] px-3 py-1.5 font-semibold"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setMonthCursor(new Date(year, month + 1, 1))}
                className="rounded-lg border border-[var(--color-soft-sand)] px-3 py-1.5 font-semibold"
              >
                Next
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-semibold text-[var(--color-muted-brown)] mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDayOffset }).map((_, idx) => (
              <div key={`empty-${idx}`} className="min-h-24 rounded-xl bg-[var(--color-warm-off-white)]/40" />
            ))}
            {Array.from({ length: daysInMonth }, (_, idx) => {
              const dayNum = idx + 1;
              const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const dayEvents = filtered.filter((e) => e.date === iso);
              return (
                <div
                  key={iso}
                  className="min-h-24 rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-2 text-xs"
                >
                  <span className="font-semibold text-[var(--color-dark-brown)]">{dayNum}</span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <Link
                        key={ev.id}
                        href={ev.href}
                        className="block truncate rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-dark-brown)] border border-[var(--color-soft-sand)] hover:border-[var(--color-brown-gold)]"
                        title={ev.title}
                      >
                        {ev.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : view === "week" ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
          {weekDays.map((iso) => {
            const dayEvents = filtered.filter((e) => e.date === iso);
            return (
              <div
                key={iso}
                className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-4 text-xs"
              >
                <p className="font-bold text-[var(--color-dark-brown)]">{iso}</p>
                <div className="mt-3 space-y-2">
                  {dayEvents.length === 0 ? (
                    <p className="text-[11px] text-[var(--color-muted-brown)]">No items</p>
                  ) : (
                    dayEvents.map((ev) => (
                      <Link
                        key={ev.id}
                        href={ev.href}
                        className="block rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-2"
                      >
                        <p className="font-semibold text-[var(--color-dark-brown)]">{ev.title}</p>
                        <p className="text-[10px] text-[var(--color-brown-gold)]">{ev.category}</p>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No scheduled events match these filters." />
      ) : (
        <div className="space-y-3 rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6">
          {filtered.map((ev) => (
            <Link
              key={ev.id}
              href={ev.href}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-4 py-3 text-xs hover:border-[var(--color-brown-gold)]"
            >
              <div>
                <span className="font-mono font-semibold text-[var(--color-brown-gold)]">
                  {ev.date}
                </span>
                <span className="ml-3 font-bold text-[var(--color-dark-brown)]">
                  {ev.title}
                </span>
                <span className="ml-2 text-[var(--color-muted-brown)]">· {ev.category}</span>
              </div>
              <StatusBadge value={ev.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
