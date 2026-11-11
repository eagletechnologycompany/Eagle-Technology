import { NextResponse } from "next/server";
import { getDb } from "@/server/db/client";
import { requireApiAuth } from "@/server/auth/session";
import { getOverviewData } from "@/server/dashboard/queries";

export async function GET() {
  const auth = await requireApiAuth();
  if (!auth.ok) return auth.response;

  const db = getDb();
  const data = getOverviewData(db, auth.founder.userId, auth.founder.roleId);
  return NextResponse.json({ ok: true, ...data });
}
