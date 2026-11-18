import crypto from "node:crypto";
import { getDb } from "@/server/db/client";
import type { RoleId } from "@/lib/dashboard-constants";
import {
  generateId,
  generateSessionToken,
  hashPassword,
  hashSessionToken,
  signSessionCookieValue,
} from "./crypto";
import { logAudit } from "./audit";
import { getPermissionsForRole, type AuthenticatedFounder } from "./session";

const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

export interface StaffInvitationRecord {
  id: string;
  tokenHash: string;
  recipientEmail: string;
  roleId: RoleId;
  roleTitle: string;
  invitedBy: string;
  expiresAt: string;
  usedAt: string | null;
  revokedAt: string | null;
  acceptedByUserId: string | null;
  createdAt: string;
}

export function hashInvitationToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createStaffInvitation(params: {
  recipientEmail: string;
  roleId: RoleId;
  invitedByUserId: string;
  expiresInDays?: number;
}): { ok: true; invitationId: string; rawToken: string; expiresAt: string } | { ok: false; error: string } {
  const db = getDb();
  const normalizedEmail = params.recipientEmail.trim().toLowerCase();

  // Validate email format
  if (!normalizedEmail || !normalizedEmail.includes("@") || normalizedEmail.length < 5) {
    return { ok: false, error: "A valid recipient email address is required." };
  }

  // Prevent client role from using staff invitation system
  if (params.roleId === "client") {
    return { ok: false, error: "Staff invitations are reserved for internal operational and founding roles." };
  }

  // Ensure role exists in roles table
  const roleRow = db.prepare("SELECT id FROM roles WHERE id = ?").get(params.roleId) as { id: string } | undefined;
  if (!roleRow) {
    return { ok: false, error: `Invalid role specified: ${params.roleId}` };
  }

  // Ensure inviter exists
  const inviter = db.prepare("SELECT id, role_id FROM users WHERE id = ?").get(params.invitedByUserId) as
    | { id: string; role_id: string }
    | undefined;
  if (!inviter) {
    return { ok: false, error: "Inviting administrator not found." };
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashInvitationToken(rawToken);
  const invitationId = generateId("inv");
  const days = params.expiresInDays && params.expiresInDays > 0 ? params.expiresInDays : 7;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  const nowIso = new Date().toISOString();

  // Revoke any prior pending invitation for the same email and role
  db.prepare(
    `UPDATE staff_invitations
     SET revoked_at = ?
     WHERE lower(recipient_email) = ? AND role_id = ? AND used_at IS NULL AND revoked_at IS NULL`
  ).run(nowIso, normalizedEmail, params.roleId);

  db.prepare(
    `INSERT INTO staff_invitations (
      id, token_hash, recipient_email, role_id, invited_by, expires_at, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(invitationId, tokenHash, normalizedEmail, params.roleId, params.invitedByUserId, expiresAt, nowIso);

  logAudit(db, {
    actorUserId: params.invitedByUserId,
    actorRole: inviter.role_id,
    action: "auth.invitation.created",
    targetType: "invitation",
    targetId: invitationId,
    status: "success",
    details: { recipientEmail: normalizedEmail, roleId: params.roleId, expiresAt },
  });

  return {
    ok: true,
    invitationId,
    rawToken,
    expiresAt,
  };
}

export function verifyStaffInvitation(rawToken: string):
  | { ok: true; invitation: StaffInvitationRecord }
  | { ok: false; error: string; code: "INVALID" | "EXPIRED" | "USED" | "REVOKED" } {
  if (!rawToken || typeof rawToken !== "string" || rawToken.length < 32) {
    return { ok: false, error: "Invalid invitation token format.", code: "INVALID" };
  }

  const db = getDb();
  const tokenHash = hashInvitationToken(rawToken.trim());

  const row = db
    .prepare(
      `SELECT i.*, r.title as role_title
       FROM staff_invitations i
       JOIN roles r ON r.id = i.role_id
       WHERE i.token_hash = ?`
    )
    .get(tokenHash) as
    | {
        id: string;
        token_hash: string;
        recipient_email: string;
        role_id: RoleId;
        role_title: string;
        invited_by: string;
        expires_at: string;
        used_at: string | null;
        revoked_at: string | null;
        accepted_by_user_id: string | null;
        created_at: string;
      }
    | undefined;

  if (!row) {
    return { ok: false, error: "Invitation not found or token is invalid.", code: "INVALID" };
  }

  if (row.revoked_at) {
    return { ok: false, error: "This invitation has been revoked by an administrator.", code: "REVOKED" };
  }

  if (row.used_at) {
    return { ok: false, error: "This single-use invitation has already been accepted.", code: "USED" };
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    return { ok: false, error: "This invitation has expired. Request a new invite from an administrator.", code: "EXPIRED" };
  }

  return {
    ok: true,
    invitation: {
      id: row.id,
      tokenHash: row.token_hash,
      recipientEmail: row.recipient_email,
      roleId: row.role_id,
      roleTitle: row.role_title,
      invitedBy: row.invited_by,
      expiresAt: row.expires_at,
      usedAt: row.used_at,
      revokedAt: row.revoked_at,
      acceptedByUserId: row.accepted_by_user_id,
      createdAt: row.created_at,
    },
  };
}

export function acceptStaffInvitation(params: {
  rawToken: string;
  username: string;
  password: string;
  displayLabel?: string;
  userAgent?: string;
}): { ok: true; founder: AuthenticatedFounder; cookieValue: string } | { ok: false; error: string } {
  const verifyResult = verifyStaffInvitation(params.rawToken);
  if (!verifyResult.ok) {
    return { ok: false, error: verifyResult.error };
  }

  const invitation = verifyResult.invitation;
  const db = getDb();
  const normalizedUsername = params.username.trim().toLowerCase();

  if (!/^[a-z0-9._-]{3,32}$/.test(normalizedUsername)) {
    return {
      ok: false,
      error: "Username must be 3-32 characters and contain only lowercase letters, numbers, hyphens, periods, or underscores.",
    };
  }

  if (params.password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters long." };
  }

  // Check if username is already taken
  const existingUser = db.prepare("SELECT id FROM users WHERE lower(username) = ?").get(normalizedUsername);
  if (existingUser) {
    return { ok: false, error: "This username is already taken. Please choose another." };
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const newUserId = generateId("usr");
  const displayLabel = params.displayLabel?.trim() || `${invitation.roleTitle} (Staff)`;
  const passwordHash = hashPassword(params.password);

  db.exec("BEGIN;");
  try {
    // 1. Create user strictly with role from the invitation record
    db.prepare(
      `INSERT INTO users (id, username, role_id, display_label, password_hash, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 1, ?, ?)`
    ).run(newUserId, normalizedUsername, invitation.roleId, displayLabel, passwordHash, nowIso, nowIso);

    // 2. Mark invitation as used
    db.prepare(
      `UPDATE staff_invitations
       SET used_at = ?, accepted_by_user_id = ?
       WHERE id = ?`
    ).run(nowIso, newUserId, invitation.id);

    // 3. Create profile
    db.prepare(
      `INSERT OR IGNORE INTO team_member_profiles (user_id, role_id, placeholder_name, responsibilities_json, capacity_note, updated_at)
       VALUES (?, ?, ?, '[]', 'Invited Member', ?)`
    ).run(newUserId, invitation.roleId, displayLabel, nowIso);

    // 4. Create session
    const rawSessionToken = generateSessionToken();
    const sessionTokenHash = hashSessionToken(rawSessionToken);
    const sessionId = generateId("ses");
    const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS).toISOString();

    db.prepare(
      `INSERT INTO sessions (id, token_hash, user_id, expires_at, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(sessionId, sessionTokenHash, newUserId, expiresAt, params.userAgent ?? "", nowIso);

    logAudit(db, {
      actorUserId: newUserId,
      actorRole: invitation.roleId,
      action: "auth.invitation.accepted",
      targetType: "user",
      targetId: newUserId,
      status: "success",
      details: { invitationId: invitation.id, roleId: invitation.roleId, username: normalizedUsername },
    });

    db.exec("COMMIT;");

    const permissions = getPermissionsForRole(invitation.roleId);

    return {
      ok: true,
      cookieValue: signSessionCookieValue(rawSessionToken),
      founder: {
        userId: newUserId,
        username: normalizedUsername,
        roleId: invitation.roleId,
        roleTitle: invitation.roleTitle,
        shortTitle: invitation.roleTitle.split(" ")[0] || "Staff",
        displayLabel,
        permissions,
        sessionId,
        expiresAt,
      },
    };
  } catch (err) {
    db.exec("ROLLBACK;");
    const msg = err instanceof Error ? err.message : "Unknown registration error.";
    return { ok: false, error: `Failed to complete registration: ${msg}` };
  }
}
