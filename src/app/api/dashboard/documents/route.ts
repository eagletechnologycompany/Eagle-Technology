import { NextResponse } from "next/server";
import {
  DOCUMENT_ACCESS_LEVELS,
  DOCUMENT_CATEGORIES,
} from "@/lib/dashboard-constants";
import { getDb } from "@/server/db/client";
import { requireApiAuth } from "@/server/auth/session";
import { generateId } from "@/server/auth/crypto";
import { logActivity, logAudit } from "@/server/auth/audit";
import {
  canUserAccessDocument,
  validateAndSavePrivateFile,
} from "@/server/documents/storage";

export async function GET(request: Request) {
  const auth = await requireApiAuth("document.view");
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category")?.trim() || "";
  const q = searchParams.get("q")?.trim().toLowerCase() || "";

  const db = getDb();
  const rows = db
    .prepare(
      `SELECT d.*, u.display_label as owner_label, up.display_label as uploader_label,
              p.name as project_name
       FROM documents d
       JOIN users u ON u.id = d.owner_user_id
       JOIN users up ON up.id = d.uploaded_by
       LEFT JOIN projects p ON p.id = d.related_project_id
       WHERE d.archived_at IS NULL
       ORDER BY d.updated_at DESC`
    )
    .all() as Array<{
    file_name: string;
    category: string;
    description: string;
    access_level: string;
    allowed_roles_json: string;
    related_project_id: string | null;
    owner_user_id: string;
    uploaded_by: string;
  } & Record<string, unknown>>;

  const visible = rows.filter((doc) => {
    if (!canUserAccessDocument(db, doc, auth.founder.userId, auth.founder.roleId)) {
      return false;
    }
    if (category && doc.category !== category) return false;
    if (
      q &&
      !doc.file_name.toLowerCase().includes(q) &&
      !doc.description.toLowerCase().includes(q)
    ) {
      return false;
    }
    return true;
  });

  return NextResponse.json({ ok: true, documents: visible });
}

export async function POST(request: Request) {
  const auth = await requireApiAuth("document.upload");
  if (!auth.ok) return auth.response;

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "File is required." }, { status: 400 });
  }

  const categoryRaw = String(formData.get("category") ?? "Company Foundation");
  const category = (DOCUMENT_CATEGORIES as readonly string[]).includes(categoryRaw)
    ? categoryRaw
    : "Company Foundation";

  const accessRaw = String(formData.get("accessLevel") ?? "all_founders");
  const accessLevel = DOCUMENT_ACCESS_LEVELS.some((a) => a.value === accessRaw)
    ? accessRaw
    : "all_founders";

  const description = String(formData.get("description") ?? "").trim();
  const version = String(formData.get("version") ?? "v1.0").trim() || "v1.0";
  const relatedProjectId = String(formData.get("relatedProjectId") ?? "").trim() || null;
  const allowedRolesRaw = String(formData.get("allowedRoles") ?? "[]");
  let allowedRoles: string[] = [];
  try {
    const parsed = JSON.parse(allowedRolesRaw);
    if (Array.isArray(parsed)) {
      allowedRoles = parsed.filter((r): r is string => typeof r === "string");
    }
  } catch {
    allowedRoles = [];
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const saved = validateAndSavePrivateFile(file.name, file.type, buffer);
  if (!saved.ok) {
    const db = getDb();
    logAudit(db, {
      actorUserId: auth.founder.userId,
      actorRole: auth.founder.roleId,
      action: "document.upload_rejected",
      targetType: "document",
      targetId: file.name.slice(0, 60),
      status: "error",
      details: { reason: saved.error },
    });
    return NextResponse.json({ ok: false, error: saved.error }, { status: 422 });
  }

  const db = getDb();
  const docId = generateId("doc");
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO documents (
      id, file_name, storage_key, mime_type, size_bytes, category,
      description, owner_user_id, uploaded_by, version, related_project_id,
      access_level, allowed_roles_json, is_demo, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
  ).run(
    docId,
    saved.sanitizedName,
    saved.storageKey,
    saved.mimeType,
    saved.sizeBytes,
    category,
    description,
    auth.founder.userId,
    auth.founder.userId,
    version,
    relatedProjectId,
    accessLevel,
    JSON.stringify(allowedRoles),
    now,
    now
  );

  logActivity(db, {
    actorUserId: auth.founder.userId,
    entityType: "document",
    entityId: docId,
    action: "uploaded",
    summary: `Uploaded "${saved.sanitizedName}" to ${category} (${accessLevel})`,
  });

  logAudit(db, {
    actorUserId: auth.founder.userId,
    actorRole: auth.founder.roleId,
    action: "document.upload",
    targetType: "document",
    targetId: docId,
    status: "success",
    details: { category, accessLevel, sizeBytes: saved.sizeBytes },
  });

  return NextResponse.json({ ok: true, id: docId }, { status: 201 });
}

export async function PATCH(request: Request) {
  const auth = await requireApiAuth("document.delete");
  if (!auth.ok) return auth.response;

  let body: { id?: unknown };
  try {
    body = (await request.json()) as { id?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!id) {
    return NextResponse.json({ ok: false, error: "Document id required." }, { status: 422 });
  }

  const db = getDb();
  const doc = db.prepare("SELECT id, file_name FROM documents WHERE id = ?").get(id) as
    | { id: string; file_name: string }
    | undefined;
  if (!doc) {
    return NextResponse.json({ ok: false, error: "Document not found." }, { status: 404 });
  }

  const now = new Date().toISOString();
  db.prepare("UPDATE documents SET archived_at = ?, updated_at = ? WHERE id = ?").run(
    now,
    now,
    id
  );

  logActivity(db, {
    actorUserId: auth.founder.userId,
    entityType: "document",
    entityId: id,
    action: "archived",
    summary: `Archived document "${doc.file_name}"`,
  });

  logAudit(db, {
    actorUserId: auth.founder.userId,
    actorRole: auth.founder.roleId,
    action: "document.archive",
    targetType: "document",
    targetId: id,
    status: "success",
  });

  return NextResponse.json({ ok: true });
}
