import React from "react";
import { getDb } from "@/server/db/client";
import { requireFounderPage } from "@/server/auth/session";
import { getAccessibleProjectIds } from "@/server/dashboard/queries";
import {
  CalendarClient,
  type CalendarEventItem,
} from "@/components/dashboard/CalendarClient";

export default async function CalendarPage() {
  const founder = await requireFounderPage();
  const db = getDb();
  const accessible = getAccessibleProjectIds(db, founder.userId, founder.roleId);

  const projects = (
    db
      .prepare("SELECT id, name FROM projects WHERE archived_at IS NULL")
      .all() as Array<{ id: string; name: string }>
  ).filter((p) => accessible.has(p.id));

  const tasks = db
    .prepare(
      `SELECT id, title, due_date, status, project_id, owner_user_id
       FROM tasks
       WHERE archived_at IS NULL AND due_date IS NOT NULL AND due_date != ''`
    )
    .all() as Array<{
    id: string;
    title: string;
    due_date: string;
    status: string;
    project_id: string | null;
    owner_user_id: string | null;
  }>;

  const milestones = db
    .prepare(
      `SELECT m.id, m.title, m.due_date, m.status, m.project_id, p.name as project_name
       FROM milestones m
       JOIN projects p ON p.id = m.project_id
       WHERE p.archived_at IS NULL AND m.due_date IS NOT NULL AND m.due_date != ''`
    )
    .all() as Array<{
    id: string;
    title: string;
    due_date: string;
    status: string;
    project_id: string;
    project_name: string;
  }>;

  const meetings = db
    .prepare("SELECT id, title, meeting_date, meeting_type FROM meetings")
    .all() as Array<{
    id: string;
    title: string;
    meeting_date: string;
    meeting_type: string;
  }>;

  const decisions = db
    .prepare(
      `SELECT id, title, review_date, status, related_project_id, owner_user_id
       FROM decisions
       WHERE archived_at IS NULL AND review_date IS NOT NULL AND review_date != ''`
    )
    .all() as Array<{
    id: string;
    title: string;
    review_date: string;
    status: string;
    related_project_id: string | null;
    owner_user_id: string;
  }>;

  const events: CalendarEventItem[] = [
    ...tasks.map((t) => ({
      id: `t-${t.id}`,
      date: t.due_date,
      title: t.title,
      category: "Task Due" as const,
      projectId: t.project_id,
      ownerId: t.owner_user_id,
      status: t.status,
      href: `/dashboard/tasks?task=${t.id}`,
    })),
    ...milestones
      .filter((m) => accessible.has(m.project_id))
      .map((m) => ({
        id: `m-${m.id}`,
        date: m.due_date,
        title: m.title,
        category: "Milestone" as const,
        projectId: m.project_id,
        projectName: m.project_name,
        status: m.status,
        href: `/dashboard/projects/${m.project_id}`,
      })),
    ...meetings.map((m) => ({
      id: `mtg-${m.id}`,
      date: m.meeting_date,
      title: m.title,
      category: "Meeting" as const,
      status: m.meeting_type,
      href: "/dashboard/decisions?tab=meetings",
    })),
    ...decisions.map((d) => ({
      id: `dec-${d.id}`,
      date: d.review_date,
      title: `Review: ${d.title}`,
      category: "Decision Review" as const,
      projectId: d.related_project_id,
      ownerId: d.owner_user_id,
      status: d.status,
      href: "/dashboard/decisions",
    })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  return <CalendarClient events={events} projects={projects} />;
}
