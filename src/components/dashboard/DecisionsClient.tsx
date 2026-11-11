"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Plus, X, Check, Ban } from "lucide-react";
import {
  MEETING_TYPES,
  Permission,
} from "@/lib/dashboard-constants";
import { StatusBadge } from "./StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "./DashboardStates";

interface DecisionRow {
  id: string;
  title: string;
  context: string;
  decision_text: string;
  options_considered: string;
  owner_label: string;
  approver_label: string | null;
  decision_date: string;
  status: string;
  project_name: string | null;
  is_demo: number;
}

interface MeetingRow {
  id: string;
  title: string;
  meeting_type: string;
  meeting_date: string;
  agenda: string;
  notes: string;
  decisions_summary: string;
  follow_up_date: string | null;
  creator_label: string;
  is_demo: number;
}

export function DecisionsClient({
  permissions,
  initialTab,
  initialNewOpen,
}: {
  permissions: Permission[];
  initialTab?: string;
  initialNewOpen?: boolean;
}) {
  const [tab, setTab] = useState<"decisions" | "meetings">(
    initialTab === "meetings" ? "meetings" : "decisions"
  );
  const [decisions, setDecisions] = useState<DecisionRow[]>([]);
  const [meetings, setMeetings] = useState<MeetingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newDecisionOpen, setNewDecisionOpen] = useState(Boolean(initialNewOpen));
  const [newMeetingOpen, setNewMeetingOpen] = useState(false);

  const [dTitle, setDTitle] = useState("");
  const [dContext, setDContext] = useState("");
  const [dText, setDText] = useState("");
  const [dOptions, setDOptions] = useState("");
  const [dReviewDate, setDReviewDate] = useState("");

  const [mTitle, setMTitle] = useState("");
  const [mType, setMType] = useState<string>("Weekly team meeting");
  const [mDate, setMDate] = useState(new Date().toISOString().slice(0, 10));
  const [mAgenda, setMAgenda] = useState("");
  const [mNotes, setMNotes] = useState("");
  const [mDecisions, setMDecisions] = useState("");

  const canApprove = permissions.includes("decision.approve");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/decisions");
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Unable to load decisions and meetings.");
      } else {
        setDecisions(data.decisions);
        setMeetings(data.meetings);
      }
    } catch {
      setError("Network error loading decisions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/dashboard/decisions")
      .then((r) => r.json().then((data) => ({ ok: r.ok && data.ok, data })))
      .then(({ ok, data }) => {
        if (cancelled) return;
        if (!ok) {
          setError(data.error || "Unable to load decisions and meetings.");
        } else {
          setDecisions(data.decisions);
          setMeetings(data.meetings);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Network error loading decisions.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreateDecision(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/dashboard/decisions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: dTitle,
        context: dContext,
        decisionText: dText,
        optionsConsidered: dOptions,
        reviewDate: dReviewDate,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data.error || "Failed to record decision.");
      return;
    }
    setNewDecisionOpen(false);
    setDTitle("");
    setDContext("");
    setDText("");
    setDOptions("");
    await load();
  }

  async function handleCreateMeeting(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/dashboard/decisions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "meeting",
        title: mTitle,
        meetingType: mType,
        meetingDate: mDate,
        agenda: mAgenda,
        notes: mNotes,
        decisionsSummary: mDecisions,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data.error || "Failed to save meeting notes.");
      return;
    }
    setNewMeetingOpen(false);
    setMTitle("");
    setMAgenda("");
    setMNotes("");
    setMDecisions("");
    await load();
  }

  async function updateDecisionStatus(id: string, status: string) {
    const res = await fetch("/api/dashboard/decisions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data.error || "Unable to update decision status.");
      return;
    }
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--color-soft-sand)] bg-white p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-dark-brown)]">
            Decisions &amp; Meeting Notes
          </h2>
          <p className="text-xs text-[var(--color-muted-brown)]">
            Strategic decisions require CEO approval with team input; technical and
            creative decisions capture domain contributor alignment.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="inline-flex rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-1 text-xs">
            <button
              type="button"
              onClick={() => setTab("decisions")}
              className={`rounded-lg px-3 py-1.5 font-semibold ${
                tab === "decisions"
                  ? "bg-[var(--color-dark-brown)] text-white"
                  : "text-[var(--color-muted-brown)]"
              }`}
            >
              Decisions ({decisions.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("meetings")}
              className={`rounded-lg px-3 py-1.5 font-semibold ${
                tab === "meetings"
                  ? "bg-[var(--color-dark-brown)] text-white"
                  : "text-[var(--color-muted-brown)]"
              }`}
            >
              Meetings ({meetings.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              tab === "decisions" ? setNewDecisionOpen(true) : setNewMeetingOpen(true)
            }
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brown-gold)] px-4 py-2 text-xs font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            {tab === "decisions" ? "Log Decision" : "New Meeting Note"}
          </button>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {loading ? (
        <LoadingState label="Loading decision & meeting records..." />
      ) : tab === "decisions" ? (
        decisions.length === 0 ? (
          <EmptyState title="No decisions have been recorded." />
        ) : (
          <div className="space-y-4">
            {decisions.map((d) => (
              <article
                key={d.id}
                className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 text-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--color-soft-sand)] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <StatusBadge value={d.status} />
                      {d.is_demo === 1 && (
                        <span className="rounded-full border border-[var(--color-brown-gold)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-brown-gold)]">
                          DEMO
                        </span>
                      )}
                      <span className="text-[var(--color-muted-brown)]">
                        {d.decision_date}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-[var(--color-dark-brown)]">
                      {d.title}
                    </h3>
                    <p className="text-[var(--color-muted-brown)]">
                      Owner: {d.owner_label}
                      {d.approver_label ? ` · Approved by ${d.approver_label}` : ""}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {d.status === "Proposed" && (
                      <button
                        type="button"
                        onClick={() => updateDecisionStatus(d.id, "Under discussion")}
                        className="rounded-lg border border-[var(--color-soft-sand)] px-3 py-1.5 font-semibold text-[var(--color-dark-brown)] hover:bg-[var(--color-warm-off-white)]"
                      >
                        Mark Under Discussion
                      </button>
                    )}
                    {canApprove && d.status !== "Approved" && (
                      <button
                        type="button"
                        onClick={() => updateDecisionStatus(d.id, "Approved")}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 font-semibold text-white hover:bg-emerald-800"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve
                      </button>
                    )}
                    {canApprove && d.status !== "Rejected" && d.status !== "Approved" && (
                      <button
                        type="button"
                        onClick={() => updateDecisionStatus(d.id, "Rejected")}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-700 px-3 py-1.5 font-semibold text-white hover:bg-red-800"
                      >
                        <Ban className="h-3.5 w-3.5" /> Reject
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <p className="font-semibold text-[var(--color-brown-gold)] uppercase">
                      Context
                    </p>
                    <p className="mt-1 leading-relaxed text-[var(--color-muted-brown)]">
                      {d.context}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-brown-gold)] uppercase">
                      Decision
                    </p>
                    <p className="mt-1 leading-relaxed text-[var(--color-deep-brown)]">
                      {d.decision_text}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-brown-gold)] uppercase">
                      Options Considered
                    </p>
                    <p className="mt-1 leading-relaxed text-[var(--color-muted-brown)]">
                      {d.options_considered || "Not documented"}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )
      ) : meetings.length === 0 ? (
        <EmptyState title="No meeting notes recorded yet." />
      ) : (
        <div className="space-y-4">
          {meetings.map((m) => (
            <article
              key={m.id}
              className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-soft-sand)] pb-3">
                <div>
                  <span className="rounded-full bg-[var(--color-pale-gold)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-dark-brown)]">
                    {m.meeting_type}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-[var(--color-dark-brown)]">
                    {m.title}
                  </h3>
                </div>
                <span className="font-mono text-[var(--color-muted-brown)]">
                  {m.meeting_date}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <p className="font-semibold text-[var(--color-brown-gold)] uppercase">
                    Agenda
                  </p>
                  <pre className="mt-1 whitespace-pre-wrap font-sans text-[var(--color-muted-brown)]">
                    {m.agenda || "—"}
                  </pre>
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-brown-gold)] uppercase">
                    Notes
                  </p>
                  <p className="mt-1 text-[var(--color-deep-brown)]">{m.notes || "—"}</p>
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-brown-gold)] uppercase">
                    Decisions &amp; Follow-Up
                  </p>
                  <p className="mt-1 text-[var(--color-muted-brown)]">
                    {m.decisions_summary || "—"}
                  </p>
                  {m.follow_up_date && (
                    <p className="mt-2 font-semibold text-[var(--color-dark-brown)]">
                      Follow-up: {m.follow_up_date}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Propose Decision Modal */}
      {newDecisionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 shadow-xl text-xs">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--color-dark-brown)]">
                Log Company Decision
              </h3>
              <button type="button" onClick={() => setNewDecisionOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateDecision} className="space-y-3">
              <div>
                <label className="mb-1 block font-semibold">Decision Title *</label>
                <input
                  type="text"
                  required
                  value={dTitle}
                  onChange={(e) => setDTitle(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold">Context *</label>
                <textarea
                  rows={2}
                  required
                  value={dContext}
                  onChange={(e) => setDContext(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-2.5"
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold">Proposed Decision *</label>
                <textarea
                  rows={2}
                  required
                  value={dText}
                  onChange={(e) => setDText(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-2.5"
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold">Options Considered</label>
                <input
                  type="text"
                  value={dOptions}
                  onChange={(e) => setDOptions(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold">Review Date</label>
                <input
                  type="date"
                  value={dReviewDate}
                  onChange={(e) => setDReviewDate(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewDecisionOpen(false)}
                  className="rounded-lg border border-[var(--color-soft-sand)] px-4 py-2 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--color-brown-gold)] px-4 py-2 font-semibold text-white"
                >
                  Submit Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Meeting Note Modal */}
      {newMeetingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 shadow-xl text-xs">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--color-dark-brown)]">
                Record Meeting Note
              </h3>
              <button type="button" onClick={() => setNewMeetingOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateMeeting} className="space-y-3">
              <div>
                <label className="mb-1 block font-semibold">Meeting Title *</label>
                <input
                  type="text"
                  required
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold">Meeting Type</label>
                  <select
                    value={mType}
                    onChange={(e) => setMType(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                  >
                    {MEETING_TYPES.map((mt) => (
                      <option key={mt} value={mt}>
                        {mt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Date</label>
                  <input
                    type="date"
                    value={mDate}
                    onChange={(e) => setMDate(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block font-semibold">Agenda</label>
                <textarea
                  rows={2}
                  value={mAgenda}
                  onChange={(e) => setMAgenda(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-2.5"
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold">Discussion Notes</label>
                <textarea
                  rows={2}
                  value={mNotes}
                  onChange={(e) => setMNotes(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-2.5"
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold">Decisions &amp; Action Items</label>
                <input
                  type="text"
                  value={mDecisions}
                  onChange={(e) => setMDecisions(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewMeetingOpen(false)}
                  className="rounded-lg border border-[var(--color-soft-sand)] px-4 py-2 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--color-brown-gold)] px-4 py-2 font-semibold text-white"
                >
                  Save Meeting Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
