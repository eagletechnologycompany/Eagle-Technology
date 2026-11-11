import { NextResponse } from "next/server";
import { getDb } from "@/server/db/client";
import { hasPermission, requireApiAuth } from "@/server/auth/session";
import { hashPassword, verifyPassword } from "@/server/auth/crypto";
import { logActivity, logAudit } from "@/server/auth/audit";

export async function GET() {
  const auth = await requireApiAuth();
  if (!auth.ok) return auth.response;

  const db = getDb();
  const settingsRows = db
    .prepare("SELECT key, value FROM workspace_settings")
    .all() as Array<{ key: string; value: string }>;
  const settings = Object.fromEntries(settingsRows.map((r) => [r.key, r.value]));

  const canManage = hasPermission(auth.founder, "settings.manage");

  const accounts = canManage
    ? db
        .prepare(
          `SELECT u.id, u.username, u.role_id, u.display_label, u.is_active, u.updated_at,
                  p.placeholder_name,
                  (SELECT COUNT(*) FROM sessions s WHERE s.user_id = u.id AND s.revoked_at IS NULL AND s.expires_at > ?) as active_sessions
           FROM users u
           LEFT JOIN team_member_profiles p ON p.user_id = u.id
           ORDER BY u.id ASC`
        )
        .all(new Date().toISOString())
    : [];

  return NextResponse.json({
    ok: true,
    settings,
    canManage,
    accounts,
  });
}

export async function PATCH(request: Request) {
  const auth = await requireApiAuth();
  if (!auth.ok) return auth.response;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const db = getDb();
  const now = new Date().toISOString();

  // Action 1: Self password update (any authenticated founder)
  if (body.action === "change_own_password") {
    const currentPassword =
      typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

    if (newPassword.length < 10) {
      return NextResponse.json(
        { ok: false, error: "New password must be at least 10 characters." },
        { status: 422 }
      );
    }

    const user = db
      .prepare("SELECT password_hash FROM users WHERE id = ?")
      .get(auth.founder.userId) as { password_hash: string } | undefined;

    if (!user || !verifyPassword(currentPassword, user.password_hash)) {
      logAudit(db, {
        actorUserId: auth.founder.userId,
        actorRole: auth.founder.roleId,
        action: "auth.password_change",
        targetType: "user",
        targetId: auth.founder.userId,
        status: "denied",
      });
      return NextResponse.json(
        { ok: false, error: "Current password is incorrect." },
        { status: 403 }
      );
    }

    db.prepare("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?").run(
      hashPassword(newPassword),
      now,
      auth.founder.userId
    );
    logAudit(db, {
      actorUserId: auth.founder.userId,
      actorRole: auth.founder.roleId,
      action: "auth.password_change",
      targetType: "user",
      targetId: auth.founder.userId,
      status: "success",
    });
    return NextResponse.json({ ok: true, message: "Password updated successfully." });
  }

  // All remaining actions require settings.manage (CEO only)
  if (!hasPermission(auth.founder, "settings.manage")) {
    logAudit(db, {
      actorUserId: auth.founder.userId,
      actorRole: auth.founder.roleId,
      action: "settings.manage_denied",
      targetType: "settings",
      targetId: String(body.action ?? "update"),
      status: "denied",
    });
    return NextResponse.json(
      { ok: false, error: "Requires settings.manage permission." },
      { status: 403 }
    );
  }

  if (body.action === "update_workspace") {
    const workspaceName =
      typeof body.workspaceName === "string" ? body.workspaceName.trim() : "";
    const companyStage =
      typeof body.companyStage === "string" ? body.companyStage.trim() : "";
    if (workspaceName) {
      db.prepare(
        "INSERT OR REPLACE INTO workspace_settings (key, value, updated_at) VALUES (?, ?, ?)"
      ).run("workspace_name", workspaceName, now);
    }
    if (companyStage) {
      db.prepare(
        "INSERT OR REPLACE INTO workspace_settings (key, value, updated_at) VALUES (?, ?, ?)"
      ).run("company_stage", companyStage, now);
    }
    logAudit(db, {
      actorUserId: auth.founder.userId,
      actorRole: auth.founder.roleId,
      action: "settings.workspace_updated",
      targetType: "settings",
      targetId: "workspace",
      status: "success",
    });
    return NextResponse.json({ ok: true, message: "Workspace settings updated." });
  }

  if (body.action === "update_member_profile") {
    const targetUserId =
      typeof body.targetUserId === "string" ? body.targetUserId.trim() : "";
    const placeholderName =
      typeof body.placeholderName === "string" ? body.placeholderName.trim() : "";
    const isActive = typeof body.isActive === "boolean" ? (body.isActive ? 1 : 0) : null;

    if (!targetUserId) {
      return NextResponse.json({ ok: false, error: "targetUserId required." }, { status: 422 });
    }
    if (placeholderName) {
      db.prepare(
        "UPDATE team_member_profiles SET placeholder_name = ?, updated_at = ? WHERE user_id = ?"
      ).run(placeholderName, now, targetUserId);
      db.prepare("UPDATE users SET display_label = ?, updated_at = ? WHERE id = ?").run(
        placeholderName,
        now,
        targetUserId
      );
    }
    if (isActive !== null && targetUserId !== auth.founder.userId) {
      db.prepare("UPDATE users SET is_active = ?, updated_at = ? WHERE id = ?").run(
        isActive,
        now,
        targetUserId
      );
      if (isActive === 0) {
        db.prepare("UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL").run(
          now,
          targetUserId
        );
      }
    }
    logAudit(db, {
      actorUserId: auth.founder.userId,
      actorRole: auth.founder.roleId,
      action: "settings.member_updated",
      targetType: "user",
      targetId: targetUserId,
      status: "success",
      details: { isActive },
    });
    return NextResponse.json({ ok: true, message: "Founder account updated." });
  }

  if (body.action === "archive_demo_data") {
    db.prepare(
      "UPDATE tasks SET status = 'Archived', archived_at = ?, updated_at = ? WHERE is_demo = 1 AND archived_at IS NULL"
    ).run(now, now);
    db.prepare(
      "UPDATE projects SET status = 'Archived', archived_at = ?, updated_at = ? WHERE is_demo = 1 AND archived_at IS NULL"
    ).run(now, now);
    db.prepare(
      "UPDATE decisions SET archived_at = ?, updated_at = ? WHERE is_demo = 1 AND archived_at IS NULL"
    ).run(now, now);
    logActivity(db, {
      actorUserId: auth.founder.userId,
      entityType: "workspace",
      entityId: "demo_cleanup",
      action: "archived",
      summary: "Archived clearly marked demo records from the workspace.",
    });
    logAudit(db, {
      actorUserId: auth.founder.userId,
      actorRole: auth.founder.roleId,
      action: "settings.demo_archived",
      targetType: "workspace",
      targetId: "demo_data",
      status: "success",
    });
    return NextResponse.json({ ok: true, message: "Demo records archived cleanly." });
  }

  return NextResponse.json({ ok: false, error: "Unsupported settings action." }, { status: 400 });
}
