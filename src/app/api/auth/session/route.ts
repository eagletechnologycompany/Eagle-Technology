import { NextResponse } from "next/server";
import { getDb } from "@/server/db/client";
import { requireApiAuth } from "@/server/auth/session";

export async function GET() {
  const auth = await requireApiAuth();
  if (!auth.ok) return auth.response;

  const db = getDb();
  const unread = db
    .prepare(
      "SELECT COUNT(*) as count FROM notifications WHERE recipient_user_id = ? AND read_at IS NULL"
    )
    .get(auth.founder.userId) as { count: number };

  return NextResponse.json({
    ok: true,
    founder: auth.founder,
    unreadNotifications: unread.count,
  });
}
