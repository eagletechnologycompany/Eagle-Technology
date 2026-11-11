import { NextResponse } from "next/server";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  TASK_TYPES,
} from "@/lib/dashboard-constants";
import { getDb } from "@/server/db/client";
import { hasPermission, requireApiAuth } from "@/server/auth/session";
import { generateId } from "@/server/auth/crypto";
import {
  createNotification,
  logActivity,
  logAudit,
} from "@/server/auth/audit";

export async function GET(request: Request) {
  const auth = await requireApiAuth("task.view");
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status")?.trim() || "";
  const priority = searchParams.get("priority")?.trim() || "";
  const owner = searchParams.get("owner")?.trim() || "";
  const projectId = searchParams.get("projectId")?.trim() || "";
  const taskType = searchParams.get("taskType")?.trim() || "";
  const q = searchParams.get("q")?.trim() || "";
  const mineOnly = searchParams.get("mine") === "1";
  const includeArchived = searchParams.get("archived") === "1";

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (!includeArchived) {
    conditions.push("t.archived_at IS NULL AND t.status != 'Archived'");
  }
  if (mineOnly) {
    conditions.push("(t.owner_user_id = ? OR t.collaborators_json LIKE ?)");
    params.push(auth.founder.userId, `%"${auth.founder.userId}"%`);
  }
  if (status) {
    conditions.push("t.status = ?");
    params.push(status);
  }
  if (priority) {
    conditions.push("t.priority = ?");
    params.push(priority);
  }
  if (owner) {
    conditions.push("t.owner_user_id = ?");
    params.push(owner);
  }
  if (projectId) {
    conditions.push("t.project_id = ?");
    params.push(projectId);
  }
  if (taskType) {
    conditions.push("t.task_type = ?");
    params.push(taskType);
  }
  if (q) {
    conditions.push("(t.title LIKE ? OR t.description LIKE ? OR t.labels_json LIKE ?)");
    const like = `%${q}%`;
    params.push(like, like, like);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT t.*, p.name as project_name, u.display_label as owner_label, u.role_id as owner_role_id
       FROM tasks t
       LEFT JOIN projects p ON p.id = t.project_id
       LEFT JOIN users u ON u.id = t.owner_user_id
       ${whereClause}
       ORDER BY CASE t.priority WHEN 'Urgent' THEN 1 WHEN 'High' THEN 2 WHEN 'Normal' THEN 3 ELSE 4 END,
                COALESCE(NULLIF(t.due_date, ''), '9999-12-31') ASC,
                t.updated_at DESC
       LIMIT 200`
    )
    .all(...params);

  return NextResponse.json({ ok: true, tasks: rows });
}

export async function POST(request: Request) {
  const auth = await requireApiAuth("task.create");
  if (!auth.ok) return auth.response;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (title.length < 3) {
    return NextResponse.json(
      { ok: false, error: "Task title must be at least 3 characters." },
      { status: 422 }
    );
  }

  const requestedOwner =
    typeof body.ownerUserId === "string" && body.ownerUserId.trim()
      ? body.ownerUserId.trim()
      : auth.founder.userId;

  if (
    requestedOwner !== auth.founder.userId &&
    !hasPermission(auth.founder, "task.assign")
  ) {
    const db = getDb();
    logAudit(db, {
      actorUserId: auth.founder.userId,
      actorRole: auth.founder.roleId,
      action: "task.assign_denied",
      targetType: "task",
      targetId: "new",
      status: "denied",
      details: { requestedOwner },
    });
    return NextResponse.json(
      { ok: false, error: "Only roles with task.assign can assign tasks to other founders." },
      { status: 403 }
    );
  }

  const status =
    typeof body.status === "string" &&
    (TASK_STATUSES as readonly string[]).includes(body.status)
      ? body.status
      : "Backlog";

  const priority =
    typeof body.priority === "string" &&
    (TASK_PRIORITIES as readonly string[]).includes(body.priority)
      ? body.priority
      : "Normal";

  const taskType =
    typeof body.taskType === "string" &&
    (TASK_TYPES as readonly string[]).includes(body.taskType)
      ? body.taskType
      : "Development";

  const db = getDb();
  const taskId = generateId("task");
  const now = new Date().toISOString();
  const labels = Array.isArray(body.labels)
    ? body.labels.filter((l): l is string => typeof l === "string" && l.trim().length > 0)
    : [];
  const collaborators = Array.isArray(body.collaborators)
    ? body.collaborators.filter((c): c is string => typeof c === "string" && c.trim().length > 0)
    : [];
  const dependencies = Array.isArray(body.dependencies)
    ? body.dependencies.filter((d): d is string => typeof d === "string" && d.trim().length > 0)
    : [];

  const projectId =
    typeof body.projectId === "string" && body.projectId.trim()
      ? body.projectId.trim()
      : null;

  db.prepare(
    `INSERT INTO tasks (
      id, title, description, project_id, task_type, owner_user_id,
      collaborators_json, status, priority, due_date, start_date,
      estimated_effort, labels_json, dependencies_json, blocker_reason,
      is_demo, created_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`
  ).run(
    taskId,
    title,
    typeof body.description === "string" ? body.description.trim() : "",
    projectId,
    taskType,
    requestedOwner,
    JSON.stringify(collaborators),
    status,
    priority,
    typeof body.dueDate === "string" ? body.dueDate.trim() : "",
    typeof body.startDate === "string" ? body.startDate.trim() : now.slice(0, 10),
    typeof body.estimatedEffort === "string" ? body.estimatedEffort.trim() : "",
    JSON.stringify(labels),
    JSON.stringify(dependencies),
    typeof body.blockerReason === "string" ? body.blockerReason.trim() : "",
    auth.founder.userId,
    now,
    now
  );

  logActivity(db, {
    actorUserId: auth.founder.userId,
    entityType: "task",
    entityId: taskId,
    action: "created",
    summary: `Created task "${title}" (${priority} · ${status})`,
  });

  if (requestedOwner !== auth.founder.userId) {
    createNotification(db, {
      recipientUserId: requestedOwner,
      type: "task_assigned",
      title: "New Task Assigned",
      message: `${auth.founder.shortTitle} assigned "${title}" to you.`,
      linkHref: `/dashboard/tasks?task=${taskId}`,
    });
  }

  const created = db
    .prepare(
      `SELECT t.*, p.name as project_name, u.display_label as owner_label
       FROM tasks t
       LEFT JOIN projects p ON p.id = t.project_id
       LEFT JOIN users u ON u.id = t.owner_user_id
       WHERE t.id = ?`
    )
    .get(taskId);

  return NextResponse.json({ ok: true, task: created }, { status: 201 });
}
