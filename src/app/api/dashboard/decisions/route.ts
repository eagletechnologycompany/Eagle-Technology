import { NextResponse } from "next/server";
import { DECISION_STATUSES, MEETING_TYPES } from "@/lib/dashboard-constants";
import { getDb } from "@/server/db/client";
import { hasPermission, requireApiAuth } from "@/server/auth/session";
import { generateId } from "@/server/auth/crypto";
import { createNotification, logActivity, logAudit } from "@/server/auth/audit";

export async function GET() {
  const auth = await requireApiAuth();
  if (!auth.ok) return auth.response;

  const db = getDb();
  const decisions = db
    .prepare(
      `SELECT d.*, u.display_label as owner_label, p.name as project_name,
              a.display_label as approver_label
       FROM decisions d
       JOIN users u ON u.id = d.owner_user_id
       LEFT JOIN projects p ON p.id = d.related_project_id
       LEFT JOIN users a ON a.id = d.approved_by
       WHERE d.archived_at IS NULL
       ORDER BY d.decision_date DESC, d.created_at DESC`
    )
    .all();

  const meetings = db
    .prepare(
      `SELECT m.*, u.display_label as creator_label
       FROM meetings m
       JOIN users u ON u.id = m.created_by
       ORDER BY m.meeting_date DESC, m.created_at DESC`
    )
    .all();

  return NextResponse.json({ ok: true, decisions, meetings });
}

export async function POST(request: Request) {
  const auth = await requireApiAuth("decision.create");
  if (!auth.ok) return auth.response;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const db = getDb();
  const now = new Date().toISOString();

  if (body.kind === "meeting") {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (title.length < 3) {
      return NextResponse.json({ ok: false, error: "Meeting title required." }, { status: 422 });
    }
    const meetingType =
      typeof body.meetingType === "string" &&
      (MEETING_TYPES as readonly string[]).includes(body.meetingType)
        ? body.meetingType
        : "Weekly team meeting";
    const id = generateId("mtg");
    db.prepare(
      `INSERT INTO meetings (
        id, title, meeting_type, meeting_date, participants_json, agenda,
        notes, decisions_summary, action_items_json, follow_up_date,
        created_by, is_demo, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
    ).run(
      id,
      title,
      meetingType,
      typeof body.meetingDate === "string" && body.meetingDate.trim()
        ? body.meetingDate.trim()
        : now.slice(0, 10),
      JSON.stringify(Array.isArray(body.participants) ? body.participants : []),
      typeof body.agenda === "string" ? body.agenda.trim() : "",
      typeof body.notes === "string" ? body.notes.trim() : "",
      typeof body.decisionsSummary === "string" ? body.decisionsSummary.trim() : "",
      JSON.stringify(Array.isArray(body.actionItems) ? body.actionItems : []),
      typeof body.followUpDate === "string" ? body.followUpDate.trim() : "",
      auth.founder.userId,
      now,
      now
    );
    logActivity(db, {
      actorUserId: auth.founder.userId,
      entityType: "meeting",
      entityId: id,
      action: "created",
      summary: `Recorded ${meetingType}: "${title}"`,
    });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  }

  // Create decision
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const context = typeof body.context === "string" ? body.context.trim() : "";
  const decisionText =
    typeof body.decisionText === "string" ? body.decisionText.trim() : "";

  if (title.length < 3 || !context || !decisionText) {
    return NextResponse.json(
      { ok: false, error: "Title, context, and proposed decision are required." },
      { status: 422 }
    );
  }

  const id = generateId("dec");
  db.prepare(
    `INSERT INTO decisions (
      id, title, context, decision_text, options_considered, owner_user_id,
      contributors_json, decision_date, status, related_project_id,
      review_date, is_demo, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
  ).run(
    id,
    title,
    context,
    decisionText,
    typeof body.optionsConsidered === "string" ? body.optionsConsidered.trim() : "",
    auth.founder.userId,
    JSON.stringify(Array.isArray(body.contributors) ? body.contributors : []),
    typeof body.decisionDate === "string" && body.decisionDate.trim()
      ? body.decisionDate.trim()
      : now.slice(0, 10),
    "Proposed",
    typeof body.relatedProjectId === "string" && body.relatedProjectId.trim()
      ? body.relatedProjectId.trim()
      : null,
    typeof body.reviewDate === "string" ? body.reviewDate.trim() : "",
    now,
    now
  );

  logActivity(db, {
    actorUserId: auth.founder.userId,
    entityType: "decision",
    entityId: id,
    action: "proposed",
    summary: `Proposed decision "${title}"`,
  });

  if (auth.founder.userId !== "usr_ceo") {
    createNotification(db, {
      recipientUserId: "usr_ceo",
      type: "decision_review",
      title: "Decision Requires Review",
      message: `${auth.founder.shortTitle} proposed "${title}".`,
      linkHref: "/dashboard/decisions",
    });
  }

  return NextResponse.json({ ok: true, id }, { status: 201 });
}

export async function PATCH(request: Request) {
  const auth = await requireApiAuth("decision.create");
  if (!auth.ok) return auth.response;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  const status = typeof body.status === "string" ? body.status.trim() : "";
  if (!id || !(DECISION_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json(
      { ok: false, error: "Valid decision id and status required." },
      { status: 422 }
    );
  }

  const requiresApprovalPerm =
    status === "Approved" || status === "Rejected" || status === "Superseded";

  const db = getDb();
  if (requiresApprovalPerm && !hasPermission(auth.founder, "decision.approve")) {
    logAudit(db, {
      actorUserId: auth.founder.userId,
      actorRole: auth.founder.roleId,
      action: "decision.approve_denied",
      targetType: "decision",
      targetId: id,
      status: "denied",
      details: { attemptedStatus: status },
    });
    return NextResponse.json(
      { ok: false, error: "Only the Founder & CEO (decision.approve) can approve or reject decisions." },
      { status: 403 }
    );
  }

  const existing = db.prepare("SELECT id, title FROM decisions WHERE id = ?").get(id) as
    | { id: string; title: string }
    | undefined;
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Decision not found." }, { status: 404 });
  }

  const now = new Date().toISOString();
  db.prepare(
    `UPDATE decisions SET status = ?, approved_by = ?, updated_at = ? WHERE id = ?`
  ).run(
    status,
    status === "Approved" ? auth.founder.userId : null,
    now,
    id
  );

  logActivity(db, {
    actorUserId: auth.founder.userId,
    entityType: "decision",
    entityId: id,
    action: `status:${status}`,
    summary: `Updated decision "${existing.title}" to ${status}`,
  });

  if (requiresApprovalPerm) {
    logAudit(db, {
      actorUserId: auth.founder.userId,
      actorRole: auth.founder.roleId,
      action: `decision.${status.toLowerCase()}`,
      targetType: "decision",
      targetId: id,
      status: "success",
    });
  }

  return NextResponse.json({ ok: true });
}
