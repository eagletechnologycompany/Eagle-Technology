import { NextResponse } from "next/server";
import {
  registerClientAccount,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/server/auth/session";
import { checkLoginRateLimit, resetLoginRateLimit } from "@/server/auth/rate-limit";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request payload." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, error: "Registration payload is required." },
      { status: 400 }
    );
  }

  const { fullName, organization, email, password, useCase } = body as {
    fullName?: unknown;
    organization?: unknown;
    email?: unknown;
    password?: unknown;
    useCase?: unknown;
  };

  if (
    typeof fullName !== "string" ||
    typeof organization !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return NextResponse.json(
      { ok: false, error: "Full name, organization, email, and password are required." },
      { status: 400 }
    );
  }

  const rateKey = `signup:${email.trim().toLowerCase()}`;
  const rate = checkLoginRateLimit(rateKey);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: `Too many registration attempts. Please wait ${rate.retryAfterSeconds} seconds.`,
      },
      { status: 429 }
    );
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const result = registerClientAccount({
    fullName,
    organization,
    email,
    password,
    useCase: typeof useCase === "string" ? useCase : undefined,
    userAgent,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 400 });
  }

  resetLoginRateLimit(rateKey);

  const response = NextResponse.json({
    ok: true,
    founder: {
      userId: result.founder.userId,
      username: result.founder.username,
      roleId: result.founder.roleId,
      roleTitle: result.founder.roleTitle,
      shortTitle: result.founder.shortTitle,
      displayLabel: result.founder.displayLabel,
    },
  });

  response.cookies.set(
    SESSION_COOKIE_NAME,
    result.cookieValue,
    getSessionCookieOptions(result.founder.expiresAt)
  );

  return response;
}
