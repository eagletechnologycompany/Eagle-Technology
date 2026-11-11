import React from "react";
import Link from "next/link";
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  FolderKanban,
  Users,
  Scale,
  ArrowRight,
  Plus,
  Target,
} from "lucide-react";
import { getDb } from "@/server/db/client";
import { requireFounderPage } from "@/server/auth/session";
import { getOverviewData } from "@/server/dashboard/queries";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { EmptyState } from "@/components/dashboard/DashboardStates";

export default async function DashboardOverviewPage() {
  const founder = await requireFounderPage();
  const db = getDb();
  const data = getOverviewData(db, founder.userId, founder.roleId);

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const canCreateProject = founder.permissions.includes("project.create");
  const checkInsSubmitted = data.workloadSummary.filter((m) => m.hasWeeklyCheckIn).length;

  const cards = [
    {
      label: "My Open Tasks",
      value: data.summary.myOpenCount,
      sub: "Assigned or collaborating",
      href: "/dashboard/my-tasks",
      icon: CheckSquare,
    },
    {
      label: "Due This Week",
      value: data.summary.dueThisWeekCount,
      sub: "Next 7 days",
      href: "/dashboard/calendar",
      icon: Clock,
    },
    {
      label: "Blocked Items",
      value: data.summary.blockedCount,
      sub: "Needs unblocking",
      href: "/dashboard/tasks?status=Blocked",
      icon: AlertTriangle,
    },
    {
      label: "Active Projects",
      value: data.summary.activeProjectsCount,
      sub: "In progress or discovery",
      href: "/dashboard/projects",
      icon: FolderKanban,
    },
    {
      label: "Team Progress",
      value: `${checkInsSubmitted}/5`,
      sub: `${data.summary.completedThisWeek} tasks completed this week`,
      href: "/dashboard/team",
      icon: Users,
    },
    {
      label: "Pending Decisions",
      value: data.summary.pendingDecisionsCount,
      sub: "Proposed or under discussion",
      href: "/dashboard/decisions",
      icon: Scale,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting & Quick Actions */}
      <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--color-brown-gold)] uppercase">
            {formattedDate} · Week of {data.weekStart}
          </p>
          <h2 className="mt-1.5 text-2xl font-bold text-[var(--color-dark-brown)]">
            Welcome, {founder.roleTitle}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted-brown)]">
            Current week summary: {data.summary.completedThisWeek} completed tasks ·{" "}
            {data.summary.unassignedCount} unassigned open items · {checkInsSubmitted}/5
            weekly check-ins submitted.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/dashboard/tasks?new=1"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brown-gold)] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[var(--accent-hover)]"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            New Task
          </Link>
          {canCreateProject && (
            <Link
              href="/dashboard/projects?new=1"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3.5 py-2 text-xs font-semibold text-[var(--color-dark-brown)] hover:bg-[var(--color-pale-gold)]"
            >
              New Project
            </Link>
          )}
          <Link
            href="/dashboard/team#checkin"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3.5 py-2 text-xs font-semibold text-[var(--color-dark-brown)] hover:bg-[var(--color-pale-gold)]"
          >
            Weekly Check-in
          </Link>
          <Link
            href="/dashboard/decisions?new=1"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3.5 py-2 text-xs font-semibold text-[var(--color-dark-brown)] hover:bg-[var(--color-pale-gold)]"
          >
            Log Decision
          </Link>
        </div>
      </section>

      {/* 6 Operational Summary Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group flex items-start justify-between rounded-2xl border border-[var(--color-soft-sand)] bg-white p-5 transition-shadow hover:shadow-sm"
            >
              <div>
                <p className="text-xs font-semibold text-[var(--color-muted-brown)] uppercase">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-[var(--color-dark-brown)]">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-[var(--color-muted-brown)]">{card.sub}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-pale-gold)] text-[var(--color-dark-brown)] group-hover:bg-[var(--color-brown-gold)] group-hover:text-white transition-colors">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
            </Link>
          );
        })}
      </section>

      {/* Main 2-Column Operational Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 7 cols */}
        <div className="space-y-6 lg:col-span-7">
          {/* My Open Tasks */}
          <section className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--color-dark-brown)]">
                My Open Tasks
              </h3>
              <Link
                href="/dashboard/my-tasks"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-brown-gold)] hover:underline"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {data.myOpenTasks.length === 0 ? (
              <EmptyState
                title="No tasks assigned yet."
                description="Create a task or check All Tasks to pick up work for your role."
              />
            ) : (
              <div className="divide-y divide-[var(--color-soft-sand)]">
                {data.myOpenTasks.map((t) => (
                  <Link
                    key={String(t.id)}
                    href={`/dashboard/tasks?task=${String(t.id)}`}
                    className="flex items-center justify-between gap-3 py-3 hover:bg-[var(--color-warm-off-white)] px-2 rounded-lg transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--color-dark-brown)]">
                        {String(t.title)}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--color-muted-brown)]">
                        {t.project_name ? String(t.project_name) : "General"} ·{" "}
                        {t.due_date ? `Due ${String(t.due_date)}` : "No due date"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <StatusBadge value={String(t.priority)} />
                      <StatusBadge value={String(t.status)} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Blocked & Due Soon */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6">
              <h3 className="mb-4 text-base font-bold text-[var(--color-dark-brown)]">
                Blocked Tasks
              </h3>
              {data.blockedTasks.length === 0 ? (
                <p className="text-xs text-[var(--color-muted-brown)]">
                  No blocked tasks reported right now.
                </p>
              ) : (
                <ul className="space-y-3">
                  {data.blockedTasks.map((t) => (
                    <li
                      key={String(t.id)}
                      className="rounded-xl border border-red-200 bg-red-50/50 p-3 text-xs"
                    >
                      <Link
                        href={`/dashboard/tasks?task=${String(t.id)}`}
                        className="font-semibold text-[var(--color-dark-brown)] hover:underline"
                      >
                        {String(t.title)}
                      </Link>
                      {Boolean(t.blocker_reason) && (
                        <p className="mt-1 text-red-800">{String(t.blocker_reason)}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6">
              <h3 className="mb-4 text-base font-bold text-[var(--color-dark-brown)]">
                Upcoming Milestones
              </h3>
              {data.upcomingMilestones.length === 0 ? (
                <p className="text-xs text-[var(--color-muted-brown)]">
                  No upcoming milestones scheduled.
                </p>
              ) : (
                <ul className="space-y-3">
                  {data.upcomingMilestones.map((m) => (
                    <li
                      key={String(m.id)}
                      className="rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-3 text-xs"
                    >
                      <p className="font-semibold text-[var(--color-dark-brown)]">
                        {String(m.title)}
                      </p>
                      <p className="mt-0.5 text-[var(--color-muted-brown)]">
                        {String(m.project_name)} · {m.due_date ? String(m.due_date) : "TBD"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Active Projects */}
          <section className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--color-dark-brown)]">
                Active Projects
              </h3>
              <Link
                href="/dashboard/projects"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-brown-gold)] hover:underline"
              >
                All projects <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {data.activeProjects.length === 0 ? (
              <EmptyState title="No projects are active." />
            ) : (
              <div className="space-y-3">
                {data.activeProjects.map((p) => (
                  <Link
                    key={String(p.id)}
                    href={`/dashboard/projects/${String(p.id)}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-4 hover:border-[var(--color-brown-gold)] transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[var(--color-dark-brown)]">
                        {String(p.name)}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[var(--color-muted-brown)]">
                        Phase: {String(p.phase)} · Lead: {String(p.lead_label)}
                      </p>
                    </div>
                    <StatusBadge value={String(p.status)} />
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right 5 cols */}
        <div className="space-y-6 lg:col-span-5">
          {/* Team Workload Summary */}
          <section className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--color-dark-brown)]">
                Team Workload Summary
              </h3>
              <Link
                href="/dashboard/team"
                className="text-xs font-semibold text-[var(--color-brown-gold)] hover:underline"
              >
                Team &amp; Check-ins
              </Link>
            </div>
            <div className="space-y-3">
              {data.workloadSummary.map((m) => (
                <div
                  key={m.userId}
                  className="flex items-center justify-between rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3.5 py-2.5 text-xs"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[var(--color-dark-brown)]">
                      {m.roleTitle}
                    </p>
                    <p className="text-[11px] text-[var(--color-muted-brown)]">
                      {m.hasWeeklyCheckIn ? "Check-in submitted" : "Check-in pending"}
                      {m.blockedTasks > 0 ? ` · ${m.blockedTasks} blocked` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-2.5 py-1 font-bold text-[var(--color-dark-brown)] border border-[var(--color-soft-sand)]">
                    {m.openTasks} open
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Pending Decisions */}
          <section className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--color-dark-brown)]">
                Pending Decisions
              </h3>
              <Link
                href="/dashboard/decisions"
                className="text-xs font-semibold text-[var(--color-brown-gold)] hover:underline"
              >
                Decision Log
              </Link>
            </div>
            {data.pendingDecisions.length === 0 ? (
              <p className="text-xs text-[var(--color-muted-brown)]">
                No decisions have been recorded.
              </p>
            ) : (
              <div className="space-y-3">
                {data.pendingDecisions.map((d) => (
                  <Link
                    key={String(d.id)}
                    href="/dashboard/decisions"
                    className="block rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-3 text-xs hover:border-[var(--color-brown-gold)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-[var(--color-dark-brown)]">
                        {String(d.title)}
                      </p>
                      <StatusBadge value={String(d.status)} />
                    </div>
                    <p className="mt-1 text-[11px] text-[var(--color-muted-brown)]">
                      Owner: {String(d.owner_label)} · {String(d.decision_date)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Company Goals Progress */}
          <section className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-bold text-[var(--color-dark-brown)]">
                <Target className="h-4 w-4 text-[var(--color-brown-gold)]" />
                Company Focus Goals
              </h3>
              <Link
                href="/dashboard/goals"
                className="text-xs font-semibold text-[var(--color-brown-gold)] hover:underline"
              >
                All {data.summary.goalsTotal}
              </Link>
            </div>
            <div className="space-y-3">
              {data.goals.map((g) => (
                <div key={String(g.id)} className="text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium text-[var(--color-dark-brown)]">
                      {String(g.title)}
                    </span>
                    <span className="shrink-0 text-[var(--color-muted-brown)]">
                      {Number(g.progress)}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-soft-sand)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-brown-gold)]"
                      style={{ width: `${Number(g.progress)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--color-dark-brown)]">
                Recent Activity
              </h3>
              <Link
                href="/dashboard/activity"
                className="text-xs font-semibold text-[var(--color-brown-gold)] hover:underline"
              >
                Full log
              </Link>
            </div>
            <div className="space-y-3">
              {data.recentActivity.slice(0, 6).map((act) => (
                <div key={String(act.id)} className="text-xs">
                  <p className="text-[var(--color-dark-brown)]">{String(act.summary)}</p>
                  <p className="mt-0.5 text-[11px] text-[var(--color-muted-brown)]">
                    {act.actor_label ? String(act.actor_label) : "System"} ·{" "}
                    {String(act.created_at).slice(0, 16).replace("T", " ")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
