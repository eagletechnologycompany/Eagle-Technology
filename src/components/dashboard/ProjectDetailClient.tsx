"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Archive, CheckCircle2, Plus } from "lucide-react";
import {
  Permission,
  PROJECT_PHASES,
  PROJECT_STATUSES,
} from "@/lib/dashboard-constants";
import { StatusBadge } from "./StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "./DashboardStates";

const TABS = [
  "Summary",
  "Tasks",
  "Milestones",
  "Team",
  "Documents",
  "Decisions",
  "Risks",
  "Activity",
] as const;

type TabName = (typeof TABS)[number];

interface ProjectDetailData {
  project: {
    id: string;
    name: string;
    objective: string;
    problem_or_opportunity: string;
    description: string;
    lead_label: string;
    status: string;
    phase: string;
    start_date: string;
    target_date: string;
    notes: string;
    completion_review: string;
    is_demo: number;
  };
  tasks: Array<{ id: string; title: string; status: string; priority: string; owner_label: string | null; due_date: string }>;
  milestones: Array<{ id: string; title: string; description: string; due_date: string; status: string }>;
  risks: Array<{ id: string; title: string; severity: string; mitigation: string; status: string; owner_label: string | null }>;
  members: Array<{ user_id: string; display_label: string; short_title: string; project_role: string }>;
  documents: Array<{ id: string; file_name: string; category: string; version: string; access_level: string }>;
  decisions: Array<{ id: string; title: string; status: string; decision_date: string; owner_label: string }>;
  activity: Array<{ id: string; summary: string; actor_label: string | null; created_at: string }>;
}

export function ProjectDetailClient({
  projectId,
  permissions,
}: {
  projectId: string;
  permissions: Permission[];
}) {
  const router = useRouter();
  const [data, setData] = useState<ProjectDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabName>("Summary");

  const [msTitle, setMsTitle] = useState("");
  const [msDue, setMsDue] = useState("");
  const [riskTitle, setRiskTitle] = useState("");
  const [riskSeverity, setRiskSeverity] = useState("Medium");
  const [riskMitigation, setRiskMitigation] = useState("");
  const [reviewDraft, setReviewDraft] = useState("");

  const canEdit = permissions.includes("project.edit");
  const canArchive = permissions.includes("project.archive");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/dashboard/projects/${projectId}`);
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error || "Unable to load project.");
      } else {
        setData(json);
        setReviewDraft(json.project.completion_review ?? "");
      }
    } catch {
      setError("Network error loading project.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/dashboard/projects/${projectId}`)
      .then((r) => r.json().then((json) => ({ ok: r.ok && json.ok, json })))
      .then(({ ok, json }) => {
        if (cancelled) return;
        if (!ok) {
          setError(json.error || "Unable to load project.");
        } else {
          setData(json);
          setReviewDraft(json.project.completion_review ?? "");
        }
      })
      .catch(() => {
        if (!cancelled) setError("Network error loading project.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  async function patchProject(patch: Record<string, unknown>) {
    const res = await fetch(`/api/dashboard/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      setError(json.error || "Failed to update project.");
      return;
    }
    await load();
  }

  async function handleAddMilestone(e: React.FormEvent) {
    e.preventDefault();
    if (!msTitle.trim()) return;
    await fetch(`/api/dashboard/projects/${projectId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "milestone", title: msTitle, dueDate: msDue }),
    });
    setMsTitle("");
    setMsDue("");
    await load();
  }

  async function handleAddRisk(e: React.FormEvent) {
    e.preventDefault();
    if (!riskTitle.trim()) return;
    await fetch(`/api/dashboard/projects/${projectId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "risk",
        title: riskTitle,
        severity: riskSeverity,
        mitigation: riskMitigation,
      }),
    });
    setRiskTitle("");
    setRiskMitigation("");
    await load();
  }

  if (loading) return <LoadingState label="Loading project workspace..." />;
  if (error || !data) {
    return <ErrorState message={error || "Project unavailable."} onRetry={load} />;
  }

  const { project } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted-brown)] hover:text-[var(--color-dark-brown)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
        </Link>
        {canArchive && (
          <button
            type="button"
            onClick={async () => {
              await patchProject({ archive: true });
              router.push("/dashboard/projects");
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
          >
            <Archive className="h-3.5 w-3.5" /> Archive Project
          </button>
        )}
      </div>

      {/* Header + 8-Phase Progress Stepper */}
      <section className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge value={project.status} />
              <span className="rounded-full bg-[var(--color-pale-gold)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-dark-brown)]">
                Phase: {project.phase}
              </span>
              {project.is_demo === 1 && (
                <span className="rounded-full border border-[var(--color-brown-gold)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-brown-gold)]">
                  DEMO RECORD
                </span>
              )}
            </div>
            <h2 className="mt-2 text-2xl font-bold text-[var(--color-dark-brown)]">
              {project.name}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted-brown)]">
              {project.objective}
            </p>
          </div>

          {canEdit && (
            <div className="flex flex-wrap gap-2 text-xs">
              <select
                value={project.phase}
                onChange={(e) => patchProject({ phase: e.target.value })}
                aria-label="Project phase"
                className="rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2 font-semibold"
              >
                {PROJECT_PHASES.map((ph) => (
                  <option key={ph} value={ph}>
                    Phase: {ph}
                  </option>
                ))}
              </select>
              <select
                value={project.status}
                onChange={(e) => patchProject({ status: e.target.value })}
                aria-label="Project status"
                className="rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2 font-semibold"
              >
                {PROJECT_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    Status: {st}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 8-Phase Process Stepper */}
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {PROJECT_PHASES.map((ph, idx) => {
            const currentIdx = PROJECT_PHASES.indexOf(project.phase as (typeof PROJECT_PHASES)[number]);
            const done = idx < currentIdx;
            const current = idx === currentIdx;
            return (
              <div
                key={ph}
                className={`rounded-lg border px-2.5 py-2 text-center text-[11px] font-semibold ${
                  current
                    ? "border-[var(--color-brown-gold)] bg-[var(--color-brown-gold)] text-white"
                    : done
                      ? "border-[var(--color-brown-gold)]/40 bg-[var(--color-pale-gold)] text-[var(--color-dark-brown)]"
                      : "border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] text-[var(--color-muted-brown)]"
                }`}
              >
                {idx + 1}. {ph}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8 Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--color-soft-sand)] pb-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
              activeTab === tab
                ? "bg-[var(--color-dark-brown)] text-white"
                : "bg-white text-[var(--color-muted-brown)] border border-[var(--color-soft-sand)] hover:text-[var(--color-dark-brown)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Summary" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 space-y-4 text-sm">
            <div>
              <h3 className="text-xs font-semibold text-[var(--color-brown-gold)] uppercase">
                Problem or Opportunity
              </h3>
              <p className="mt-1 text-[var(--color-deep-brown)]">
                {project.problem_or_opportunity}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[var(--color-brown-gold)] uppercase">
                Description
              </h3>
              <p className="mt-1 text-[var(--color-muted-brown)]">
                {project.description || "No detailed description recorded."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-[var(--color-soft-sand)] pt-4 text-xs">
              <div>
                <p className="text-[var(--color-muted-brown)]">Project Lead</p>
                <p className="mt-0.5 font-semibold text-[var(--color-dark-brown)]">
                  {project.lead_label}
                </p>
              </div>
              <div>
                <p className="text-[var(--color-muted-brown)]">Target Date</p>
                <p className="mt-0.5 font-semibold text-[var(--color-dark-brown)]">
                  {project.target_date || "Not set"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 text-xs">
            <h3 className="text-sm font-bold text-[var(--color-dark-brown)]">
              Completion Review &amp; Evaluation Notes
            </h3>
            <p className="mt-1 text-[var(--color-muted-brown)]">
              Used during the Deliver and Evaluate phases to capture lessons learned.
            </p>
            <textarea
              rows={5}
              value={reviewDraft}
              disabled={!canEdit}
              onChange={(e) => setReviewDraft(e.target.value)}
              placeholder="Record completion outcomes, feedback, and improvements..."
              className="mt-3 w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-3 text-sm disabled:opacity-60"
            />
            {canEdit && (
              <button
                type="button"
                onClick={() => patchProject({ completionReview: reviewDraft })}
                className="mt-3 rounded-lg bg-[var(--color-brown-gold)] px-4 py-2 font-semibold text-white"
              >
                Save Review Notes
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === "Tasks" && (
        <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-[var(--color-dark-brown)]">
              Project Tasks ({data.tasks.length})
            </h3>
            <Link
              href="/dashboard/tasks?new=1"
              className="rounded-lg bg-[var(--color-brown-gold)] px-3 py-1.5 text-xs font-semibold text-white"
            >
              + New Task
            </Link>
          </div>
          {data.tasks.length === 0 ? (
            <EmptyState title="No tasks assigned to this project yet." />
          ) : (
            <div className="divide-y divide-[var(--color-soft-sand)] text-xs">
              {data.tasks.map((t) => (
                <Link
                  key={t.id}
                  href={`/dashboard/tasks?task=${t.id}`}
                  className="flex items-center justify-between py-3 hover:bg-[var(--color-warm-off-white)] px-2 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-[var(--color-dark-brown)]">{t.title}</p>
                    <p className="text-[var(--color-muted-brown)]">
                      {t.owner_label || "Unassigned"} · {t.due_date || "No due date"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge value={t.priority} />
                    <StatusBadge value={t.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Milestones" && (
        <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 space-y-5">
          {canEdit && (
            <form onSubmit={handleAddMilestone} className="flex flex-wrap gap-2 text-xs">
              <input
                type="text"
                value={msTitle}
                onChange={(e) => setMsTitle(e.target.value)}
                placeholder="Milestone title..."
                className="flex-1 min-w-52 rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
              />
              <input
                type="date"
                value={msDue}
                onChange={(e) => setMsDue(e.target.value)}
                className="rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-brown-gold)] px-3.5 py-2 font-semibold text-white"
              >
                <Plus className="h-3.5 w-3.5" /> Add Milestone
              </button>
            </form>
          )}
          {data.milestones.length === 0 ? (
            <EmptyState title="No milestones added yet." />
          ) : (
            <div className="space-y-3">
              {data.milestones.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-4 text-xs"
                >
                  <div>
                    <p className="font-bold text-[var(--color-dark-brown)]">{m.title}</p>
                    <p className="text-[var(--color-muted-brown)]">
                      Target: {m.due_date || "TBD"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge value={m.status} />
                    {canEdit && m.status !== "Completed" && (
                      <button
                        type="button"
                        onClick={async () => {
                          await fetch(`/api/dashboard/projects/${projectId}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              kind: "milestone_toggle",
                              milestoneId: m.id,
                              status: "Completed",
                            }),
                          });
                          await load();
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-2.5 py-1 font-semibold text-white"
                      >
                        <CheckCircle2 className="h-3 w-3" /> Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Team" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.members.map((m) => (
            <div
              key={m.user_id}
              className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-5 text-xs"
            >
              <p className="font-bold text-[var(--color-dark-brown)]">{m.display_label}</p>
              <p className="mt-1 text-[var(--color-brown-gold)] font-semibold">
                {m.project_role}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Documents" && (
        <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6">
          {data.documents.length === 0 ? (
            <EmptyState title="No documents have been shared here." />
          ) : (
            <div className="space-y-2 text-xs">
              {data.documents.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between rounded-xl border border-[var(--color-soft-sand)] p-3"
                >
                  <div>
                    <p className="font-semibold text-[var(--color-dark-brown)]">{d.file_name}</p>
                    <p className="text-[var(--color-muted-brown)]">
                      {d.category} · {d.version}
                    </p>
                  </div>
                  <a
                    href={`/api/dashboard/documents/${d.id}/download`}
                    className="font-semibold text-[var(--color-brown-gold)] hover:underline"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Decisions" && (
        <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6">
          {data.decisions.length === 0 ? (
            <EmptyState title="No decisions have been recorded." />
          ) : (
            <div className="space-y-3 text-xs">
              {data.decisions.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-4"
                >
                  <div>
                    <p className="font-bold text-[var(--color-dark-brown)]">{d.title}</p>
                    <p className="text-[var(--color-muted-brown)]">
                      {d.owner_label} · {d.decision_date}
                    </p>
                  </div>
                  <StatusBadge value={d.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Risks" && (
        <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 space-y-5">
          <form onSubmit={handleAddRisk} className="grid grid-cols-1 gap-2 sm:grid-cols-4 text-xs">
            <input
              type="text"
              value={riskTitle}
              onChange={(e) => setRiskTitle(e.target.value)}
              placeholder="Risk or blocker..."
              className="rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
            />
            <select
              value={riskSeverity}
              onChange={(e) => setRiskSeverity(e.target.value)}
              className="rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
            >
              <option value="Low">Low Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="High">High Severity</option>
            </select>
            <input
              type="text"
              value={riskMitigation}
              onChange={(e) => setRiskMitigation(e.target.value)}
              placeholder="Mitigation plan..."
              className="rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
            />
            <button
              type="submit"
              className="rounded-lg bg-[var(--color-brown-gold)] px-3 py-2 font-semibold text-white"
            >
              Log Risk
            </button>
          </form>

          {data.risks.length === 0 ? (
            <EmptyState title="No project risks logged." />
          ) : (
            <div className="space-y-3 text-xs">
              {data.risks.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[var(--color-dark-brown)]">{r.title}</p>
                    <StatusBadge value={r.severity} />
                  </div>
                  {r.mitigation && (
                    <p className="mt-1 text-[var(--color-muted-brown)]">
                      Mitigation: {r.mitigation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Activity" && (
        <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6">
          {data.activity.length === 0 ? (
            <EmptyState title="No project activity recorded yet." />
          ) : (
            <div className="space-y-3 text-xs">
              {data.activity.map((a) => (
                <div
                  key={a.id}
                  className="border-b border-[var(--color-soft-sand)] pb-2.5 last:border-0"
                >
                  <p className="text-[var(--color-dark-brown)]">{a.summary}</p>
                  <p className="text-[var(--color-muted-brown)]">
                    {a.actor_label || "System"} · {a.created_at.slice(0, 16).replace("T", " ")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
