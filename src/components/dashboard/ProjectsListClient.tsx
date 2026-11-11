"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, X, ArrowRight } from "lucide-react";
import {
  Permission,
  PROJECT_PHASES,
  PROJECT_STATUSES,
  ROLE_LIST,
} from "@/lib/dashboard-constants";
import { StatusBadge } from "./StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "./DashboardStates";

interface ProjectItem {
  id: string;
  name: string;
  objective: string;
  status: string;
  phase: string;
  lead_label: string;
  target_date: string;
  task_count: number;
  completed_task_count: number;
  milestone_count: number;
  is_demo: number;
}

export function ProjectsListClient({
  permissions,
  initialNewOpen,
}: {
  permissions: Permission[];
  initialNewOpen?: boolean;
}) {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(Boolean(initialNewOpen));

  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [problem, setProblem] = useState("");
  const [description, setDescription] = useState("");
  const [phase, setPhase] = useState<string>("Identify");
  const [status, setStatus] = useState<string>("Discovery");
  const [leadUserId, setLeadUserId] = useState("usr_ceo");
  const [targetDate, setTargetDate] = useState("");
  const [creating, setCreating] = useState(false);

  const canCreate = permissions.includes("project.create");

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/projects");
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Unable to load projects.");
      } else {
        setProjects(data.projects);
      }
    } catch {
      setError("Network error loading projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/dashboard/projects")
      .then((r) => r.json().then((data) => ({ ok: r.ok && data.ok, data })))
      .then(({ ok, data }) => {
        if (cancelled) return;
        if (!ok) {
          setError(data.error || "Unable to load projects.");
        } else {
          setProjects(data.projects);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Network error loading projects.");
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
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          objective,
          problemOrOpportunity: problem,
          description,
          phase,
          status,
          leadUserId,
          targetDate,
          memberIds: ROLE_LIST.map((r) => `usr_${r.id}`),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to create project.");
      } else {
        setCreateOpen(false);
        setName("");
        setObjective("");
        setProblem("");
        setDescription("");
        await loadProjects();
      }
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--color-soft-sand)] bg-white p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-dark-brown)]">
            Company Projects
          </h2>
          <p className="text-xs text-[var(--color-muted-brown)]">
            Structured around Eagle&apos;s 8-phase delivery process: Identify → Define →
            Plan → Assign → Execute → Review → Deliver → Evaluate.
          </p>
        </div>

        {canCreate && (
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brown-gold)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--accent-hover)]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Project
          </button>
        )}
      </div>

      {error && <ErrorState message={error} onRetry={loadProjects} />}

      {loading ? (
        <LoadingState label="Loading projects..." />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects are active."
          description="Create a company project when discovery and scope are ready."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/projects/${p.id}`}
              className="group flex flex-col justify-between rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-[var(--color-pale-gold)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-dark-brown)]">
                    Phase: {p.phase}
                  </span>
                  <div className="flex items-center gap-2">
                    {p.is_demo === 1 && (
                      <span className="rounded-full border border-[var(--color-brown-gold)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-brown-gold)]">
                        DEMO
                      </span>
                    )}
                    <StatusBadge value={p.status} />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[var(--color-dark-brown)] group-hover:text-[var(--color-brown-gold)]">
                  {p.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted-brown)]">
                  {p.objective}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[var(--color-soft-sand)] pt-4 text-xs text-[var(--color-muted-brown)]">
                <span>
                  Lead: <strong className="text-[var(--color-dark-brown)]">{p.lead_label}</strong>
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-[var(--color-brown-gold)]">
                  {p.completed_task_count}/{p.task_count} tasks · {p.milestone_count} milestones
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {createOpen && canCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--color-dark-brown)]">
                Create Project
              </h3>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-[var(--color-muted-brown)]" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                  Objective *
                </label>
                <input
                  type="text"
                  required
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                  Problem or Opportunity
                </label>
                <textarea
                  rows={2}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                    Initial Phase
                  </label>
                  <select
                    value={phase}
                    onChange={(e) => setPhase(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                  >
                    {PROJECT_PHASES.map((ph) => (
                      <option key={ph} value={ph}>
                        {ph}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                  >
                    {PROJECT_STATUSES.filter((s) => s !== "Archived").map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                    Project Lead
                  </label>
                  <select
                    value={leadUserId}
                    onChange={(e) => setLeadUserId(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                  >
                    {ROLE_LIST.map((r) => (
                      <option key={r.id} value={`usr_${r.id}`}>
                        {r.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="rounded-lg border border-[var(--color-soft-sand)] px-4 py-2 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-lg bg-[var(--color-brown-gold)] px-4 py-2 font-semibold text-white"
                >
                  {creating ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
