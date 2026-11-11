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
import { validateAndSavePrivateFile } from "@/server/documents/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth("task.view");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const db = getDb();
  const task = db
    .prepare(
      `SELECT t.*, p.name as project_name, u.display_label as owner_label
       FROM tasks t
       LEFT JOIN projects p ON p.id = t.project_id
       LEFT JOIN users u ON u.id = t.owner_user_id
       WHERE t.id = ?`
    )
    .get(id);

  if (!task) {
    return NextResponse.json({ ok: false, error: "Task not found." }, { status: 404 });
  }

  const comments = db
    .prepare(
      `SELECT c.*, u.display_label as author_label, u.role_id as author_role_id
       FROM task_comments c
       JOIN users u ON u.id = c.author_user_id
       WHERE c.task_id = ?
       ORDER BY c.created_at ASC`
    )
    .all(id);

  const attachments = db
    .prepare(
      `SELECT a.id, a.file_name, a.mime_type, a.size_bytes, a.uploaded_by, a.created_at,
              u.display_label as uploader_label
       FROM task_attachments a
       JOIN users u ON u.id = a.uploaded_by
       WHERE a.task_id = ?
       ORDER BY a.created_at DESC`
    )
    .all(id);

  const activity = db
    .prepare(
      `SELECT a.*, u.display_label as actor_label
       FROM activity_logs a
       LEFT JOIN users u ON u.id = a.actor_user_id
       WHERE a.entity_type = 'task' AND a.entity_id = ?
       ORDER BY a.created_at DESC`
    )
    .all(id);

  return NextResponse.json({ ok: true, task, comments, attachments, activity });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth("task.edit");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const db = getDb();
  const existing = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as
    | {
        id: string;
        title: string;
        owner_user_id: string | null;
        status: string;
        priority: string;
        archived_at: string | null;
      }
    | undefined;

  if (!existing) {
    return NextResponse.json({ ok: false, error: "Task not found." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  // Non-CEO roles without task.assign can only update tasks assigned to them or created by them
  const isOwnerOrAssigner =
    existing.owner_user_id === auth.founder.userId ||
    hasPermission(auth.founder, "task.assign");

  if (!isOwnerOrAssigner) {
    return NextResponse.json(
      { ok: false, error: "You can only edit tasks assigned to your role." },
      { status: 403 }
    );
  }

  if (
    typeof body.ownerUserId === "string" &&
    body.ownerUserId !== existing.owner_user_id &&
    !hasPermission(auth.founder, "task.assign")
  ) {
    logAudit(db, {
      actorUserId: auth.founder.userId,
      actorRole: auth.founder.roleId,
      action: "task.reassign_denied",
      targetType: "task",
      targetId: id,
      status: "denied",
    });
    return NextResponse.json(
      { ok: false, error: "Reassigning tasks requires task.assign permission." },
      { status: 403 }
    );
  }

  if (body.archive === true && !hasPermission(auth.founder, "task.delete")) {
    return NextResponse.json(
      { ok: false, error: "Archiving tasks requires task.delete permission." },
      { status: 403 }
    );
  }

  const now = new Date().toISOString();
  const nextStatus =
    typeof body.status === "string" &&
    (TASK_STATUSES as readonly string[]).includes(body.status)
      ? body.status
      : body.archive === true
        ? "Archived"
        : existing.status;

  const nextPriority =
    typeof body.priority === "string" &&
    (TASK_PRIORITIES as readonly string[]).includes(body.priority)
      ? body.priority
      : existing.priority;

  const nextOwner =
    typeof body.ownerUserId === "string" ? body.ownerUserId.trim() : existing.owner_user_id;

  const nextArchivedAt =
    body.archive === true || nextStatus === "Archived" ? now : existing.archived_at;

  const nextTitle =
    typeof body.title === "string" && body.title.trim().length >= 3
      ? body.title.trim()
      : existing.title;

  db.prepare(
    `UPDATE tasks SET
       title = ?,
       description = COALESCE(?, description),
       project_id = CASE WHEN ? = 1 THEN ? ELSE project_id END,
       task_type = COALESCE(?, task_type),
       owner_user_id = ?,
       status = ?,
       priority = ?,
       due_date = COALESCE(?, due_date),
       estimated_effort = COALESCE(?, estimated_effort),
       blocker_reason = COALESCE(?, blocker_reason),
       completion_notes = COALESCE(?, completion_notes),
       labels_json = COALESCE(?, labels_json),
       dependencies_json = COALESCE(?, dependencies_json),
       archived_at = ?,
       updated_at = ?
     WHERE id = ?`
  ).run(
    nextTitle,
    typeof body.description === "string" ? body.description.trim() : null,
    "projectId" in body ? 1 : 0,
    typeof body.projectId === "string" && body.projectId.trim() ? body.projectId.trim() : null,
    typeof body.taskType === "string" && (TASK_TYPES as readonly string[]).includes(body.taskType)
      ? body.taskType
      : null,
    nextOwner || null,
    nextStatus,
    nextPriority,
    typeof body.dueDate === "string" ? body.dueDate.trim() : null,
    typeof body.estimatedEffort === "string" ? body.estimatedEffort.trim() : null,
    typeof body.blockerReason === "string" ? body.blockerReason.trim() : null,
    typeof body.completionNotes === "string" ? body.completionNotes.trim() : null,
    Array.isArray(body.labels) ? JSON.stringify(body.labels) : null,
    Array.isArray(body.dependencies) ? JSON.stringify(body.dependencies) : null,
    nextArchivedAt,
    now,
    id
  );

  logActivity(db, {
    actorUserId: auth.founder.userId,
    entityType: "task",
    entityId: id,
    action: nextStatus !== existing.status ? `status:${nextStatus}` : "updated",
    summary: `Updated "${nextTitle}" (status: ${nextStatus}, priority: ${nextPriority})`,
  });

  if (nextOwner && nextOwner !== existing.owner_user_id && nextOwner !== auth.founder.userId) {
    createNotification(db, {
      recipientUserId: nextOwner,
      type: "task_reassigned",
      title: "Task Assigned to You",
      message: `${auth.founder.shortTitle} assigned "${nextTitle}" to you.`,
      linkHref: `/dashboard/tasks?task=${id}`,
    });
  }

  if (nextStatus === "Blocked" && existing.status !== "Blocked") {
    createNotification(db, {
      recipientUserId: "usr_ceo",
      type: "blocker",
      title: "Blocker Reported",
      message: `${auth.founder.shortTitle} marked "${nextTitle}" as Blocked.`,
      linkHref: `/dashboard/tasks?task=${id}`,
    });
  }

  const updated = db
    .prepare(
      `SELECT t.*, p.name as project_name, u.display_label as owner_label
       FROM tasks t
       LEFT JOIN projects p ON p.id = t.project_id
       LEFT JOIN users u ON u.id = t.owner_user_id
       WHERE t.id = ?`
    )
    .get(id);

  return NextResponse.json({ ok: true, task: updated });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contentType = request.headers.get("content-type") ?? "";
  const db = getDb();

  const existing = db.prepare("SELECT id, title, owner_user_id FROM tasks WHERE id = ?").get(id) as
    | { id: string; title: string; owner_user_id: string | null }
    | undefined;
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Task not found." }, { status: 404 });
  }

  if (contentType.includes("multipart/form-data")) {
    const auth = await requireApiAuth("document.upload");
    if (!auth.ok) return auth.response;

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Attachment file is required." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const saved = validateAndSavePrivateFile(file.name, file.type, buffer);
    if (!saved.ok) {
      return NextResponse.json({ ok: false, error: saved.error }, { status: 422 });
    }

    const attId = generateId("att");
    const now = new Date().toISOString();
    db.prepare(
      `INSERT INTO task_attachments (id, task_id, file_name, storage_key, mime_type, size_bytes, uploaded_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      attId,
      id,
      saved.sanitizedName,
      saved.storageKey,
      saved.mimeType,
      saved.sizeBytes,
      auth.founder.userId,
      now
    );

    logActivity(db, {
      actorUserId: auth.founder.userId,
      entityType: "task",
      entityId: id,
      action: "attachment_added",
      summary: `Uploaded attachment "${saved.sanitizedName}" to "${existing.title}"`,
    });

    return NextResponse.json({ ok: true, attachmentId: attId }, { status: 201 });
  }

  // Comment creation
  const auth = await requireApiAuth("comment.create");
  if (!auth.ok) return auth.response;

  let body: { comment?: unknown };
  try {
    body = (await request.json()) as { comment?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const text = typeof body.comment === "string" ? body.comment.trim() : "";
  if (!text) {
    return NextResponse.json({ ok: false, error: "Comment cannot be empty." }, { status: 422 });
  }

  const commentId = generateId("cmt");
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO task_comments (id, task_id, author_user_id, body, created_at) VALUES (?, ?, ?, ?, ?)"
  ).run(commentId, id, auth.founder.userId, text, now);

  logActivity(db, {
    actorUserId: auth.founder.userId,
    entityType: "task",
    entityId: id,
    action: "commented",
    summary: `Commented on "${existing.title}"`,
  });

  if (existing.owner_user_id && existing.owner_user_id !== auth.founder.userId) {
    createNotification(db, {
      recipientUserId: existing.owner_user_id,
      type: "comment",
      title: "New Task Comment",
      message: `${auth.founder.shortTitle} commented on "${existing.title}".`,
      linkHref: `/dashboard/tasks?task=${id}`,
    });
  }

  return NextResponse.json({ ok: true, commentId }, { status: 201 });
}
