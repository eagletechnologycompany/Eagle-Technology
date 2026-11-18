import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "@/server/db/client";
import { runMigrations } from "@/server/db/migrations";
import { seedDatabaseIfNeeded } from "@/server/db/seed";
import {
  registerClientAccount,
  resolveSessionFromCookieValue,
  getPermissionsForRole,
} from "@/server/auth/session";

describe("Customer Sign-Up and Registration Engine", () => {
  beforeAll(() => {
    const db = getDb();
    runMigrations(db);
    seedDatabaseIfNeeded(db);
  });

  it("successfully registers a new customer organization and issues valid session", () => {
    const testEmail = `newcustomer.${Date.now()}@hornfintech.et`;
    const result = registerClientAccount({
      fullName: "Meron Tadesse",
      organization: "Horn Fintech Solutions",
      email: testEmail,
      password: "StrongCustomerPass!2026",
      useCase: "Commercial Client",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.founder.roleId).toBe("client");
    expect(result.founder.roleTitle).toBe("Registered Customer");
    expect(result.founder.displayLabel).toContain("Horn Fintech Solutions");
    expect(result.cookieValue).toBeTruthy();

    // Verify session resolves correctly from cookie
    const resolved = resolveSessionFromCookieValue(result.cookieValue);
    expect(resolved).not.toBeNull();
    expect(resolved?.roleId).toBe("client");
    expect(resolved?.username).toBe(testEmail);

    // Verify client permissions
    const permissions = getPermissionsForRole("client");
    expect(permissions).toContain("portal.view");
    expect(permissions).toContain("portal.deliverables");
    expect(permissions).toContain("portal.requests");
    expect(permissions).toContain("developer.access");
  });

  it("rejects duplicate email registrations", () => {
    const duplicateEmail = `duptest.${Date.now()}@eagletest.et`;
    const first = registerClientAccount({
      fullName: "Dawit Alemu",
      organization: "First Org",
      email: duplicateEmail,
      password: "Password123!456",
    });
    expect(first.ok).toBe(true);

    const second = registerClientAccount({
      fullName: "Another User",
      organization: "Second Org",
      email: duplicateEmail,
      password: "Password123!456",
    });
    expect(second.ok).toBe(false);
    if (!second.ok) {
      expect(second.reason).toContain("already exists");
    }
  });

  it("validates email formatting and minimum password length", () => {
    const invalidEmail = registerClientAccount({
      fullName: "Invalid Email User",
      organization: "Test Org",
      email: "not-an-email",
      password: "ValidPass1234!",
    });
    expect(invalidEmail.ok).toBe(false);

    const shortPass = registerClientAccount({
      fullName: "Short Pass User",
      organization: "Test Org",
      email: "valid@test.et",
      password: "short",
    });
    expect(shortPass.ok).toBe(false);
  });
});
