"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { GOAL_STATUSES, Permission } from "@/lib/dashboard-constants";
import { StatusBadge } from "./StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "./DashboardStates";

interface GoalRow {
  id: string;
  title: string;
  description: string;
  owner_label: string | null;
  time_period: string;
  status: string;
  progress: number;
  notes: string;
  review_date: string | null;
}

export function GoalsClient({ permissions }: { permissions: Permission[] }) {
  const [goals, setGoals] = useState<GoalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timePeriod, setTimePeriod] = useState("Initial 90-Day Roadmap");

  const canCreate = permissions.includes("goal.create");
  const canEdit = permissions.includes("goal.edit");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/goals");
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Unable to load goals.");
      } else {
        setGoals(data.goals);
      }
    } catch {
      setError("Network error loading goals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/dashboard/goals")
      .then((r) => r.json().then((data) => ({ ok: r.ok && data.ok, data })))
      .then(({ ok, data }) => {
        if (cancelled) return;
        if (!ok) {
          setError(data.error || "Unable to load goals.");
        } else {
          setGoals(data.goals);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Network error loading goals.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/dashboard/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, timePeriod, status: "Not started", progress: 0 }),
    });
    if (res.ok) {
      setCreateOpen(false);
      setTitle("");
      setDescription("");
      await load();
    }
  }

  async function handleUpdate(id: string, status: string, progress: number) {
    const res = await fetch("/api/dashboard/goals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, progress }),
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Unable to update goal.");
      return;
    }
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--color-soft-sand)] bg-white p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-dark-brown)]">
            Company Goals &amp; Roadmap
          </h2>
          <p className="text-xs text-[var(--color-muted-brown)]">
            Initial blueprint focus areas start at 0% (Not started) until founders add
            confirmed targets and measurable milestones.
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brown-gold)] px-4 py-2 text-xs font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> New Goal
          </button>
        )}
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {loading ? (
        <LoadingState label="Loading goals..." />
      ) : goals.length === 0 ? (
        <EmptyState title="No company goals defined yet." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {goals.map((g) => (
            <article
              key={g.id}
              className="flex flex-col justify-between rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 text-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold text-[var(--color-brown-gold)] uppercase">
                    {g.time_period}
                  </span>
                  <StatusBadge value={g.status} />
                </div>
                <h3 className="mt-2 text-base font-bold text-[var(--color-dark-brown)]">
                  {g.title}
                </h3>
                <p className="mt-1.5 leading-relaxed text-[var(--color-muted-brown)]">
                  {g.description}
                </p>
              </div>

              <div className="mt-4 border-t border-[var(--color-soft-sand)] pt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-[var(--color-dark-brown)]">
                    Progress: {g.progress}%
                  </span>
                  <span className="text-[var(--color-muted-brown)]">
                    Owner: {g.owner_label || "Founder & CEO"}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-soft-sand)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-brown-gold)]"
                    style={{ width: `${g.progress}%` }}
                  />
                </div>

                {canEdit && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <select
                      value={g.status}
                      onChange={(e) => handleUpdate(g.id, e.target.value, g.progress)}
                      aria-label={`Status for ${g.title}`}
                      className="rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-2.5 py-1.5"
                    >
                      {GOAL_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={5}
                      value={g.progress}
                      onChange={(e) =>
                        handleUpdate(g.id, g.status, Number(e.target.value) || 0)
                      }
                      aria-label={`Progress percentage for ${g.title}`}
                      className="w-20 rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-2.5 py-1.5"
                    />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {createOpen && canCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--color-dark-brown)]">
                Create Company Goal
              </h3>
              <button type="button" onClick={() => setCreateOpen(false)}>
                <X className="h-5 w-5 text-[var(--color-muted-brown)]" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="mb-1 block font-semibold">Goal Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold">Time Period</label>
                <input
                  type="text"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="rounded-lg border border-[var(--color-soft-sand)] px-4 py-2 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--color-brown-gold)] px-4 py-2 font-semibold text-white"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
