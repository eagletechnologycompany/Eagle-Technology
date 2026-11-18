import { NextResponse } from "next/server";
import { requireApiAuth } from "@/server/auth/session";
import { getDb } from "@/server/db/client";
import { generateId } from "@/server/auth/crypto";
import { logAudit } from "@/server/auth/audit";

export async function GET() {
  const auth = await requireApiAuth("developer.access");
  if (!auth.ok) return auth.response;

  const db = getDb();
  const keys = db
    .prepare(
      `SELECT id, key_prefix, label, environment, last_used_at, created_at
       FROM developer_sandbox_keys
       WHERE user_id = ? AND revoked_at IS NULL
       ORDER BY created_at DESC`
    )
    .all(auth.founder.userId);

  return NextResponse.json({ ok: true, keys });
}

export async function POST(req: Request) {
  const auth = await requireApiAuth("developer.access");
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const label = body.label || "Integration Sandbox Key";

    const db = getDb();
    const id = generateId("key");
    const randomSecret = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString("hex");
    const fullKey = `eag_test_${randomSecret}`;
    const keyPrefix = fullKey.slice(0, 12);
    const keyHash = `hash_${randomSecret}`;
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO developer_sandbox_keys (id, user_id, key_prefix, key_hash, label, environment, created_at)
       VALUES (?, ?, ?, ?, ?, 'sandbox', ?)`
    ).run(id, auth.founder.userId, keyPrefix, keyHash, label.trim(), now);

    logAudit(db, {
      actorUserId: auth.founder.userId,
      actorRole: auth.founder.roleId,
      action: "developer.create_key",
      targetType: "developer_sandbox_key",
      targetId: id,
      status: "success",
      details: { keyPrefix, label },
    });

    return NextResponse.json({
      ok: true,
      key: {
        id,
        fullKey,
        keyPrefix,
        label,
        environment: "sandbox",
        createdAt: now,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
