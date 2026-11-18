import { afterEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  hashPassword,
  signSessionCookieValue,
  verifyPassword,
  verifySignedSessionCookie,
} from "@/server/auth/crypto";
import { checkLoginRateLimit, resetLoginRateLimit } from "@/server/auth/rate-limit";
import { getDb, resetDbConnectionForTests } from "@/server/db/client";
import {
  authenticateFounderCredentials,
  resolveSessionFromCookieValue,
  revokeSession,
} from "@/server/auth/session";
import {
  canUserAccessDocument,
  validateAndSavePrivateFile,
} from "@/server/documents/storage";

const tempDirs: string[] = [];

function useTempWorkspaceDb() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "eagle-ops-test-"));
  tempDirs.push(dir);
  process.env.EAGLE_DB_PATH = path.join(dir, "test.db");
  process.env.EAGLE_STORAGE_DIR = path.join(dir, "docs");
  resetDbConnectionForTests();
  return dir;
}

afterEach(() => {
  resetDbConnectionForTests();
  delete process.env.EAGLE_DB_PATH;
  delete process.env.EAGLE_STORAGE_DIR;
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe("Founder Dashboard authentication, RBAC, and document security", () => {
  it("hashes passwords with unique salts and verifies in constant time", () => {
    const h1 = hashPassword("StrongPass!2026");
    const h2 = hashPassword("StrongPass!2026");
    expect(h1).not.toBe(h2);
    expect(h1.startsWith("scrypt$")).toBe(true);
    expect(verifyPassword("StrongPass!2026", h1)).toBe(true);
    expect(verifyPassword("WrongPass!2026", h1)).toBe(false);
  });

  it("rejects tampered signed session cookies", () => {
    const signed = signSessionCookieValue("raw-session-token-123");
    expect(verifySignedSessionCookie(signed)).toBe("raw-session-token-123");
    expect(verifySignedSessionCookie(`${signed}tamper`)).toBeNull();
    expect(verifySignedSessionCookie("invalid")).toBeNull();
  });

  it("rate limits repeated failed login attempts", () => {
    const key = "login:test-rate-limit";
    resetLoginRateLimit(key);
    for (let i = 0; i < 12; i++) {
      expect(checkLoginRateLimit(key).allowed).toBe(true);
    }
    expect(checkLoginRateLimit(key).allowed).toBe(false);
    resetLoginRateLimit(key);
  });

  it("seeds 5 role-based accounts, 10 foundation goals at 0%, and enforces RBAC + session revocation", () => {
    useTempWorkspaceDb();
    const db = getDb();

    const goals = db
      .prepare("SELECT status, progress FROM goals WHERE is_demo = 0")
      .all() as Array<{ status: string; progress: number }>;
    expect(goals).toHaveLength(10);
    expect(goals.every((g) => g.status === "Not started" && g.progress === 0)).toBe(true);

    // Authenticate CEO
    const ceoAuth = authenticateFounderCredentials("ceo", "EagleFounders!2026");
    expect(ceoAuth.ok).toBe(true);
    if (!ceoAuth.ok) return;
    expect(ceoAuth.founder.permissions).toContain("decision.approve");
    expect(ceoAuth.founder.permissions).toContain("settings.manage");
    expect(ceoAuth.founder.permissions).toContain("audit.view");

    // Verify session resolution and revocation
    const resolved = resolveSessionFromCookieValue(ceoAuth.cookieValue);
    expect(resolved?.roleId).toBe("ceo");
    revokeSession(ceoAuth.founder.sessionId, ceoAuth.founder.userId, "ceo");
    expect(resolveSessionFromCookieValue(ceoAuth.cookieValue)).toBeNull();

    // Authenticate Frontend Developer and verify strict permission boundaries
    const feAuth = authenticateFounderCredentials("frontend", "EagleFounders!2026");
    expect(feAuth.ok).toBe(true);
    if (!feAuth.ok) return;
    expect(feAuth.founder.permissions).toContain("task.create");
    expect(feAuth.founder.permissions).toContain("document.upload");
    expect(feAuth.founder.permissions).not.toContain("decision.approve");
    expect(feAuth.founder.permissions).not.toContain("settings.manage");
    expect(feAuth.founder.permissions).not.toContain("audit.view");
    expect(feAuth.founder.permissions).not.toContain("project.archive");

    // Authenticate Registered Customer / Client
    const clientAuth = authenticateFounderCredentials("client", "EagleClient!2026");
    expect(clientAuth.ok).toBe(true);
    if (!clientAuth.ok) return;
    expect(clientAuth.founder.roleId).toBe("client");
    expect(clientAuth.founder.permissions).toContain("portal.view");
    expect(clientAuth.founder.permissions).toContain("portal.deliverables");
    expect(clientAuth.founder.permissions).toContain("developer.access");
    expect(clientAuth.founder.permissions).not.toContain("settings.manage");
    expect(clientAuth.founder.permissions).not.toContain("audit.view");
  }, 25000);

  it("validates private file uploads and enforces document access levels", () => {
    useTempWorkspaceDb();
    const db = getDb();

    // Reject disallowed extension
    const exeResult = validateAndSavePrivateFile(
      "malware.exe",
      "application/octet-stream",
      Buffer.from("MZ...")
    );
    expect(exeResult.ok).toBe(false);

    // Reject SVG with embedded <script>
    const xssSvg = validateAndSavePrivateFile(
      "icon.svg",
      "image/svg+xml",
      Buffer.from("<svg><script>alert(1)</script></svg>")
    );
    expect(xssSvg.ok).toBe(false);

    // Reject fake PDF without %PDF- header
    const fakePdf = validateAndSavePrivateFile(
      "../secret.pdf",
      "application/pdf",
      Buffer.from("not actually a pdf")
    );
    expect(fakePdf.ok).toBe(false);

    // Accept valid PDF
    const goodPdf = validateAndSavePrivateFile(
      "../../charter.pdf",
      "application/pdf",
      Buffer.from("%PDF-1.7 valid sample")
    );
    expect(goodPdf.ok).toBe(true);
    if (goodPdf.ok) {
      expect(goodPdf.sanitizedName).toBe("charter.pdf");
    }

    // Document access control checks
    const ceoOnlyDoc = {
      access_level: "ceo_only",
      allowed_roles_json: "[]",
      related_project_id: null,
      owner_user_id: "usr_ceo",
      uploaded_by: "usr_ceo",
    };
    expect(canUserAccessDocument(db, ceoOnlyDoc, "usr_ceo", "ceo")).toBe(true);
    expect(canUserAccessDocument(db, ceoOnlyDoc, "usr_backend", "backend")).toBe(false);

    const selectedRolesDoc = {
      access_level: "selected_roles",
      allowed_roles_json: JSON.stringify(["backend", "ai_automation"]),
      related_project_id: null,
      owner_user_id: "usr_ceo",
      uploaded_by: "usr_ceo",
    };
    expect(canUserAccessDocument(db, selectedRolesDoc, "usr_backend", "backend")).toBe(true);
    expect(canUserAccessDocument(db, selectedRolesDoc, "usr_design", "design")).toBe(false);
  });
});
