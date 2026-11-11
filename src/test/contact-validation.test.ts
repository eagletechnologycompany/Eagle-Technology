import { describe, expect, it } from "vitest";
import {
  resolveInitialService,
  validateContactPayload,
} from "@/lib/contact-validation";

describe("contact form validation", () => {
  it("accepts a complete, valid inquiry payload", () => {
    const result = validateContactPayload({
      fullName: "Abebe Bikila",
      organization: "Addis Craft Co.",
      email: "abebe@example.com",
      subject: "Custom inventory web portal",
      service: "software",
      description:
        "We need a simple internal system to track stock across two branches.",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.sanitized.service).toBe("software");
  });

  it("rejects invalid emails and short descriptions", () => {
    const result = validateContactPayload({
      fullName: "A",
      organization: "",
      email: "not-an-email",
      subject: "Hi",
      service: "unknown",
      description: "Too short",
    });

    expect(result.valid).toBe(false);
    expect(result.errors.fullName).toBeDefined();
    expect(result.errors.organization).toBeDefined();
    expect(result.errors.email).toBeDefined();
    expect(result.errors.subject).toBeDefined();
    expect(result.errors.description).toBeDefined();
    expect(result.sanitized.service).toBe("general");
  });

  it("normalizes service query parameters safely", () => {
    expect(resolveInitialService("AI")).toBe("ai");
    expect(resolveInitialService("design")).toBe("design");
    expect(resolveInitialService("nonexistent")).toBe("general");
    expect(resolveInitialService(undefined)).toBe("general");
  });
});
