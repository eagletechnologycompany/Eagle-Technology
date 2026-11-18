"use client";

import React, { useState } from "react";
import { Plus, CheckCircle2 } from "lucide-react";

interface ClientRequest {
  id: string;
  title: string;
  type: string;
  priority: string;
  details: string;
  status: string;
  founder_response: string;
  project_name: string | null;
  created_at: string;
}

export function RequestsClient({
  initialRequests,
}: {
  initialRequests: ClientRequest[];
}) {
  const [requests, setRequests] = useState<ClientRequest[]>(initialRequests);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("feature");
  const [priority, setPriority] = useState("medium");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/portal/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, type, priority, details }),
      });
      const data = await res.json();
      if (data.ok) {
        const newReq: ClientRequest = {
          id: data.id,
          title,
          type,
          priority,
          details,
          status: "received",
          founder_response: "",
          project_name: "Eagle Digital Platform Alpha",
          created_at: data.createdAt,
        };
        setRequests([newReq, ...requests]);
        setSuccessMessage("Request successfully submitted and queued for founding team review.");
        setShowForm(false);
        setTitle("");
        setDetails("");
      } else {
        alert(data.error || "Failed to submit request.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-soft-sand)] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-dark-brown)] sm:text-3xl">
            Inquiries &amp; Scope Requests
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted-brown)]">
            Submit new feature requests, architecture inquiries, or scope adjustments directly to the Eagle Technology founding team.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brown-gold)] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[var(--accent-hover)]"
        >
          <Plus className="h-4 w-4" />
          {showForm ? "Cancel Request" : "New Request"}
        </button>
      </div>

      {successMessage && (
        <div
          role="status"
          className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* New Request Modal / Inline Form */}
      {showForm && (
        <div className="rounded-2xl border border-[var(--color-brown-gold)]/40 bg-white p-6 sm:p-8 shadow-md">
          <h2 className="text-lg font-bold text-[var(--color-dark-brown)]">
            Submit New Project Request
          </h2>
          <p className="mt-1 text-xs text-[var(--color-muted-brown)]">
            Every request is directly triaged during our weekly founder engineering alignment meetings.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-dark-brown)] uppercase mb-1">
                  Request Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2 text-xs text-[var(--color-deep-brown)] focus:border-[var(--color-brown-gold)] focus:bg-white focus:outline-none"
                >
                  <option value="feature">New Feature / Capability</option>
                  <option value="change_request">Scope Revision</option>
                  <option value="bug">Issue / Bug Report</option>
                  <option value="consultation">Technical Consultation</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-dark-brown)] uppercase mb-1">
                  Urgency / Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2 text-xs text-[var(--color-deep-brown)] focus:border-[var(--color-brown-gold)] focus:bg-white focus:outline-none"
                >
                  <option value="low">Low (Next Milestone Planning)</option>
                  <option value="medium">Medium (Standard Sprint Backlog)</option>
                  <option value="high">High (Sprint Priority)</option>
                  <option value="urgent">Urgent (Immediate Review)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-dark-brown)] uppercase mb-1">
                Summary / Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Add Webhook Notification for Deliverable Status Changes"
                className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3.5 py-2 text-xs text-[var(--color-deep-brown)] focus:border-[var(--color-brown-gold)] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-dark-brown)] uppercase mb-1">
                Detailed Description &amp; Acceptance Criteria
              </label>
              <textarea
                rows={4}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what is required, expected behavior, and business context..."
                className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-3 text-xs text-[var(--color-deep-brown)] focus:border-[var(--color-brown-gold)] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-[var(--color-soft-sand)] px-4 py-2 text-xs font-semibold text-[var(--color-muted-brown)] hover:bg-[var(--color-warm-off-white)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-[var(--color-brown-gold)] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[var(--accent-hover)] disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit to Founders"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requests History List */}
      <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-bold text-[var(--color-dark-brown)] mb-4">
          Request Tracking Log ({requests.length})
        </h2>

        {requests.length > 0 ? (
          <div className="divide-y divide-[var(--color-soft-sand)]">
            {requests.map((item) => (
              <div key={item.id} className="py-5 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-[var(--color-pale-gold)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-dark-brown)] uppercase">
                        {item.type}
                      </span>
                      <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-700 capitalize">
                        Priority: {item.priority}
                      </span>
                      <span className="text-xs text-[var(--color-muted-brown)]">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="mt-1.5 text-base font-bold text-[var(--color-dark-brown)]">
                      {item.title}
                    </h3>
                  </div>

                  <span className="self-start rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200 capitalize">
                    {item.status.replace("_", " ")}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-[var(--color-muted-brown)]">
                  {item.details}
                </p>

                {item.founder_response ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-xs text-emerald-950">
                    <span className="font-semibold text-emerald-900">Founding Team Update: </span>
                    {item.founder_response}
                  </div>
                ) : (
                  <div className="text-[11px] text-[var(--color-muted-brown)] italic">
                    Queued for triage in the upcoming weekly founder sync.
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[var(--color-muted-brown)]">
            No requests on file. Use the button above to submit your first project inquiry.
          </div>
        )}
      </div>
    </div>
  );
}
