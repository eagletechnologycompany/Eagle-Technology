import { describe, it, expect, beforeEach } from "vitest";
import { getDb } from "@/server/db/client";
import { seedDatabaseIfNeeded } from "@/server/db/seed";
import {
  createStaffInvitation,
  verifyStaffInvitation,
  acceptStaffInvitation,
} from "@/server/auth/invitations";

describe("Staff and Founder Secure Invitation Engine", () => {
  beforeEach(() => {
    const db = getDb();
    seedDatabaseIfNeeded(db);
  });

  it("creates a cryptographically secure single-use invitation for an internal staff role", () => {
    const db = getDb();
    const ceo = db.prepare("SELECT id FROM users WHERE role_id = 'ceo'").get() as { id: string };
    expect(ceo).toBeDefined();

    const inviteResult = createStaffInvitation({
      recipientEmail: "new-engineer@eagletechnology.et",
      roleId: "backend",
      invitedByUserId: ceo.id,
      expiresInDays: 3,
    });

    expect(inviteResult.ok).toBe(true);
    if (!inviteResult.ok) return;

    expect(inviteResult.rawToken).toHaveLength(64);
    expect(inviteResult.invitationId).toMatch(/^inv_/);

    // Verify token
    const verifyResult = verifyStaffInvitation(inviteResult.rawToken);
    expect(verifyResult.ok).toBe(true);
    if (!verifyResult.ok) return;

    expect(verifyResult.invitation.roleId).toBe("backend");
    expect(verifyResult.invitation.recipientEmail).toBe("new-engineer@eagletechnology.et");
    expect(verifyResult.invitation.usedAt).toBeNull();
    expect(verifyResult.invitation.revokedAt).toBeNull();
  });

  it("rejects client role from staff invitation engine", () => {
    const db = getDb();
    const ceo = db.prepare("SELECT id FROM users WHERE role_id = 'ceo'").get() as { id: string };

    const result = createStaffInvitation({
      recipientEmail: "partner@example.com",
      roleId: "client" as unknown as "backend",
      invitedByUserId: ceo.id,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("Staff invitations are reserved");
    }
  });

  it("enforces single-use and assigns the server-validated role upon acceptance", () => {
    const db = getDb();
    const ceo = db.prepare("SELECT id FROM users WHERE role_id = 'ceo'").get() as { id: string };

    const email = `engineer.${Date.now()}@eagletechnology.et`;
    const inviteResult = createStaffInvitation({
      recipientEmail: email,
      roleId: "ai_automation",
      invitedByUserId: ceo.id,
    });

    expect(inviteResult.ok).toBe(true);
    if (!inviteResult.ok) return;

    const username = `ai_eng_${Date.now().toString().slice(-4)}`;
    const acceptResult = acceptStaffInvitation({
      rawToken: inviteResult.rawToken,
      username,
      password: "StrongStaffPass!2026",
      displayLabel: "AI Systems Specialist",
    });

    expect(acceptResult.ok).toBe(true);
    if (!acceptResult.ok) return;

    expect(acceptResult.founder.roleId).toBe("ai_automation");
    expect(acceptResult.founder.username).toBe(username);
    expect(acceptResult.cookieValue).toBeDefined();

    // Re-use of the same token must fail
    const reuseResult = acceptStaffInvitation({
      rawToken: inviteResult.rawToken,
      username: `${username}_2`,
      password: "StrongStaffPass!2026",
    });

    expect(reuseResult.ok).toBe(false);
    if (!reuseResult.ok) {
      expect(reuseResult.error).toContain("already been accepted");
    }
  });
});
