import { NextResponse } from "next/server";
import { PROJECT_PHASES, PROJECT_STATUSES } from "@/lib/dashboard-constants";
import { getDb } from "@/server/db/client";
import { hasPermission, requireApiAuth } from "@/server/auth/session";
import { generateId } from "@/server/auth/crypto";
import { logActivity, logAudit } from "@/server/auth/audit";
import { canAccessProject } from "@/server/dashboard/queries";
import { canUserAccessDocument } from "@/server/documents/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth("project.view");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const db = getDb();

  if (!canAccessProject(db, id, auth.founder.userId, auth.founder.roleId)) {
    return NextResponse.json(
      { ok: false, error: "You do not have access to this project." },
      { status: 403 }
    );
  }

  const project = db
    .prepare(
      `SELECT p.*, u.display_label as lead_label
       FROM projects p
       JOIN users u ON u.id = p.lead_user_id
       WHERE p.id = ?`
    )
    .get(id);

  if (!project) {
    return NextResponse.json({ ok: false, error: "Project not found." }, { status: 404 });
  }

  const tasks = db
    .prepare(
      `SELECT t.*, u.display_label as owner_label
       FROM tasks t
       LEFT JOIN users u ON u.id = t.owner_user_id
       WHERE t.project_id = ? AND t.archived_at IS NULL
       ORDER BY t.updated_at DESC`
    )
    .all(id);

  const milestones = db
    .prepare("SELECT * FROM milestones WHERE project_id = ? ORDER BY due_date ASC")
    .all(id);

  const risks = db
    .prepare(
      `SELECT r.*, u.display_label as owner_label
       FROM project_risks r
       LEFT JOIN users u ON u.id = r.owner_user_id
       WHERE r.project_id = ?
       ORDER BY r.created_at DESC`
    )
    .all(id);

  const members = db
    .prepare(
      `SELECT pm.*, u.display_label, u.role_id, r.short_title
       FROM project_members pm
       JOIN users u ON u.id = pm.user_id
       JOIN roles r ON r.id = u.role_id
       WHERE pm.project_id = ?`
    )
    .all(id);

  const rawDocs = db
    .prepare(
      `SELECT d.*, u.display_label as uploader_label
       FROM documents d
       JOIN users u ON u.id = d.uploaded_by
       WHERE d.related_project_id = ? AND d.archived_at IS NULL
       ORDER BY d.created_at DESC`
    )
    .all(id) as Array<{
    access_level: string;
    allowed_roles_json: string;
    related_project_id: string | null;
    owner_user_id: string;
    uploaded_by: string;
  } & Record<string, unknown>>;

  const documents = rawDocs.filter((doc) =>
    canUserAccessDocument(db, doc, auth.founder.userId, auth.founder.roleId)
  );

  const decisions = db
    .prepare(
      `SELECT d.*, u.display_label as owner_label
       FROM decisions d
       JOIN users u ON u.id = d.owner_user_id
       WHERE d.related_project_id = ? AND d.archived_at IS NULL
       ORDER BY d.decision_date DESC`
    )
    .all(id);

  const activity = db
    .prepare(
      `SELECT a.*, u.display_label as actor_label
       FROM activity_logs a
       LEFT JOIN users u ON u.id = a.actor_user_id
       WHERE a.entity_type = 'project' AND a.entity_id = ?
       ORDER BY a.created_at DESC`
    )
    .all(id);

  return NextResponse.json({
    ok: true,
    project,
    tasks,
    milestones,
    risks,
    members,
    documents,
    decisions,
    activity,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth("project.edit");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const db = getDb();
  const existing = db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as
    | { id: string; name: string; status: string; phase: string; archived_at: string | null }
    | undefined;

  if (!existing) {
    return NextResponse.json({ ok: false, error: "Project not found." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  if (body.archive === true && !hasPermission(auth.founder, "project.archive")) {
    return NextResponse.json(
      { ok: false, error: "Archiving projects requires project.archive permission." },
      { status: 403 }
    );
  }

  const now = new Date().toISOString();
  const nextStatus =
    typeof body.status === "string" &&
    (PROJECT_STATUSES as readonly string[]).includes(body.status)
      ? body.status
      : body.archive === true
        ? "Archived"
        : existing.status;

  const nextPhase =
    typeof body.phase === "string" &&
    (PROJECT_PHASES as readonly string[]).includes(body.phase)
      ? body.phase
      : existing.phase;

  db.prepare(
    `UPDATE projects SET
       name = COALESCE(?, name),
       objective = COALESCE(?, objective),
       description = COALESCE(?, description),
       status = ?,
       phase = ?,
       target_date = COALESCE(?, target_date),
       notes = COALESCE(?, notes),
       completion_review = COALESCE(?, completion_review),
       archived_at = ?,
       updated_at = ?
     WHERE id = ?`
  ).run(
    typeof body.name === "string" && body.name.trim() ? body.name.trim() : null,
    typeof body.objective === "string" ? body.objective.trim() : null,
    typeof body.description === "string" ? body.description.trim() : null,
    nextStatus,
    nextPhase,
    typeof body.targetDate === "string" ? body.targetDate.trim() : null,
    typeof body.notes === "string" ? body.notes.trim() : null,
    typeof body.completionReview === "string" ? body.completionReview.trim() : null,
    body.archive === true ? now : existing.archived_at,
    now,
    id
  );

  logActivity(db, {
    actorUserId: auth.founder.userId,
    entityType: "project",
    entityId: id,
    action: "updated",
    summary: `Updated project "${existing.name}" (${nextPhase} · ${nextStatus})`,
  });

  if (body.archive === true) {
    logAudit(db, {
      actorUserId: auth.founder.userId,
      actorRole: auth.founder.roleId,
      action: "project.archive",
      targetType: "project",
      targetId: id,
      status: "success",
    });
  }

  return NextResponse.json({ ok: true });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth("project.view");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const db = getDb();
  if (!canAccessProject(db, id, auth.founder.userId, auth.founder.roleId)) {
    return NextResponse.json({ ok: false, error: "Forbidden." }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const now = new Date().toISOString();

  if (body.kind === "milestone") {
    if (!hasPermission(auth.founder, "project.edit")) {
      return NextResponse.json({ ok: false, error: "Requires project.edit." }, { status: 403 });
    }
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      return NextResponse.json({ ok: false, error: "Milestone title required." }, { status: 422 });
    }
    const msId = generateId("ms");
    db.prepare(
      "INSERT INTO milestones (id, project_id, title, description, due_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(
      msId,
      id,
      title,
      typeof body.description === "string" ? body.description.trim() : "",
      typeof body.dueDate === "string" ? body.dueDate.trim() : "",
      "Planned",
      now,
      now
    );
    logActivity(db, {
      actorUserId: auth.founder.userId,
      entityType: "project",
      entityId: id,
      action: "milestone_added",
      summary: `Added milestone "${title}"`,
    });
    return NextResponse.json({ ok: true, id: msId }, { status: 201 });
  }

  if (body.kind === "milestone_toggle") {
    if (!hasPermission(auth.founder, "project.edit")) {
      return NextResponse.json({ ok: false, error: "Requires project.edit." }, { status: 403 });
    }
    const milestoneId = typeof body.milestoneId === "string" ? body.milestoneId : "";
    const status = typeof body.status === "string" ? body.status : "Completed";
    db.prepare(
      "UPDATE milestones SET status = ?, completed_at = ?, updated_at = ? WHERE id = ? AND project_id = ?"
    ).run(status, status === "Completed" ? now : null, now, milestoneId, id);
    return NextResponse.json({ ok: true });
  }

  if (body.kind === "risk") {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      return NextResponse.json({ ok: false, error: "Risk title required." }, { status: 422 });
    }
    const riskId = generateId("rsk");
    db.prepare(
      "INSERT INTO project_risks (id, project_id, title, severity, mitigation, status, owner_user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(
      riskId,
      id,
      title,
      typeof body.severity === "string" ? body.severity : "Medium",
      typeof body.mitigation === "string" ? body.mitigation.trim() : "",
      "Open",
      auth.founder.userId,
      now,
      now
    );
    logActivity(db, {
      actorUserId: auth.founder.userId,
      entityType: "project",
      entityId: id,
      action: "risk_logged",
      summary: `Logged risk "${title}"`,
    });
    return NextResponse.json({ ok: true, id: riskId }, { status: 201 });
  }

  return NextResponse.json({ ok: false, error: "Unknown action kind." }, { status: 400 });
}
