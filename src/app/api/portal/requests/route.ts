import { NextResponse } from "next/server";
import { requireApiAuth } from "@/server/auth/session";
import { getDb } from "@/server/db/client";
import { generateId } from "@/server/auth/crypto";
import { logAudit } from "@/server/auth/audit";

export async function GET() {
  const auth = await requireApiAuth("portal.view");
  if (!auth.ok) return auth.response;

  const db = getDb();
  const requests = db
    .prepare(
      `SELECT r.*, u.display_label as requester_name, p.name as project_name
       FROM client_requests r
       JOIN users u ON u.id = r.client_user_id
       LEFT JOIN projects p ON p.id = r.project_id
       ORDER BY r.created_at DESC`
    )
    .all();

  return NextResponse.json({ ok: true, requests });
}

export async function POST(req: Request) {
  const auth = await requireApiAuth("portal.requests");
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { title, type, priority, details, projectId } = body;

    if (!title || !details || !type) {
      return NextResponse.json(
        { ok: false, error: "Title, type, and details are required." },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = generateId("req");
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO client_requests (id, client_user_id, project_id, title, type, priority, details, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'received', ?, ?)`
    ).run(
      id,
      auth.founder.userId,
      projectId || null,
      title.trim(),
      type,
      priority || "medium",
      details.trim(),
      now,
      now
    );

    logAudit(db, {
      actorUserId: auth.founder.userId,
      actorRole: auth.founder.roleId,
      action: "request.create",
      targetType: "client_request",
      targetId: id,
      status: "success",
      details: { title, type, priority },
    });

    return NextResponse.json({ ok: true, id, createdAt: now });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
