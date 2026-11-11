import { NextResponse } from "next/server";
import { validateContactPayload } from "@/lib/contact-validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, message: "Request payload must be an object." },
      { status: 400 }
    );
  }

  const { valid, errors, sanitized } = validateContactPayload(
    body as Record<string, string>
  );

  if (!valid) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please review the highlighted fields.",
        errors,
      },
      { status: 422 }
    );
  }

  // NOTE: Official email transport (e.g. SMTP / Resend) will be wired via
  // environment variables once the founding team provisions the official domain.
  const isMailConfigured = Boolean(process.env.CONTACT_RECIPIENT_EMAIL);

  return NextResponse.json(
    {
      ok: true,
      mode: isMailConfigured ? "configured" : "preview-placeholder",
      inquiry: {
        fullName: sanitized.fullName,
        organization: sanitized.organization,
        service: sanitized.service,
        subject: sanitized.subject,
        receivedAt: new Date().toISOString(),
      },
      message: isMailConfigured
        ? "Thank you. Your inquiry has been received by the Eagle Technology team."
        : "Your inquiry passed validation in preview mode. Official email forwarding is pending domain and SMTP configuration.",
    },
    { status: 200 }
  );
}
