"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  List,
  Kanban,
  Calendar,
  Users,
  X,
  Paperclip,
  MessageSquare,
  AlertTriangle,
  Archive,
  CheckCircle2,
  Download,
} from "lucide-react";
import {
  Permission,
  ROLE_LIST,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TASK_TYPES,
} from "@/lib/dashboard-constants";
import { StatusBadge } from "./StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "./DashboardStates";

interface TaskRow {
  id: string;
  title: string;
  description: string;
  project_id: string | null;
  project_name: string | null;
  task_type: string;
  owner_user_id: string | null;
  owner_label: string | null;
  status: string;
  priority: string;
  due_date: string;
  start_date: string;
  estimated_effort: string;
  labels_json: string;
  dependencies_json: string;
  blocker_reason: string;
  completion_notes: string;
  is_demo: number;
  created_at: string;
  updated_at: string;
}

interface ProjectOption {
  id: string;
  name: string;
}

interface TaskDetailPayload {
  task: TaskRow;
  comments: Array<{
    id: string;
    author_label: string;
    body: string;
    created_at: string;
  }>;
  attachments: Array<{
    id: string;
    file_name: string;
    size_bytes: number;
    uploader_label: string;
    created_at: string;
  }>;
  activity: Array<{
    id: string;
    summary: string;
    actor_label: string | null;
    created_at: string;
  }>;
}

type ViewMode = "list" | "kanban" | "calendar" | "workload";

export function TasksWorkspace({
  mode,
  currentUserId,
  permissions,
  initialTaskId,
  initialNewOpen,
  initialStatusFilter,
}: {
  mode: "mine" | "all";
  currentUserId: string;
  permissions: Permission[];
  initialTaskId?: string;
  initialNewOpen?: boolean;
  initialStatusFilter?: string;
}) {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter ?? "");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<"priority" | "due" | "updated">("priority");

  const [createOpen, setCreateOpen] = useState(Boolean(initialNewOpen));
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newProjectId, setNewProjectId] = useState("");
  const [newType, setNewType] = useState<string>("Development");
  const [newOwner, setNewOwner] = useState(currentUserId);
  const [newPriority, setNewPriority] = useState<string>("Normal");
  const [newStatus, setNewStatus] = useState<string>("Ready");
  const [newDueDate, setNewDueDate] = useState("");
  const [newEffort, setNewEffort] = useState("");
  const [newLabels, setNewLabels] = useState("");
  const [creating, setCreating] = useState(false);

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    initialTaskId ?? null
  );
  const [detail, setDetail] = useState<TaskDetailPayload | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [blockerDraft, setBlockerDraft] = useState("");
  const [completionDraft, setCompletionDraft] = useState("");
  const [archiveConfirm, setArchiveConfirm] = useState(false);

  const canAssign = permissions.includes("task.assign");
  const canDelete = permissions.includes("task.delete");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams();
      if (mode === "mine") qs.set("mine", "1");
      if (statusFilter) qs.set("status", statusFilter);
      if (priorityFilter) qs.set("priority", priorityFilter);
      if (ownerFilter) qs.set("owner", ownerFilter);
      if (projectFilter) qs.set("projectId", projectFilter);
      if (searchText.trim()) qs.set("q", searchText.trim());

      const [tRes, pRes] = await Promise.all([
        fetch(`/api/dashboard/tasks?${qs.toString()}`),
        fetch("/api/dashboard/projects"),
      ]);
      const tData = await tRes.json();
      const pData = await pRes.json();

      if (!tRes.ok || !tData.ok) {
        setError(tData.error || "Unable to load tasks.");
        setLoading(false);
        return;
      }

      setTasks(tData.tasks);
      if (pRes.ok && pData.ok) {
        setProjects(pData.projects);
      }
    } catch {
      setError("Network error loading tasks.");
    } finally {
      setLoading(false);
    }
  }, [mode, statusFilter, priorityFilter, ownerFilter, projectFilter, searchText]);

  useEffect(() => {
    let cancelled = false;
    const qs = new URLSearchParams();
    if (mode === "mine") qs.set("mine", "1");
    if (statusFilter) qs.set("status", statusFilter);
    if (priorityFilter) qs.set("priority", priorityFilter);
    if (ownerFilter) qs.set("owner", ownerFilter);
    if (projectFilter) qs.set("projectId", projectFilter);
    if (searchText.trim()) qs.set("q", searchText.trim());

    Promise.all([
      fetch(`/api/dashboard/tasks?${qs.toString()}`).then((r) =>
        r.json().then((d) => ({ ok: r.ok && d.ok, data: d }))
      ),
      fetch("/api/dashboard/projects").then((r) =>
        r.json().then((d) => ({ ok: r.ok && d.ok, data: d }))
      ),
    ])
      .then(([tRes, pRes]) => {
        if (cancelled) return;
        if (!tRes.ok) {
          setError(tRes.data.error || "Unable to load tasks.");
        } else {
          setTasks(tRes.data.tasks);
          setError("");
        }
        if (pRes.ok) {
          setProjects(pRes.data.projects);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Network error loading tasks.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mode, statusFilter, priorityFilter, ownerFilter, projectFilter, searchText]);

  const loadDetail = useCallback(async (id: string) => {
    setDetailLoading(true);
    setArchiveConfirm(false);
    try {
      const res = await fetch(`/api/dashboard/tasks/${id}`);
      const data = await res.json();
      if (res.ok && data.ok) {
        setDetail(data);
        setBlockerDraft(data.task.blocker_reason ?? "");
        setCompletionDraft(data.task.completion_notes ?? "");
      }
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedTaskId) return;
    let cancelled = false;
    fetch(`/api/dashboard/tasks/${selectedTaskId}`)
      .then((r) => r.json().then((d) => ({ ok: r.ok && d.ok, data: d })))
      .then(({ ok, data }) => {
        if (cancelled || !ok) return;
        setDetail(data);
        setBlockerDraft(data.task.blocker_reason ?? "");
        setCompletionDraft(data.task.completion_notes ?? "");
        setArchiveConfirm(false);
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedTaskId]);

  const sortedTasks = useMemo(() => {
    const copy = [...tasks];
    if (sortBy === "due") {
      copy.sort((a, b) => (a.due_date || "9999-12-31").localeCompare(b.due_date || "9999-12-31"));
    } else if (sortBy === "updated") {
      copy.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
    }
    return copy;
  }, [tasks, sortBy]);

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          projectId: newProjectId || null,
          taskType: newType,
          ownerUserId: canAssign ? newOwner : currentUserId,
          priority: newPriority,
          status: newStatus,
          dueDate: newDueDate,
          estimatedEffort: newEffort,
          labels: newLabels
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Could not create task.");
      } else {
        setCreateOpen(false);
        setNewTitle("");
        setNewDesc("");
        setNewLabels("");
        setFeedback("Task created.");
        await loadTasks();
      }
    } finally {
      setCreating(false);
    }
  }

  async function updateTask(
    taskId: string,
    patch: Record<string, unknown>,
    notice?: string
  ) {
    const res = await fetch(`/api/dashboard/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data.error || "Failed to update task.");
      return;
    }
    if (notice) setFeedback(notice);
    await loadTasks();
    if (selectedTaskId === taskId) {
      await loadDetail(taskId);
    }
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTaskId || !commentText.trim()) return;
    const res = await fetch(`/api/dashboard/tasks/${selectedTaskId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: commentText }),
    });
    if (res.ok) {
      setCommentText("");
      await loadDetail(selectedTaskId);
    }
  }

  async function handleUploadAttachment(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selectedTaskId) return;
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`/api/dashboard/tasks/${selectedTaskId}`, {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data.error || "Attachment upload failed.");
      return;
    }
    setFeedback("Attachment uploaded privately.");
    await loadDetail(selectedTaskId);
  }

  const kanbanStatuses = TASK_STATUSES.filter((s) => s !== "Archived");

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--color-soft-sand)] bg-white p-5 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-dark-brown)]">
            {mode === "mine" ? "My Tasks" : "All Company Tasks"}
          </h2>
          <p className="text-xs text-[var(--color-muted-brown)]">
            {mode === "mine"
              ? "Tasks owned by or shared with your founding role."
              : "Unified workspace across all five founding roles and active projects."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Switcher */}
          <div className="inline-flex rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-1 text-xs">
            {(
              [
                { id: "list", label: "List", icon: List },
                { id: "kanban", label: "Kanban", icon: Kanban },
                { id: "calendar", label: "Calendar", icon: Calendar },
                { id: "workload", label: "Workload", icon: Users },
              ] as const
            ).map((v) => {
              const Icon = v.icon;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setViewMode(v.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-semibold transition-colors ${
                    viewMode === v.id
                      ? "bg-[var(--color-dark-brown)] text-white"
                      : "text-[var(--color-muted-brown)] hover:text-[var(--color-dark-brown)]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{v.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brown-gold)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--accent-hover)]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Task
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[var(--color-soft-sand)] bg-white p-4 sm:grid-cols-2 lg:grid-cols-6">
        <input
          type="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Filter by title or label..."
          className="rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2 text-xs focus:border-[var(--color-brown-gold)] focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
          className="rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2 text-xs"
        >
          <option value="">All Statuses</option>
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          aria-label="Filter by priority"
          className="rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2 text-xs"
        >
          <option value="">All Priorities</option>
          {TASK_PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
          aria-label="Filter by owner"
          className="rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2 text-xs"
        >
          <option value="">All Founders</option>
          {ROLE_LIST.map((r) => (
            <option key={r.id} value={`usr_${r.id}`}>
              {r.shortTitle}
            </option>
          ))}
        </select>
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          aria-label="Filter by project"
          className="rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2 text-xs"
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "priority" | "due" | "updated")}
          aria-label="Sort tasks"
          className="rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2 text-xs"
        >
          <option value="priority">Sort: Priority</option>
          <option value="due">Sort: Due Date</option>
          <option value="updated">Sort: Recently Updated</option>
        </select>
      </div>

      {feedback && (
        <div
          role="status"
          className="flex items-center justify-between rounded-xl border border-[var(--color-brown-gold)]/40 bg-[var(--color-pale-gold)]/60 px-4 py-2.5 text-xs font-medium text-[var(--color-dark-brown)]"
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[var(--color-brown-gold)]" />
            {feedback}
          </span>
          <button type="button" onClick={() => setFeedback("")} className="underline">
            Dismiss
          </button>
        </div>
      )}

      {error && <ErrorState message={error} onRetry={loadTasks} />}

      {loading ? (
        <LoadingState label="Loading tasks..." />
      ) : sortedTasks.length === 0 ? (
        <EmptyState
          title="No tasks assigned yet."
          description="Create a task or adjust your active filters to see matching work."
          action={
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="rounded-lg bg-[var(--color-brown-gold)] px-4 py-2 text-xs font-semibold text-white"
            >
              Create First Task
            </button>
          }
        />
      ) : viewMode === "list" ? (
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-soft-sand)] bg-white">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] text-[11px] font-semibold tracking-wider text-[var(--color-muted-brown)] uppercase">
              <tr>
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-soft-sand)]">
              {sortedTasks.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTaskId(t.id)}
                  className="cursor-pointer transition-colors hover:bg-[var(--color-warm-off-white)]"
                >
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-[var(--color-dark-brown)]">{t.title}</p>
                    <p className="mt-0.5 text-[11px] text-[var(--color-muted-brown)]">
                      {t.project_name || "General"}
                      {t.is_demo ? " · DEMO" : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-[var(--color-muted-brown)]">{t.task_type}</td>
                  <td className="px-4 py-3.5 text-[var(--color-dark-brown)]">
                    {t.owner_label || "Unassigned"}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge value={t.priority} />
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge value={t.status} />
                  </td>
                  <td className="px-4 py-3.5 text-[var(--color-muted-brown)]">
                    {t.due_date || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : viewMode === "kanban" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {kanbanStatuses.map((colStatus) => {
            const colTasks = sortedTasks.filter((t) => t.status === colStatus);
            return (
              <div
                key={colStatus}
                className="flex flex-col rounded-2xl border border-[var(--color-soft-sand)] bg-white p-3"
              >
                <div className="mb-3 flex items-center justify-between border-b border-[var(--color-soft-sand)] pb-2">
                  <span className="text-xs font-bold text-[var(--color-dark-brown)]">
                    {colStatus}
                  </span>
                  <span className="rounded-full bg-[var(--color-pale-gold)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-dark-brown)]">
                    {colTasks.length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTaskId(t.id)}
                      className="cursor-pointer rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-3 hover:border-[var(--color-brown-gold)]"
                    >
                      <p className="text-xs font-semibold text-[var(--color-dark-brown)]">
                        {t.title}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <StatusBadge value={t.priority} />
                        <span className="text-[10px] text-[var(--color-muted-brown)]">
                          {t.due_date || "No due"}
                        </span>
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <p className="py-4 text-center text-[11px] text-[var(--color-muted-brown)]">
                      Empty
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === "calendar" ? (
        <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6">
          <h3 className="mb-4 text-sm font-bold text-[var(--color-dark-brown)]">
            Tasks Grouped by Due Date
          </h3>
          <div className="space-y-3">
            {sortedTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTaskId(t.id)}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-4 py-3 text-xs hover:border-[var(--color-brown-gold)]"
              >
                <div>
                  <span className="font-mono font-semibold text-[var(--color-brown-gold)]">
                    {t.due_date || "Unscheduled"}
                  </span>
                  <span className="ml-3 font-semibold text-[var(--color-dark-brown)]">
                    {t.title}
                  </span>
                </div>
                <StatusBadge value={t.status} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Team Workload View */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ROLE_LIST.map((role) => {
            const roleTasks = sortedTasks.filter(
              (t) => t.owner_user_id === `usr_${role.id}`
            );
            return (
              <div
                key={role.id}
                className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-5"
              >
                <div className="mb-3 flex items-center justify-between border-b border-[var(--color-soft-sand)] pb-3">
                  <div>
                    <p className="text-sm font-bold text-[var(--color-dark-brown)]">
                      {role.title}
                    </p>
                    <p className="text-[11px] text-[var(--color-muted-brown)]">
                      {roleTasks.length} matching tasks
                    </p>
                  </div>
                </div>
                {roleTasks.length === 0 ? (
                  <p className="text-xs text-[var(--color-muted-brown)]">No tasks in view.</p>
                ) : (
                  <div className="space-y-2">
                    {roleTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTaskId(t.id)}
                        className="cursor-pointer rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-2.5 text-xs hover:border-[var(--color-brown-gold)]"
                      >
                        <p className="font-semibold text-[var(--color-dark-brown)]">{t.title}</p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <StatusBadge value={t.status} />
                          <StatusBadge value={t.priority} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--color-dark-brown)]">
                Create New Task
              </h3>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                aria-label="Close modal"
                className="rounded-lg p-1 text-[var(--color-muted-brown)] hover:bg-[var(--color-warm-off-white)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Clear, actionable task title"
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Context, acceptance criteria, or notes"
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                    Project
                  </label>
                  <select
                    value={newProjectId}
                    onChange={(e) => setNewProjectId(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                  >
                    <option value="">General (No Project)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                    Task Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                  >
                    {TASK_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                    Owner
                  </label>
                  <select
                    value={canAssign ? newOwner : currentUserId}
                    disabled={!canAssign}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2 disabled:opacity-60"
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
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                  >
                    {TASK_PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                    Initial Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                  >
                    {kanbanStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                    Estimated Effort
                  </label>
                  <input
                    type="text"
                    value={newEffort}
                    onChange={(e) => setNewEffort(e.target.value)}
                    placeholder="e.g. 2h, 1d"
                    className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                    Labels (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newLabels}
                    onChange={(e) => setNewLabels(e.target.value)}
                    placeholder="website, security, urgent"
                    className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="rounded-lg border border-[var(--color-soft-sand)] px-4 py-2 font-semibold text-[var(--color-dark-brown)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-lg bg-[var(--color-brown-gold)] px-4 py-2 font-semibold text-white hover:bg-[var(--accent-hover)] disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Detail Slide-Over Drawer */}
      {selectedTaskId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <div className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-[var(--color-soft-sand)] pb-4">
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-brown-gold)] uppercase">
                  Task Details
                </p>
                <h3 className="mt-1 text-lg font-bold text-[var(--color-dark-brown)]">
                  {detail?.task.title ?? "Loading..."}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTaskId(null)}
                aria-label="Close task drawer"
                className="rounded-lg p-1.5 text-[var(--color-muted-brown)] hover:bg-[var(--color-warm-off-white)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {detailLoading || !detail ? (
              <LoadingState label="Loading task details..." />
            ) : (
              <div className="space-y-6 text-xs">
                {detail.task.description && (
                  <p className="rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-4 text-sm leading-relaxed text-[var(--color-deep-brown)]">
                    {detail.task.description}
                  </p>
                )}

                {/* Quick Status / Priority / Owner Controls */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                      Status
                    </label>
                    <select
                      value={detail.task.status}
                      onChange={(e) =>
                        updateTask(detail.task.id, { status: e.target.value }, "Status updated.")
                      }
                      className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-2.5 py-2"
                    >
                      {kanbanStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                      Priority
                    </label>
                    <select
                      value={detail.task.priority}
                      onChange={(e) =>
                        updateTask(
                          detail.task.id,
                          { priority: e.target.value },
                          "Priority updated."
                        )
                      }
                      className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-2.5 py-2"
                    >
                      {TASK_PRIORITIES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-semibold text-[var(--color-dark-brown)]">
                      Owner
                    </label>
                    <select
                      value={detail.task.owner_user_id ?? ""}
                      disabled={!canAssign}
                      onChange={(e) =>
                        updateTask(
                          detail.task.id,
                          { ownerUserId: e.target.value },
                          "Task reassigned."
                        )
                      }
                      className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-2.5 py-2 disabled:opacity-60"
                    >
                      {ROLE_LIST.map((r) => (
                        <option key={r.id} value={`usr_${r.id}`}>
                          {r.shortTitle}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Blocker Reason */}
                <div className="rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-4">
                  <label className="mb-1.5 flex items-center gap-1.5 font-semibold text-[var(--color-dark-brown)]">
                    <AlertTriangle className="h-4 w-4 text-[var(--color-brown-gold)]" />
                    Blocker Status &amp; Reason
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={blockerDraft}
                      onChange={(e) => setBlockerDraft(e.target.value)}
                      placeholder="Explain blocker if task is blocked..."
                      className="flex-1 rounded-lg border border-[var(--color-soft-sand)] bg-white px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateTask(
                          detail.task.id,
                          { status: "Blocked", blockerReason: blockerDraft },
                          "Marked task as Blocked."
                        )
                      }
                      className="rounded-lg bg-red-700 px-3 py-2 font-semibold text-white hover:bg-red-800"
                    >
                      Mark Blocked
                    </button>
                  </div>
                </div>

                {/* Completion Notes */}
                <div className="rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-4">
                  <label className="mb-1.5 block font-semibold text-[var(--color-dark-brown)]">
                    Completion Notes
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={completionDraft}
                      onChange={(e) => setCompletionDraft(e.target.value)}
                      placeholder="Summary of deliverable or outcome..."
                      className="flex-1 rounded-lg border border-[var(--color-soft-sand)] bg-white px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateTask(
                          detail.task.id,
                          { status: "Completed", completionNotes: completionDraft },
                          "Task marked Completed."
                        )
                      }
                      className="rounded-lg bg-emerald-700 px-3 py-2 font-semibold text-white hover:bg-emerald-800"
                    >
                      Complete
                    </button>
                  </div>
                </div>

                {/* Attachments */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold text-[var(--color-dark-brown)]">
                      <Paperclip className="h-4 w-4 text-[var(--color-brown-gold)]" />
                      Attachments ({detail.attachments.length})
                    </span>
                    <label className="cursor-pointer rounded-lg border border-[var(--color-soft-sand)] px-2.5 py-1 font-semibold text-[var(--color-dark-brown)] hover:bg-[var(--color-pale-gold)]">
                      + Upload File
                      <input type="file" className="hidden" onChange={handleUploadAttachment} />
                    </label>
                  </div>
                  {detail.attachments.length > 0 && (
                    <ul className="space-y-1.5">
                      {detail.attachments.map((att) => (
                        <li
                          key={att.id}
                          className="flex items-center justify-between rounded-lg border border-[var(--color-soft-sand)] px-3 py-2"
                        >
                          <span>{att.file_name}</span>
                          <a
                            href={`/api/dashboard/tasks/${detail.task.id}/attachments/${att.id}`}
                            className="inline-flex items-center gap-1 font-semibold text-[var(--color-brown-gold)] hover:underline"
                          >
                            <Download className="h-3.5 w-3.5" /> Download
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Comments */}
                <div>
                  <p className="mb-2 flex items-center gap-1.5 font-bold text-[var(--color-dark-brown)]">
                    <MessageSquare className="h-4 w-4 text-[var(--color-brown-gold)]" />
                    Comments ({detail.comments.length})
                  </p>
                  <div className="space-y-2 mb-3">
                    {detail.comments.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-3"
                      >
                        <p className="font-semibold text-[var(--color-dark-brown)]">
                          {c.author_label}
                        </p>
                        <p className="mt-1 text-[var(--color-deep-brown)]">{c.body}</p>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment or update..."
                      className="flex-1 rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-[var(--color-dark-brown)] px-3.5 py-2 font-semibold text-white"
                    >
                      Post
                    </button>
                  </form>
                </div>

                {/* Safe Archive (prevents accidental deletion) */}
                {canDelete && (
                  <div className="border-t border-[var(--color-soft-sand)] pt-4">
                    {!archiveConfirm ? (
                      <button
                        type="button"
                        onClick={() => setArchiveConfirm(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:underline"
                      >
                        <Archive className="h-3.5 w-3.5" />
                        Archive Task
                      </button>
                    ) : (
                      <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-3">
                        <span className="font-semibold text-red-900">
                          Confirm archiving this task?
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setArchiveConfirm(false)}
                            className="rounded-lg border border-red-300 bg-white px-2.5 py-1 font-semibold text-red-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await updateTask(
                                detail.task.id,
                                { archive: true },
                                "Task archived."
                              );
                              setSelectedTaskId(null);
                            }}
                            className="rounded-lg bg-red-700 px-2.5 py-1 font-semibold text-white"
                          >
                            Confirm Archive
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
