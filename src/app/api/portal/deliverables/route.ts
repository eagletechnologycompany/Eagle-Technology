import { NextResponse } from "next/server";
import { requireApiAuth } from "@/server/auth/session";
import { getDb } from "@/server/db/client";
import { logAudit } from "@/server/auth/audit";

export async function GET() {
  const auth = await requireApiAuth("portal.view");
  if (!auth.ok) return auth.response;

  const db = getDb();
  const deliverables = db
    .prepare(
      `SELECT d.*, u.display_label as submitter_name, p.name as project_name
       FROM client_deliverables d
       LEFT JOIN users u ON u.id = d.submitted_by
       LEFT JOIN projects p ON p.id = d.project_id
       ORDER BY 
         CASE d.status
           WHEN 'pending_review' THEN 1
           WHEN 'in_progress' THEN 2
           WHEN 'approved' THEN 3
           ELSE 4
         END,
         d.created_at DESC`
    )
    .all();

  return NextResponse.json({ ok: true, deliverables });
}

export async function POST(req: Request) {
  const auth = await requireApiAuth("portal.deliverables");
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { deliverableId, action, reviewNotes } = body;

    if (!deliverableId || !action || !["approve", "request_revision"].includes(action)) {
      return NextResponse.json(
        { ok: false, error: "Invalid action or deliverable identifier." },
        { status: 400 }
      );
    }

    const db = getDb();
    const now = new Date().toISOString();
    const newStatus = action === "approve" ? "approved" : "revision_requested";

    const result = db
      .prepare(
        `UPDATE client_deliverables 
         SET status = ?, review_notes = ?, reviewed_at = ?, updated_at = ?
         WHERE id = ?`
      )
      .run(newStatus, reviewNotes || "", now, now, deliverableId);

    if (result.changes === 0) {
      return NextResponse.json(
        { ok: false, error: "Deliverable not found." },
        { status: 404 }
      );
    }

    logAudit(db, {
      actorUserId: auth.founder.userId,
      actorRole: auth.founder.roleId,
      action: action === "approve" ? "deliverable.approve" : "deliverable.revision_requested",
      targetType: "client_deliverable",
      targetId: deliverableId,
      status: "success",
      details: { reviewNotes },
    });

    return NextResponse.json({ ok: true, status: newStatus, reviewedAt: now });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
