import { NextResponse } from "next/server";
import { PROJECT_PHASES, PROJECT_STATUSES } from "@/lib/dashboard-constants";
import { getDb } from "@/server/db/client";
import { requireApiAuth } from "@/server/auth/session";
import { generateId } from "@/server/auth/crypto";
import { logActivity, logAudit } from "@/server/auth/audit";
import { getAccessibleProjectIds } from "@/server/dashboard/queries";

export async function GET() {
  const auth = await requireApiAuth("project.view");
  if (!auth.ok) return auth.response;

  const db = getDb();
  const accessible = getAccessibleProjectIds(db, auth.founder.userId, auth.founder.roleId);
  const rows = db
    .prepare(
      `SELECT p.*, u.display_label as lead_label,
              (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.archived_at IS NULL) as task_count,
              (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.archived_at IS NULL AND t.status = 'Completed') as completed_task_count,
              (SELECT COUNT(*) FROM milestones m WHERE m.project_id = p.id) as milestone_count
       FROM projects p
       JOIN users u ON u.id = p.lead_user_id
       WHERE p.archived_at IS NULL
       ORDER BY p.updated_at DESC`
    )
    .all() as Array<{ id: string } & Record<string, unknown>>;

  const projects = rows.filter((p) => accessible.has(p.id));
  return NextResponse.json({ ok: true, projects });
}

export async function POST(request: Request) {
  const auth = await requireApiAuth("project.create");
  if (!auth.ok) return auth.response;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const objective = typeof body.objective === "string" ? body.objective.trim() : "";
  const problemOrOpportunity =
    typeof body.problemOrOpportunity === "string" ? body.problemOrOpportunity.trim() : "";

  if (name.length < 3 || objective.length < 5) {
    return NextResponse.json(
      { ok: false, error: "Project name and objective are required." },
      { status: 422 }
    );
  }

  const status =
    typeof body.status === "string" &&
    (PROJECT_STATUSES as readonly string[]).includes(body.status)
      ? body.status
      : "Discovery";

  const phase =
    typeof body.phase === "string" &&
    (PROJECT_PHASES as readonly string[]).includes(body.phase)
      ? body.phase
      : "Identify";

  const leadUserId =
    typeof body.leadUserId === "string" && body.leadUserId.trim()
      ? body.leadUserId.trim()
      : auth.founder.userId;

  const db = getDb();
  const projectId = generateId("proj");
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO projects (
      id, name, objective, problem_or_opportunity, description, lead_user_id,
      status, phase, start_date, target_date, deliverables_json, dependencies_json,
      notes, is_demo, created_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`
  ).run(
    projectId,
    name,
    objective,
    problemOrOpportunity || objective,
    typeof body.description === "string" ? body.description.trim() : "",
    leadUserId,
    status,
    phase,
    typeof body.startDate === "string" ? body.startDate.trim() : now.slice(0, 10),
    typeof body.targetDate === "string" ? body.targetDate.trim() : "",
    JSON.stringify(Array.isArray(body.deliverables) ? body.deliverables : []),
    JSON.stringify(Array.isArray(body.dependencies) ? body.dependencies : []),
    typeof body.notes === "string" ? body.notes.trim() : "",
    auth.founder.userId,
    now,
    now
  );

  const memberIds = new Set<string>([leadUserId, auth.founder.userId]);
  if (Array.isArray(body.memberIds)) {
    for (const id of body.memberIds) {
      if (typeof id === "string" && id.trim()) memberIds.add(id.trim());
    }
  }
  const addMember = db.prepare(
    "INSERT OR IGNORE INTO project_members (project_id, user_id, project_role, added_at) VALUES (?, ?, ?, ?)"
  );
  for (const uid of memberIds) {
    addMember.run(projectId, uid, uid === leadUserId ? "Lead" : "Member", now);
  }

  logActivity(db, {
    actorUserId: auth.founder.userId,
    entityType: "project",
    entityId: projectId,
    action: "created",
    summary: `Created project "${name}" (${phase} · ${status})`,
  });

  logAudit(db, {
    actorUserId: auth.founder.userId,
    actorRole: auth.founder.roleId,
    action: "project.create",
    targetType: "project",
    targetId: projectId,
    status: "success",
  });

  return NextResponse.json({ ok: true, projectId }, { status: 201 });
}
