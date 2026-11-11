"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Users } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "./DashboardStates";

interface WorkloadMember {
  id: string;
  role_id: string;
  role_title: string;
  short_title: string;
  placeholder_name: string;
  responsibilities_json: string;
  openTaskCount: number;
  blockedCount: number;
  overdueCount: number;
  projectCount: number;
  openTasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    due_date: string;
    blocker_reason: string;
  }>;
  currentCheckIn: {
    completed_last_week: string;
    planned_this_week: string;
    current_blocker: string;
    support_needed: string;
    important_update: string;
    confidence_level: string;
    updated_at: string;
  } | null;
}

interface CheckInRow {
  id: string;
  week_start: string;
  role_id: string;
  short_title: string;
  display_label: string;
  completed_last_week: string;
  planned_this_week: string;
  current_blocker: string;
  support_needed: string;
  important_update: string;
  confidence_level: string;
  updated_at: string;
}

export function TeamClient({ currentUserId }: { currentUserId: string }) {
  const [weekStart, setWeekStart] = useState("");
  const [workload, setWorkload] = useState<WorkloadMember[]>([]);
  const [checkIns, setCheckIns] = useState<CheckInRow[]>([]);
  const [unassigned, setUnassigned] = useState<
    Array<{ id: string; title: string; status: string; priority: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedNotice, setSavedNotice] = useState("");

  const [completedLastWeek, setCompletedLastWeek] = useState("");
  const [plannedThisWeek, setPlannedThisWeek] = useState("");
  const [currentBlocker, setCurrentBlocker] = useState("");
  const [supportNeeded, setSupportNeeded] = useState("");
  const [importantUpdate, setImportantUpdate] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState("Steady");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/check-ins");
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Unable to load team data.");
      } else {
        setWeekStart(data.weekStart);
        setWorkload(data.workload);
        setCheckIns(data.checkIns);
        setUnassigned(data.unassignedTasks);

        const mine = (data.workload as WorkloadMember[]).find(
          (w) => w.id === currentUserId
        )?.currentCheckIn;
        if (mine) {
          setCompletedLastWeek(mine.completed_last_week);
          setPlannedThisWeek(mine.planned_this_week);
          setCurrentBlocker(mine.current_blocker);
          setSupportNeeded(mine.support_needed);
          setImportantUpdate(mine.important_update);
          setConfidenceLevel(mine.confidence_level);
        }
      }
    } catch {
      setError("Network error loading team workspace.");
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/dashboard/check-ins")
      .then((r) => r.json().then((data) => ({ ok: r.ok && data.ok, data })))
      .then(({ ok, data }) => {
        if (cancelled) return;
        if (!ok) {
          setError(data.error || "Unable to load team data.");
        } else {
          setWeekStart(data.weekStart);
          setWorkload(data.workload);
          setCheckIns(data.checkIns);
          setUnassigned(data.unassignedTasks);

          const mine = (data.workload as WorkloadMember[]).find(
            (w) => w.id === currentUserId
          )?.currentCheckIn;
          if (mine) {
            setCompletedLastWeek(mine.completed_last_week);
            setPlannedThisWeek(mine.planned_this_week);
            setCurrentBlocker(mine.current_blocker);
            setSupportNeeded(mine.support_needed);
            setImportantUpdate(mine.important_update);
            setConfidenceLevel(mine.confidence_level);
          }
        }
      })
      .catch(() => {
        if (!cancelled) setError("Network error loading team workspace.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [currentUserId]);

  async function handleSubmitCheckIn(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSavedNotice("");
    try {
      const res = await fetch("/api/dashboard/check-ins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekStart,
          completedLastWeek,
          plannedThisWeek,
          currentBlocker,
          supportNeeded,
          importantUpdate,
          confidenceLevel,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to submit check-in.");
      } else {
        setSavedNotice("Weekly check-in saved.");
        await load();
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState label="Loading founding team and workload..." />;
  if (error && workload.length === 0) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <div className="space-y-8">
      {/* Unassigned / Workload Alert Banner */}
      {unassigned.length > 0 && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950">
          <p className="flex items-center gap-2 font-bold">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            Unassigned Open Work ({unassigned.length})
          </p>
          <p className="mt-1">
            The following tasks have no clear owner:{" "}
            {unassigned.map((t) => t.title).join(", ")}.{" "}
            <Link href="/dashboard/tasks" className="font-semibold underline">
              Assign in All Tasks
            </Link>
          </p>
        </div>
      )}

      {/* Five Founding Roles & Workload */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-dark-brown)]">
              Five Founding Roles &amp; Workload
            </h2>
            <p className="text-xs text-[var(--color-muted-brown)]">
              Role-based profiles until founders confirm personal names and portraits.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-soft-sand)] bg-white px-3 py-1 text-xs font-semibold text-[var(--color-dark-brown)]">
            <Users className="h-3.5 w-3.5 text-[var(--color-brown-gold)]" />
            5 Founding Roles
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {workload.map((m) => {
            let responsibilities: string[] = [];
            try {
              responsibilities = JSON.parse(m.responsibilities_json);
            } catch {
              responsibilities = [];
            }
            const overloaded = m.openTaskCount >= 5;

            return (
              <article
                key={m.id}
                className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--color-soft-sand)] pb-4">
                  <div>
                    <p className="text-[11px] font-semibold text-[var(--color-brown-gold)] uppercase">
                      {m.placeholder_name}
                    </p>
                    <h3 className="mt-0.5 text-lg font-bold text-[var(--color-dark-brown)]">
                      {m.role_title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-semibold ${
                        overloaded
                          ? "border-amber-300 bg-amber-50 text-amber-900"
                          : "border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] text-[var(--color-dark-brown)]"
                      }`}
                    >
                      {m.openTaskCount} open {overloaded ? "(High load)" : ""}
                    </span>
                    <span className="rounded-full border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-2.5 py-0.5 font-semibold text-[var(--color-muted-brown)]">
                      {m.projectCount} projects
                    </span>
                    {m.blockedCount > 0 && (
                      <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 font-semibold text-red-800">
                        {m.blockedCount} blocked
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[11px] font-semibold text-[var(--color-muted-brown)] uppercase">
                    Approved Responsibilities
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {responsibilities.map((r) => (
                      <span
                        key={r}
                        className="rounded-md border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-2 py-0.5 text-[11px] text-[var(--color-deep-brown)]"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 border-t border-[var(--color-soft-sand)] pt-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--color-dark-brown)]">
                      Weekly Check-in ({weekStart})
                    </span>
                    <StatusBadge
                      value={m.currentCheckIn ? m.currentCheckIn.confidence_level : "Pending"}
                    />
                  </div>
                  {m.openTasks.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {m.openTasks.slice(0, 3).map((t) => (
                        <li key={t.id} className="flex items-center justify-between text-[11px]">
                          <Link
                            href={`/dashboard/tasks?task=${t.id}`}
                            className="truncate text-[var(--color-dark-brown)] hover:underline"
                          >
                            • {t.title}
                          </Link>
                          <StatusBadge value={t.status} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Weekly Check-In Form & Team Check-Ins */}
      <section id="checkin" className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 lg:col-span-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--color-brown-gold)] uppercase">
            Week of {weekStart}
          </p>
          <h3 className="mt-1 text-lg font-bold text-[var(--color-dark-brown)]">
            Submit Weekly Check-In
          </h3>
          <p className="mt-1 text-xs text-[var(--color-muted-brown)]">
            Lightweight weekly coordination aligned with Eagle&apos;s team meeting structure.
          </p>

          {savedNotice && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-[var(--color-brown-gold)]/40 bg-[var(--color-pale-gold)]/60 p-3 text-xs font-semibold text-[var(--color-dark-brown)]">
              <CheckCircle2 className="h-4 w-4 text-[var(--color-brown-gold)]" />
              {savedNotice}
            </div>
          )}
          {error && <div className="mt-3"><ErrorState message={error} /></div>}

          <form onSubmit={handleSubmitCheckIn} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                Completed Last Week *
              </label>
              <textarea
                rows={2}
                required
                value={completedLastWeek}
                onChange={(e) => setCompletedLastWeek(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-2.5"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                Planned This Week *
              </label>
              <textarea
                rows={2}
                required
                value={plannedThisWeek}
                onChange={(e) => setPlannedThisWeek(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-2.5"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                Current Blocker
              </label>
              <input
                type="text"
                value={currentBlocker}
                onChange={(e) => setCurrentBlocker(e.target.value)}
                placeholder="Any blocker or dependency?"
                className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                Support Needed
              </label>
              <input
                type="text"
                value={supportNeeded}
                onChange={(e) => setSupportNeeded(e.target.value)}
                placeholder="Decisions or collaboration needed from founders"
                className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                Important Update
              </label>
              <input
                type="text"
                value={importantUpdate}
                onChange={(e) => setImportantUpdate(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                Confidence Level
              </label>
              <select
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
              >
                <option value="High">High — On track</option>
                <option value="Steady">Steady — Progressing</option>
                <option value="Needs Support">Needs Support — At risk</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-[var(--color-brown-gold)] px-4 py-2.5 font-semibold text-white hover:bg-[var(--accent-hover)] disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save Weekly Check-In"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 lg:col-span-7">
          <h3 className="mb-4 text-lg font-bold text-[var(--color-dark-brown)]">
            Team Weekly Check-In Log
          </h3>
          {checkIns.length === 0 ? (
            <EmptyState
              title="No weekly check-in has been submitted."
              description="Founders can submit their weekly check-in on the left to coordinate priorities and blockers."
            />
          ) : (
            <div className="space-y-4">
              {checkIns.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-4 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-[var(--color-dark-brown)]">
                      {c.display_label} · Week of {c.week_start}
                    </span>
                    <StatusBadge value={c.confidence_level} />
                  </div>
                  <p className="mt-2">
                    <strong className="text-[var(--color-dark-brown)]">Completed:</strong>{" "}
                    {c.completed_last_week}
                  </p>
                  <p className="mt-1">
                    <strong className="text-[var(--color-dark-brown)]">Planned:</strong>{" "}
                    {c.planned_this_week}
                  </p>
                  {c.current_blocker && (
                    <p className="mt-1 text-red-800">
                      <strong>Blocker:</strong> {c.current_blocker}
                    </p>
                  )}
                  {c.support_needed && (
                    <p className="mt-1 text-[var(--color-muted-brown)]">
                      <strong>Support needed:</strong> {c.support_needed}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
