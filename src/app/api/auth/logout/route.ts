import { NextResponse } from "next/server";
import {
  getCurrentFounder,
  revokeSession,
  SESSION_COOKIE_NAME,
} from "@/server/auth/session";

export async function POST() {
  const founder = await getCurrentFounder();
  if (founder) {
    revokeSession(founder.sessionId, founder.userId, founder.roleId);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
  return response;
}
