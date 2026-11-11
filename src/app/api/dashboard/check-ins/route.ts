import { NextResponse } from "next/server";
import { getDb } from "@/server/db/client";
import { requireApiAuth } from "@/server/auth/session";
import { generateId } from "@/server/auth/crypto";
import { createNotification, logActivity } from "@/server/auth/audit";
import { getCurrentWeekStartIso, getTeamMembers } from "@/server/dashboard/queries";

export async function GET() {
  const auth = await requireApiAuth("team.view");
  if (!auth.ok) return auth.response;

  const db = getDb();
  const weekStart = getCurrentWeekStartIso();
  const today = new Date().toISOString().slice(0, 10);

  const members = getTeamMembers(db);
  const checkIns = db
    .prepare(
      `SELECT w.*, u.display_label, u.role_id, r.short_title
       FROM weekly_check_ins w
       JOIN users u ON u.id = w.user_id
       JOIN roles r ON r.id = u.role_id
       ORDER BY w.week_start DESC, w.updated_at DESC
       LIMIT 30`
    )
    .all();

  const workload = members.map((m) => {
    const openTasks = db
      .prepare(
        `SELECT id, title, status, priority, due_date, blocker_reason
         FROM tasks
         WHERE archived_at IS NULL AND status NOT IN ('Completed', 'Archived') AND owner_user_id = ?
         ORDER BY due_date ASC`
      )
      .all(m.id) as Array<{ status: string; due_date: string } & Record<string, unknown>>;

    const projectCount = (
      db
        .prepare(
          `SELECT COUNT(DISTINCT p.id) as c
           FROM projects p
           LEFT JOIN project_members pm ON pm.project_id = p.id
           WHERE p.archived_at IS NULL AND (p.lead_user_id = ? OR pm.user_id = ?)`
        )
        .get(m.id, m.id) as { c: number }
    ).c;

    const currentCheckIn = db
      .prepare("SELECT * FROM weekly_check_ins WHERE user_id = ? AND week_start = ?")
      .get(m.id, weekStart);

    return {
      ...m,
      openTaskCount: openTasks.length,
      blockedCount: openTasks.filter((t) => t.status === "Blocked").length,
      overdueCount: openTasks.filter((t) => t.due_date && t.due_date < today).length,
      projectCount,
      openTasks,
      currentCheckIn: currentCheckIn ?? null,
    };
  });

  const unassignedTasks = db
    .prepare(
      `SELECT id, title, status, priority, due_date FROM tasks
       WHERE archived_at IS NULL AND status NOT IN ('Completed', 'Archived')
         AND (owner_user_id IS NULL OR owner_user_id = '')`
    )
    .all();

  return NextResponse.json({
    ok: true,
    weekStart,
    workload,
    checkIns,
    unassignedTasks,
  });
}

export async function POST(request: Request) {
  const auth = await requireApiAuth("team.view");
  if (!auth.ok) return auth.response;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const completedLastWeek =
    typeof body.completedLastWeek === "string" ? body.completedLastWeek.trim() : "";
  const plannedThisWeek =
    typeof body.plannedThisWeek === "string" ? body.plannedThisWeek.trim() : "";

  if (!completedLastWeek || !plannedThisWeek) {
    return NextResponse.json(
      { ok: false, error: "Completed last week and planned this week are required." },
      { status: 422 }
    );
  }

  const db = getDb();
  const weekStart =
    typeof body.weekStart === "string" && body.weekStart.trim()
      ? body.weekStart.trim()
      : getCurrentWeekStartIso();
  const now = new Date().toISOString();

  const existing = db
    .prepare("SELECT id FROM weekly_check_ins WHERE user_id = ? AND week_start = ?")
    .get(auth.founder.userId, weekStart) as { id: string } | undefined;

  const currentBlocker =
    typeof body.currentBlocker === "string" ? body.currentBlocker.trim() : "";
  const supportNeeded =
    typeof body.supportNeeded === "string" ? body.supportNeeded.trim() : "";
  const importantUpdate =
    typeof body.importantUpdate === "string" ? body.importantUpdate.trim() : "";
  const confidenceLevel =
    typeof body.confidenceLevel === "string" && body.confidenceLevel.trim()
      ? body.confidenceLevel.trim()
      : "Steady";

  if (existing) {
    db.prepare(
      `UPDATE weekly_check_ins SET
         completed_last_week = ?,
         planned_this_week = ?,
         current_blocker = ?,
         support_needed = ?,
         important_update = ?,
         confidence_level = ?,
         updated_at = ?
       WHERE id = ?`
    ).run(
      completedLastWeek,
      plannedThisWeek,
      currentBlocker,
      supportNeeded,
      importantUpdate,
      confidenceLevel,
      now,
      existing.id
    );
  } else {
    db.prepare(
      `INSERT INTO weekly_check_ins (
         id, user_id, week_start, completed_last_week, planned_this_week,
         current_blocker, support_needed, important_update, confidence_level,
         is_demo, created_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
    ).run(
      generateId("chk"),
      auth.founder.userId,
      weekStart,
      completedLastWeek,
      plannedThisWeek,
      currentBlocker,
      supportNeeded,
      importantUpdate,
      confidenceLevel,
      now,
      now
    );
  }

  logActivity(db, {
    actorUserId: auth.founder.userId,
    entityType: "check_in",
    entityId: weekStart,
    action: "submitted",
    summary: `Submitted weekly check-in for week of ${weekStart}`,
  });

  if (currentBlocker && auth.founder.userId !== "usr_ceo") {
    createNotification(db, {
      recipientUserId: "usr_ceo",
      type: "blocker",
      title: "Weekly Check-in Blocker",
      message: `${auth.founder.shortTitle} reported a blocker in their weekly check-in.`,
      linkHref: "/dashboard/team",
    });
  }

  return NextResponse.json({ ok: true });
}
