import { NextResponse } from "next/server";
import { GOAL_STATUSES } from "@/lib/dashboard-constants";
import { getDb } from "@/server/db/client";
import { requireApiAuth } from "@/server/auth/session";
import { generateId } from "@/server/auth/crypto";
import { logActivity } from "@/server/auth/audit";

export async function GET() {
  const auth = await requireApiAuth();
  if (!auth.ok) return auth.response;

  const db = getDb();
  const goals = db
    .prepare(
      `SELECT g.*, u.display_label as owner_label, p.name as project_name
       FROM goals g
       LEFT JOIN users u ON u.id = g.owner_user_id
       LEFT JOIN projects p ON p.id = g.related_project_id
       WHERE g.archived_at IS NULL
       ORDER BY g.created_at ASC, g.id ASC`
    )
    .all();

  return NextResponse.json({ ok: true, goals });
}

export async function POST(request: Request) {
  const auth = await requireApiAuth("goal.create");
  if (!auth.ok) return auth.response;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (title.length < 3) {
    return NextResponse.json({ ok: false, error: "Goal title required." }, { status: 422 });
  }

  const status =
    typeof body.status === "string" &&
    (GOAL_STATUSES as readonly string[]).includes(body.status)
      ? body.status
      : "Not started";

  const progress =
    typeof body.progress === "number" && body.progress >= 0 && body.progress <= 100
      ? Math.round(body.progress)
      : 0;

  const db = getDb();
  const id = generateId("goal");
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO goals (
      id, title, description, owner_user_id, time_period, status, progress,
      key_results_json, related_project_id, notes, review_date, is_demo, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
  ).run(
    id,
    title,
    typeof body.description === "string" ? body.description.trim() : "",
    typeof body.ownerUserId === "string" && body.ownerUserId.trim()
      ? body.ownerUserId.trim()
      : auth.founder.userId,
    typeof body.timePeriod === "string" && body.timePeriod.trim()
      ? body.timePeriod.trim()
      : "Initial 90-Day Roadmap",
    status,
    progress,
    JSON.stringify(Array.isArray(body.keyResults) ? body.keyResults : []),
    typeof body.relatedProjectId === "string" && body.relatedProjectId.trim()
      ? body.relatedProjectId.trim()
      : null,
    typeof body.notes === "string" ? body.notes.trim() : "",
    typeof body.reviewDate === "string" ? body.reviewDate.trim() : "",
    now,
    now
  );

  logActivity(db, {
    actorUserId: auth.founder.userId,
    entityType: "goal",
    entityId: id,
    action: "created",
    summary: `Created company goal "${title}"`,
  });

  return NextResponse.json({ ok: true, id }, { status: 201 });
}

export async function PATCH(request: Request) {
  const auth = await requireApiAuth("goal.edit");
  if (!auth.ok) return auth.response;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!id) {
    return NextResponse.json({ ok: false, error: "Goal id required." }, { status: 422 });
  }

  const db = getDb();
  const existing = db.prepare("SELECT id, title FROM goals WHERE id = ?").get(id) as
    | { id: string; title: string }
    | undefined;
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Goal not found." }, { status: 404 });
  }

  const now = new Date().toISOString();
  const status =
    typeof body.status === "string" &&
    (GOAL_STATUSES as readonly string[]).includes(body.status)
      ? body.status
      : null;

  const progress =
    typeof body.progress === "number" && body.progress >= 0 && body.progress <= 100
      ? Math.round(body.progress)
      : null;

  db.prepare(
    `UPDATE goals SET
       status = COALESCE(?, status),
       progress = COALESCE(?, progress),
       notes = COALESCE(?, notes),
       key_results_json = COALESCE(?, key_results_json),
       archived_at = CASE WHEN ? = 1 THEN ? ELSE archived_at END,
       updated_at = ?
     WHERE id = ?`
  ).run(
    status,
    progress,
    typeof body.notes === "string" ? body.notes.trim() : null,
    Array.isArray(body.keyResults) ? JSON.stringify(body.keyResults) : null,
    body.archive === true ? 1 : 0,
    now,
    now,
    id
  );

  logActivity(db, {
    actorUserId: auth.founder.userId,
    entityType: "goal",
    entityId: id,
    action: "updated",
    summary: `Updated goal "${existing.title}"`,
  });

  return NextResponse.json({ ok: true });
}
