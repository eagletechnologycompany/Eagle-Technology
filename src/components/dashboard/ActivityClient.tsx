"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "./DashboardStates";

interface ActivityRow {
  id: string;
  entity_type: string;
  action: string;
  summary: string;
  actor_label: string | null;
  created_at: string;
}

interface AuditRow {
  id: string;
  actor_role: string;
  actor_label: string | null;
  action: string;
  target_type: string;
  target_id: string;
  status: string;
  created_at: string;
}

export function ActivityClient({ canViewAudit }: { canViewAudit: boolean }) {
  const [tab, setTab] = useState<"activity" | "audit">("activity");
  const [entityFilter, setEntityFilter] = useState("");
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchActivity = useCallback(async (filter: string) => {
    const qs = filter ? `?entityType=${encodeURIComponent(filter)}` : "";
    const res = await fetch(`/api/dashboard/activity${qs}`);
    const data = await res.json();
    return { ok: res.ok && data.ok, data };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { ok, data } = await fetchActivity(entityFilter);
      if (!ok) {
        setError(data.error || "Unable to load activity log.");
      } else {
        setActivity(data.activity);
        setAuditLogs(data.auditLogs ?? []);
      }
    } catch {
      setError("Network error loading activity.");
    } finally {
      setLoading(false);
    }
  }, [entityFilter, fetchActivity]);

  useEffect(() => {
    let cancelled = false;
    fetchActivity(entityFilter)
      .then(({ ok, data }) => {
        if (cancelled) return;
        if (!ok) {
          setError(data.error || "Unable to load activity log.");
        } else {
          setActivity(data.activity);
          setAuditLogs(data.auditLogs ?? []);
          setError("");
        }
      })
      .catch(() => {
        if (!cancelled) setError("Network error loading activity.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [entityFilter, fetchActivity]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--color-soft-sand)] bg-white p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-dark-brown)]">
            Activity &amp; Security Audit Log
          </h2>
          <p className="text-xs text-[var(--color-muted-brown)]">
            Track task updates, project milestones, documents, decisions, and security
            events across the workspace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {tab === "activity" && (
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              aria-label="Filter activity by entity type"
              className="rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
            >
              <option value="">All Activity Types</option>
              <option value="task">Tasks</option>
              <option value="project">Projects</option>
              <option value="decision">Decisions</option>
              <option value="document">Documents</option>
              <option value="check_in">Weekly Check-ins</option>
              <option value="goal">Goals</option>
            </select>
          )}

          {canViewAudit && (
            <div className="inline-flex rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-1">
              <button
                type="button"
                onClick={() => setTab("activity")}
                className={`rounded-lg px-3 py-1.5 font-semibold ${
                  tab === "activity"
                    ? "bg-[var(--color-dark-brown)] text-white"
                    : "text-[var(--color-muted-brown)]"
                }`}
              >
                Activity Stream
              </button>
              <button
                type="button"
                onClick={() => setTab("audit")}
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 font-semibold ${
                  tab === "audit"
                    ? "bg-[var(--color-dark-brown)] text-white"
                    : "text-[var(--color-muted-brown)]"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Audit Log
              </button>
            </div>
          )}
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {loading ? (
        <LoadingState label="Loading activity stream..." />
      ) : tab === "activity" ? (
        activity.length === 0 ? (
          <EmptyState title="No activity entries match your filter." />
        ) : (
          <div className="divide-y divide-[var(--color-soft-sand)] rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 text-xs">
            {activity.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="font-medium text-[var(--color-dark-brown)]">{a.summary}</p>
                  <p className="mt-0.5 text-[11px] text-[var(--color-muted-brown)]">
                    {a.actor_label || "System"} · {a.entity_type} ({a.action})
                  </p>
                </div>
                <span className="font-mono text-[11px] text-[var(--color-muted-brown)]">
                  {a.created_at.slice(0, 19).replace("T", " ")}
                </span>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-soft-sand)] bg-white">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] text-[11px] font-semibold text-[var(--color-muted-brown)] uppercase">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Actor Role</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-soft-sand)]">
              {auditLogs.map((au) => (
                <tr key={au.id}>
                  <td className="px-4 py-3 font-mono text-[11px] text-[var(--color-muted-brown)]">
                    {au.created_at.slice(0, 19).replace("T", " ")}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[var(--color-dark-brown)]">
                    {au.actor_role}
                  </td>
                  <td className="px-4 py-3 font-mono">{au.action}</td>
                  <td className="px-4 py-3 text-[var(--color-muted-brown)]">
                    {au.target_type}:{au.target_id}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      value={au.status === "success" ? "Approved" : "Blocked"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
