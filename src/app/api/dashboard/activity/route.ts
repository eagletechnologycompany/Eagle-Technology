import { NextResponse } from "next/server";
import { getDb } from "@/server/db/client";
import { hasPermission, requireApiAuth } from "@/server/auth/session";

export async function GET(request: Request) {
  const auth = await requireApiAuth();
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get("entityType")?.trim() || "";

  const db = getDb();
  const activity = entityType
    ? db
        .prepare(
          `SELECT a.*, u.display_label as actor_label
           FROM activity_logs a
           LEFT JOIN users u ON u.id = a.actor_user_id
           WHERE a.entity_type = ?
           ORDER BY a.created_at DESC
           LIMIT 100`
        )
        .all(entityType)
    : db
        .prepare(
          `SELECT a.*, u.display_label as actor_label
           FROM activity_logs a
           LEFT JOIN users u ON u.id = a.actor_user_id
           ORDER BY a.created_at DESC
           LIMIT 100`
        )
        .all();

  const canViewAudit = hasPermission(auth.founder, "audit.view");
  const auditLogs = canViewAudit
    ? db
        .prepare(
          `SELECT au.*, u.display_label as actor_label
           FROM audit_logs au
           LEFT JOIN users u ON u.id = au.actor_user_id
           ORDER BY au.created_at DESC
           LIMIT 100`
        )
        .all()
    : [];

  return NextResponse.json({
    ok: true,
    activity,
    canViewAudit,
    auditLogs,
  });
}
