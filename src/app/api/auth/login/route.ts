import { NextResponse } from "next/server";
import {
  authenticateFounderCredentials,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/server/auth/session";
import {
  checkLoginRateLimit,
  resetLoginRateLimit,
} from "@/server/auth/rate-limit";

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
      { ok: false, error: "Credentials payload is required." },
      { status: 400 }
    );
  }

  const { username, password } = body as {
    username?: unknown;
    password?: unknown;
  };

  if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password) {
    return NextResponse.json(
      { ok: false, error: "Role username and password are required." },
      { status: 400 }
    );
  }

  const rateKey = `login:${username.trim().toLowerCase()}`;
  const rate = checkLoginRateLimit(rateKey);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: `Too many sign-in attempts. Please wait ${rate.retryAfterSeconds} seconds.`,
      },
      { status: 429 }
    );
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const auth = authenticateFounderCredentials(username, password, userAgent);

  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.reason }, { status: 401 });
  }

  resetLoginRateLimit(rateKey);

  const response = NextResponse.json({
    ok: true,
    founder: {
      userId: auth.founder.userId,
      username: auth.founder.username,
      roleId: auth.founder.roleId,
      roleTitle: auth.founder.roleTitle,
      shortTitle: auth.founder.shortTitle,
      permissions: auth.founder.permissions,
    },
  });

  response.cookies.set(
    SESSION_COOKIE_NAME,
    auth.cookieValue,
    getSessionCookieOptions(auth.founder.expiresAt)
  );

  return response;
}
