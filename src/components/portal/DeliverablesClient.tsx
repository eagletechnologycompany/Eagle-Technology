"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface Deliverable {
  id: string;
  project_id: string;
  project_name: string;
  title: string;
  category: string;
  summary: string;
  status: "pending_review" | "approved" | "revision_requested" | "in_progress" | "scheduled";
  review_notes: string;
  asset_url: string | null;
  submitter_name: string;
  reviewed_at: string | null;
  created_at: string;
}

export function DeliverablesClient({
  initialDeliverables,
}: {
  initialDeliverables: Deliverable[];
}) {
  const [deliverables, setDeliverables] = useState<Deliverable[]>(initialDeliverables);
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [modalAction, setModalAction] = useState<"approve" | "request_revision">("approve");
  const [reviewNotes, setReviewNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  async function handleActionSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeModalId) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/portal/deliverables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliverableId: activeModalId,
          action: modalAction,
          reviewNotes,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setDeliverables((prev) =>
          prev.map((d) =>
            d.id === activeModalId
              ? {
                  ...d,
                  status: data.status,
                  review_notes: reviewNotes,
                  reviewed_at: data.reviewedAt,
                }
              : d
          )
        );
        setFeedbackMessage(
          modalAction === "approve"
            ? "Deliverable successfully approved and logged in project audit history."
            : "Revision request submitted to the engineering and design team."
        );
        setActiveModalId(null);
        setReviewNotes("");
      }
    } catch {
      alert("Failed to submit review action. Please check your network connection.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {feedbackMessage && (
        <div
          role="status"
          className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{feedbackMessage}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Deliverables List */}
      <div className="grid grid-cols-1 gap-6">
        {deliverables.map((item) => {
          const isPending = item.status === "pending_review";
          const isApproved = item.status === "approved";
          const isRevision = item.status === "revision_requested";

          return (
            <div
              key={item.id}
              className={`rounded-2xl border bg-white p-6 sm:p-7 shadow-xs transition-all ${
                isPending
                  ? "border-[var(--color-brown-gold)]/60 ring-1 ring-[var(--color-brown-gold)]/20"
                  : "border-[var(--color-soft-sand)]"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-[var(--color-pale-gold)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--color-dark-brown)] uppercase">
                      {item.category}
                    </span>
                    <span className="text-xs text-[var(--color-muted-brown)]">
                      {item.project_name || "Eagle Digital Platform Alpha"}
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-bold text-[var(--color-dark-brown)] sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted-brown)] max-w-3xl sm:text-sm">
                    {item.summary}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {isPending && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                      <Clock className="h-3.5 w-3.5 text-amber-600" />
                      Awaiting Your Review
                    </span>
                  )}
                  {isApproved && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Deliverable Approved
                    </span>
                  )}
                  {isRevision && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800 border border-orange-200">
                      <RotateCcw className="h-3.5 w-3.5 text-orange-600" />
                      Revision Requested
                    </span>
                  )}
                  {item.status === "in_progress" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                      <Sparkles className="h-3.5 w-3.5 text-stone-500" />
                      In Engineering
                    </span>
                  )}
                </div>
              </div>

              {/* Review Notes / Context */}
              {item.review_notes && (
                <div className="mt-4 rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-3.5 text-xs text-[var(--color-muted-brown)]">
                  <span className="font-semibold text-[var(--color-dark-brown)]">Review Log / Notes: </span>
                  {item.review_notes}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-soft-sand)] pt-4">
                <div className="flex items-center gap-4 text-xs text-[var(--color-muted-brown)]">
                  <span>Prepared by: <strong className="text-[var(--color-dark-brown)]">{item.submitter_name || "Founding Team"}</strong></span>
                  {item.reviewed_at && (
                    <span>Last reviewed: {new Date(item.reviewed_at).toLocaleDateString()}</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {item.asset_url && (
                    <a
                      href={item.asset_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-soft-sand)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-dark-brown)] hover:bg-[var(--color-warm-off-white)]"
                    >
                      Inspect Specification
                      <ExternalLink className="h-3 w-3 text-[var(--color-brown-gold)]" />
                    </a>
                  )}

                  {isPending && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModalId(item.id);
                          setModalAction("request_revision");
                          setReviewNotes("");
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-800 hover:bg-orange-100"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Request Revision
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModalId(item.id);
                          setModalAction("approve");
                          setReviewNotes("Approved per client inspection criteria.");
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-brown-gold)] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--accent-hover)]"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve Deliverable
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Review Modal */}
      {activeModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-[var(--color-dark-brown)]">
              {modalAction === "approve" ? "Confirm Deliverable Sign-Off" : "Request Scope or Design Revision"}
            </h3>
            <p className="mt-1 text-xs text-[var(--color-muted-brown)]">
              {modalAction === "approve"
                ? "Signing off confirms this deliverable meets agreed acceptance criteria and advances the sprint to the next milestone."
                : "Describe the specific changes, revisions, or feedback for the founding engineering team."}
            </p>

            <form onSubmit={handleActionSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-dark-brown)] mb-1">
                  Review Notes / Feedback
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder={
                    modalAction === "approve"
                      ? "Add approval confirmation notes or sign-off remarks..."
                      : "Provide detailed feedback on what needs revision..."
                  }
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-3 text-xs text-[var(--color-deep-brown)] focus:border-[var(--color-brown-gold)] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalId(null)}
                  className="rounded-lg border border-[var(--color-soft-sand)] px-4 py-2 text-xs font-semibold text-[var(--color-muted-brown)] hover:bg-[var(--color-warm-off-white)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-xs disabled:opacity-60 ${
                    modalAction === "approve"
                      ? "bg-[var(--color-brown-gold)] hover:bg-[var(--accent-hover)]"
                      : "bg-orange-600 hover:bg-orange-700"
                  }`}
                >
                  {submitting ? "Submitting..." : modalAction === "approve" ? "Sign Off & Approve" : "Send Revision Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
