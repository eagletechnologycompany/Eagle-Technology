import { NextResponse } from "next/server";
import { getDb } from "@/server/db/client";
import { requireApiAuth } from "@/server/auth/session";
import { logAudit } from "@/server/auth/audit";
import {
  canUserAccessDocument,
  readPrivateFile,
} from "@/server/documents/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth("document.view");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const db = getDb();
  const doc = db
    .prepare("SELECT * FROM documents WHERE id = ? AND archived_at IS NULL")
    .get(id) as
    | {
        id: string;
        file_name: string;
        storage_key: string;
        mime_type: string;
        access_level: string;
        allowed_roles_json: string;
        related_project_id: string | null;
        owner_user_id: string;
        uploaded_by: string;
      }
    | undefined;

  if (!doc) {
    return NextResponse.json({ ok: false, error: "Document not found." }, { status: 404 });
  }

  if (!canUserAccessDocument(db, doc, auth.founder.userId, auth.founder.roleId)) {
    logAudit(db, {
      actorUserId: auth.founder.userId,
      actorRole: auth.founder.roleId,
      action: "document.download_denied",
      targetType: "document",
      targetId: id,
      status: "denied",
    });
    return NextResponse.json(
      { ok: false, error: "You do not have permission to download this document." },
      { status: 403 }
    );
  }

  const buffer = readPrivateFile(doc.storage_key);
  if (!buffer) {
    return NextResponse.json({ ok: false, error: "Document file unavailable." }, { status: 404 });
  }

  logAudit(db, {
    actorUserId: auth.founder.userId,
    actorRole: auth.founder.roleId,
    action: "document.download",
    targetType: "document",
    targetId: id,
    status: "success",
  });

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": doc.mime_type || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${doc.file_name}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
