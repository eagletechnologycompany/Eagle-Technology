import { SOLUTION_AREAS } from "@/data/solutions";

export interface ContactPayload {
  fullName: string;
  organization: string;
  email: string;
  subject: string;
  service: string;
  description: string;
}

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SERVICE_OPTIONS = [
  ...SOLUTION_AREAS.map((s) => ({ value: s.id, label: s.name })),
  { value: "general", label: "General Inquiry / Discovery Conversation" },
];

export function resolveInitialService(rawService?: string | null): string {
  if (!rawService) return "general";
  const normalized = rawService.trim().toLowerCase();
  const match = SERVICE_OPTIONS.find((opt) => opt.value === normalized);
  return match ? match.value : "general";
}

export function validateContactPayload(input: Partial<ContactPayload>): {
  valid: boolean;
  errors: ContactErrors;
  sanitized: ContactPayload;
} {
  const sanitized: ContactPayload = {
    fullName: (input.fullName ?? "").trim(),
    organization: (input.organization ?? "").trim(),
    email: (input.email ?? "").trim(),
    subject: (input.subject ?? "").trim(),
    service: resolveInitialService(input.service),
    description: (input.description ?? "").trim(),
  };

  const errors: ContactErrors = {};

  if (sanitized.fullName.length < 2) {
    errors.fullName = "Please enter your full name (at least 2 characters).";
  }

  if (sanitized.organization.length < 2) {
    errors.organization = "Please enter your organization name (or 'Individual').";
  }

  if (!EMAIL_PATTERN.test(sanitized.email)) {
    errors.email = "Please provide a valid email address.";
  }

  if (sanitized.subject.length < 3) {
    errors.subject = "Please enter a brief subject (at least 3 characters).";
  }

  if (sanitized.description.length < 15) {
    errors.description =
      "Please share a brief description of your challenge or project (at least 15 characters).";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}
