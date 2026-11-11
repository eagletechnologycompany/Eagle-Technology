import { NextResponse } from "next/server";
import { getDb } from "@/server/db/client";
import { requireApiAuth } from "@/server/auth/session";

export async function GET() {
  const auth = await requireApiAuth();
  if (!auth.ok) return auth.response;

  const db = getDb();
  const notifications = db
    .prepare(
      `SELECT * FROM notifications
       WHERE recipient_user_id = ?
       ORDER BY created_at DESC
       LIMIT 40`
    )
    .all(auth.founder.userId);

  return NextResponse.json({ ok: true, notifications });
}

export async function PATCH(request: Request) {
  const auth = await requireApiAuth();
  if (!auth.ok) return auth.response;

  let body: { id?: unknown; markAll?: unknown } = {};
  try {
    body = (await request.json()) as { id?: unknown; markAll?: unknown };
  } catch {
    body = {};
  }

  const db = getDb();
  const now = new Date().toISOString();

  if (body.markAll === true) {
    db.prepare(
      "UPDATE notifications SET read_at = ? WHERE recipient_user_id = ? AND read_at IS NULL"
    ).run(now, auth.founder.userId);
  } else if (typeof body.id === "string" && body.id.trim()) {
    db.prepare(
      "UPDATE notifications SET read_at = ? WHERE id = ? AND recipient_user_id = ?"
    ).run(now, body.id.trim(), auth.founder.userId);
  }

  return NextResponse.json({ ok: true });
}
