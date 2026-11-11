import { NextResponse } from "next/server";
import { getDb } from "@/server/db/client";
import { requireApiAuth } from "@/server/auth/session";
import { readPrivateFile } from "@/server/documents/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; attId: string }> }
) {
  const auth = await requireApiAuth("task.view");
  if (!auth.ok) return auth.response;

  const { id, attId } = await params;
  const db = getDb();
  const row = db
    .prepare(
      "SELECT file_name, storage_key, mime_type FROM task_attachments WHERE id = ? AND task_id = ?"
    )
    .get(attId, id) as
    | { file_name: string; storage_key: string; mime_type: string }
    | undefined;

  if (!row) {
    return NextResponse.json({ ok: false, error: "Attachment not found." }, { status: 404 });
  }

  const buffer = readPrivateFile(row.storage_key);
  if (!buffer) {
    return NextResponse.json({ ok: false, error: "File missing from private storage." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": row.mime_type || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${row.file_name}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
