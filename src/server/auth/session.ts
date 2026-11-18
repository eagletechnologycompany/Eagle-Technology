import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { Permission, RoleId } from "@/lib/dashboard-constants";
import { getDb } from "@/server/db/client";
import {
  generateId,
  generateSessionToken,
  hashSessionToken,
  signSessionCookieValue,
  verifyPassword,
  verifySignedSessionCookie,
} from "./crypto";
import { logAudit } from "./audit";

export const SESSION_COOKIE_NAME = "eagle_ops_session";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

export interface AuthenticatedFounder {
  userId: string;
  username: string;
  roleId: RoleId;
  roleTitle: string;
  shortTitle: string;
  displayLabel: string;
  permissions: Permission[];
  sessionId: string;
  expiresAt: string;
}

export function getPermissionsForRole(roleId: string): Permission[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT permission_id FROM role_permissions WHERE role_id = ?")
    .all(roleId) as Array<{ permission_id: Permission }>;
  return rows.map((r) => r.permission_id);
}

export function authenticateFounderCredentials(
  username: string,
  password: string,
  userAgent?: string
): { ok: true; founder: AuthenticatedFounder; cookieValue: string } | { ok: false; reason: string } {
  const db = getDb();
  const normalizedUsername = username.trim().toLowerCase();

  const user = db
    .prepare(
      `SELECT u.id, u.username, u.role_id, u.display_label, u.password_hash, u.is_active,
              r.title as role_title, r.short_title
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE lower(u.username) = ?`
    )
    .get(normalizedUsername) as
    | {
        id: string;
        username: string;
        role_id: RoleId;
        display_label: string;
        password_hash: string;
        is_active: number;
        role_title: string;
        short_title: string;
      }
    | undefined;

  if (!user || !user.is_active) {
    logAudit(db, {
      actorUserId: user?.id ?? null,
      actorRole: user?.role_id ?? "anonymous",
      action: "auth.login",
      targetType: "session",
      targetId: normalizedUsername || "unknown",
      status: "denied",
      details: { reason: user ? "account_inactive" : "invalid_credentials" },
    });
    return { ok: false, reason: "Invalid role username or password." };
  }

  if (!verifyPassword(password, user.password_hash)) {
    logAudit(db, {
      actorUserId: user.id,
      actorRole: user.role_id,
      action: "auth.login",
      targetType: "session",
      targetId: user.id,
      status: "denied",
      details: { reason: "invalid_password" },
    });
    return { ok: false, reason: "Invalid role username or password." };
  }

  const rawToken = generateSessionToken();
  const tokenHash = hashSessionToken(rawToken);
  const sessionId = generateId("ses");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS).toISOString();

  db.prepare(
    `INSERT INTO sessions (id, token_hash, user_id, expires_at, user_agent, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(sessionId, tokenHash, user.id, expiresAt, userAgent ?? "", now.toISOString());

  const permissions = getPermissionsForRole(user.role_id);

  logAudit(db, {
    actorUserId: user.id,
    actorRole: user.role_id,
    action: "auth.login",
    targetType: "session",
    targetId: sessionId,
    status: "success",
  });

  return {
    ok: true,
    cookieValue: signSessionCookieValue(rawToken),
    founder: {
      userId: user.id,
      username: user.username,
      roleId: user.role_id,
      roleTitle: user.role_title,
      shortTitle: user.short_title,
      displayLabel: user.display_label,
      permissions,
      sessionId,
      expiresAt,
    },
  };
}

export function resolveSessionFromCookieValue(
  cookieValue: string | undefined | null
): AuthenticatedFounder | null {
  if (!cookieValue) return null;
  const rawToken = verifySignedSessionCookie(cookieValue);
  if (!rawToken) return null;

  const db = getDb();
  const tokenHash = hashSessionToken(rawToken);
  const row = db
    .prepare(
      `SELECT s.id as session_id, s.expires_at, s.revoked_at,
              u.id as user_id, u.username, u.role_id, u.display_label, u.is_active,
              r.title as role_title, r.short_title
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       JOIN roles r ON r.id = u.role_id
       WHERE s.token_hash = ?`
    )
    .get(tokenHash) as
    | {
        session_id: string;
        expires_at: string;
        revoked_at: string | null;
        user_id: string;
        username: string;
        role_id: RoleId;
        display_label: string;
        is_active: number;
        role_title: string;
        short_title: string;
      }
    | undefined;

  if (!row || row.revoked_at || !row.is_active) {
    return null;
  }

  if (new Date(row.expires_at).getTime() <= Date.now()) {
    return null;
  }

  return {
    userId: row.user_id,
    username: row.username,
    roleId: row.role_id,
    roleTitle: row.role_title,
    shortTitle: row.short_title,
    displayLabel: row.display_label,
    permissions: getPermissionsForRole(row.role_id),
    sessionId: row.session_id,
    expiresAt: row.expires_at,
  };
}

export async function getCurrentFounder(): Promise<AuthenticatedFounder | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  return resolveSessionFromCookieValue(cookie?.value);
}

export async function requireFounderPage(
  requiredPermission?: Permission
): Promise<AuthenticatedFounder> {
  const founder = await getCurrentFounder();
  if (!founder) {
    redirect("/login?expired=1");
  }
  if (founder.roleId === "client") {
    redirect("/portal");
  }
  if (requiredPermission && !founder.permissions.includes(requiredPermission)) {
    redirect("/unauthorized");
  }
  return founder;
}

export async function requirePortalPage(
  requiredPermission?: Permission
): Promise<AuthenticatedFounder> {
  const user = await getCurrentFounder();
  if (!user) {
    redirect("/login?expired=1");
  }
  if (requiredPermission && !user.permissions.includes(requiredPermission)) {
    redirect("/unauthorized");
  }
  return user;
}

export function revokeSession(sessionId: string, actorUserId: string, actorRole: string): void {
  const db = getDb();
  db.prepare("UPDATE sessions SET revoked_at = ? WHERE id = ?").run(
    new Date().toISOString(),
    sessionId
  );
  logAudit(db, {
    actorUserId,
    actorRole,
    action: "auth.logout",
    targetType: "session",
    targetId: sessionId,
    status: "success",
  });
}

export function hasPermission(
  founder: AuthenticatedFounder,
  permission: Permission
): boolean {
  return founder.permissions.includes(permission);
}

export async function requireApiAuth(
  requiredPermission?: Permission
): Promise<
  | { ok: true; founder: AuthenticatedFounder }
  | { ok: false; response: NextResponse }
> {
  const founder = await getCurrentFounder();
  if (!founder) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: "Authentication required or session expired." },
        { status: 401 }
      ),
    };
  }

  if (requiredPermission && !founder.permissions.includes(requiredPermission)) {
    const db = getDb();
    logAudit(db, {
      actorUserId: founder.userId,
      actorRole: founder.roleId,
      action: "auth.permission_denied",
      targetType: "permission",
      targetId: requiredPermission,
      status: "denied",
    });
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: `Missing required permission: ${requiredPermission}` },
        { status: 403 }
      ),
    };
  }

  return { ok: true, founder };
}

export function getSessionCookieOptions(expiresAt?: string) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt ? new Date(expiresAt) : new Date(Date.now() + SESSION_DURATION_MS),
  };
}
