import React from "react";
import Link from "next/link";
import {
  FileCheck,
  MessageSquarePlus,
  Code2,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { requirePortalPage } from "@/server/auth/session";
import { getDb } from "@/server/db/client";
import { OnboardingWalkthrough } from "@/components/portal/OnboardingWalkthrough";

export default async function PortalOverviewPage() {
  const user = await requirePortalPage();
  const db = getDb();

  // Fetch active project
  const project = db
    .prepare(
      `SELECT p.*, u.display_label as lead_name
       FROM projects p
       JOIN users u ON u.id = p.lead_user_id
       WHERE p.is_demo = 1
       LIMIT 1`
    )
    .get() as
    | {
        id: string;
        name: string;
        objective: string;
        problem_or_opportunity: string;
        description: string;
        status: string;
        phase: string;
        start_date: string | null;
        target_date: string | null;
        lead_name: string;
      }
    | undefined;

  // Fetch deliverables count
  const deliverables = db
    .prepare("SELECT status, COUNT(*) as count FROM client_deliverables GROUP BY status")
    .all() as Array<{ status: string; count: number }>;

  const pendingReviewCount =
    deliverables.find((d) => d.status === "pending_review")?.count ?? 0;
  const approvedCount =
    deliverables.find((d) => d.status === "approved")?.count ?? 0;

  // Fetch recent requests
  const recentRequests = db
    .prepare(
      `SELECT r.*, p.name as project_name
       FROM client_requests r
       LEFT JOIN projects p ON p.id = r.project_id
       ORDER BY r.created_at DESC
       LIMIT 3`
    )
    .all() as Array<{
    id: string;
    title: string;
    type: string;
    priority: string;
    status: string;
    created_at: string;
    founder_response: string;
  }>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-pale-gold)] px-3 py-1 text-xs font-semibold text-[var(--color-dark-brown)]">
                <span className="h-2 w-2 rounded-full bg-[var(--color-brown-gold)] animate-pulse" />
                Active Client Engagement
              </div>
              <OnboardingWalkthrough userDisplayLabel={user.displayLabel} />
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-dark-brown)] sm:text-3xl">
              Welcome, {user.displayLabel}
            </h1>
            <p className="mt-1 text-sm text-[var(--color-muted-brown)]">
              Track your active Eagle Technology project, review engineering deliverables, submit scope requests, and test integration tools.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/portal/deliverables"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brown-gold)] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[var(--accent-hover)]"
            >
              <FileCheck className="h-4 w-4" />
              Review Deliverables ({pendingReviewCount} pending)
            </Link>
            <Link
              href="/portal/requests"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-4 py-2.5 text-xs font-semibold text-[var(--color-dark-brown)] transition-colors hover:bg-white"
            >
              <MessageSquarePlus className="h-4 w-4 text-[var(--color-brown-gold)]" />
              Submit Request
            </Link>
          </div>
        </div>
      </div>

      {/* Active Project Card */}
      {project ? (
        <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-soft-sand)] pb-6">
            <div>
              <span className="text-xs font-semibold tracking-wider text-[var(--color-brown-gold)] uppercase">
                Active Project
              </span>
              <h2 className="mt-1 text-xl font-bold text-[var(--color-dark-brown)] sm:text-2xl">
                {project.name}
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted-brown)] max-w-2xl">
                {project.objective}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                {project.status}
              </span>
              <span className="rounded-full bg-[var(--color-pale-gold)] px-3 py-1 text-xs font-semibold text-[var(--color-dark-brown)]">
                Phase: {project.phase}
              </span>
            </div>
          </div>

          {/* Progress & Milestones Summary */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-4">
              <span className="text-xs font-semibold text-[var(--color-muted-brown)]">
                Phase Completion
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[var(--color-dark-brown)]">72%</span>
                <span className="text-xs text-[var(--color-brown-gold)] font-medium">On Schedule</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-stone-200">
                <div
                  className="h-full rounded-full bg-[var(--color-brown-gold)]"
                  style={{ width: "72%" }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-4">
              <span className="text-xs font-semibold text-[var(--color-muted-brown)]">
                Assigned Team Lead
              </span>
              <p className="mt-2 text-sm font-bold text-[var(--color-dark-brown)]">
                {project.lead_name}
              </p>
              <p className="text-xs text-[var(--color-muted-brown)]">
                Direct founder oversight
              </p>
            </div>

            <div className="rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-4">
              <span className="text-xs font-semibold text-[var(--color-muted-brown)]">
                Next Review Milestone
              </span>
              <div className="mt-2 flex items-center gap-1.5 text-sm font-bold text-[var(--color-dark-brown)]">
                <Calendar className="h-4 w-4 text-[var(--color-brown-gold)]" />
                Sprint 2 Demo
              </div>
              <p className="text-xs text-[var(--color-muted-brown)]">
                Target: {project.target_date || "To be confirmed"}
              </p>
            </div>

            <div className="rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-4">
              <span className="text-xs font-semibold text-[var(--color-muted-brown)]">
                Deliverables Status
              </span>
              <div className="mt-2 flex items-center gap-3 text-xs font-semibold">
                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {pendingReviewCount} In Review
                </span>
                <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {approvedCount} Approved
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Feature Tiles Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Deliverables Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 shadow-xs">
          <div>
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-pale-gold)] text-[var(--color-dark-brown)] mb-4">
              <FileCheck className="h-5 w-5 text-[var(--color-brown-gold)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-dark-brown)]">
              Deliverables &amp; Sign-Off
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted-brown)]">
              Inspect interactive design prototypes, architecture briefs, and code milestones. Provide structured feedback or formal milestone sign-off.
            </p>
          </div>
          <div className="mt-6 border-t border-[var(--color-soft-sand)] pt-4">
            <Link
              href="/portal/deliverables"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brown-gold)] hover:text-[var(--color-dark-brown)]"
            >
              Open Deliverables Center
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Developer Sandbox Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 shadow-xs">
          <div>
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-pale-gold)] text-[var(--color-dark-brown)] mb-4">
              <Code2 className="h-5 w-5 text-[var(--color-brown-gold)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-dark-brown)]">
              Developer Sandbox &amp; SDK
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted-brown)]">
              Generate integration sandbox API keys, inspect webhook payloads, and test sample code snippets in cURL, TypeScript, and Python.
            </p>
          </div>
          <div className="mt-6 border-t border-[var(--color-soft-sand)] pt-4">
            <Link
              href="/portal/developer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brown-gold)] hover:text-[var(--color-dark-brown)]"
            >
              Open Developer Sandbox
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Requests & Support Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 shadow-xs">
          <div>
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-pale-gold)] text-[var(--color-dark-brown)] mb-4">
              <MessageSquarePlus className="h-5 w-5 text-[var(--color-brown-gold)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-dark-brown)]">
              Requests &amp; Scope Updates
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted-brown)]">
              Submit new feature ideas, scope revisions, or technical inquiries directly to the engineering and design founders.
            </p>
          </div>
          <div className="mt-6 border-t border-[var(--color-soft-sand)] pt-4">
            <Link
              href="/portal/requests"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brown-gold)] hover:text-[var(--color-dark-brown)]"
            >
              View &amp; Submit Requests
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Client Requests History */}
      <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between border-b border-[var(--color-soft-sand)] pb-4">
          <h2 className="text-base font-bold text-[var(--color-dark-brown)]">
            Recent Communications &amp; Requests
          </h2>
          <Link
            href="/portal/requests"
            className="text-xs font-semibold text-[var(--color-brown-gold)] hover:text-[var(--color-dark-brown)]"
          >
            View all requests &rarr;
          </Link>
        </div>

        {recentRequests.length > 0 ? (
          <div className="mt-4 divide-y divide-[var(--color-soft-sand)]">
            {recentRequests.map((req) => (
              <div key={req.id} className="py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[var(--color-pale-gold)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-dark-brown)] uppercase">
                      {req.type}
                    </span>
                    <span className="text-xs font-bold text-[var(--color-dark-brown)]">
                      {req.title}
                    </span>
                  </div>
                  {req.founder_response && (
                    <p className="mt-1 text-xs text-[var(--color-muted-brown)]">
                      <strong className="text-[var(--color-dark-brown)]">Founder Response:</strong> {req.founder_response}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-700 capitalize">
                    {req.status.replace("_", " ")}
                  </span>
                  <span className="text-[11px] text-[var(--color-muted-brown)]">
                    {new Date(req.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[var(--color-muted-brown)]">
            No requests submitted yet. Use the &quot;Submit Request&quot; button above to initiate scope inquiries.
          </div>
        )}
      </div>
    </div>
  );
}
