import type { DatabaseSync } from "node:sqlite";
import { generateId } from "./crypto";

export function logActivity(
  db: DatabaseSync,
  params: {
    actorUserId: string | null;
    entityType: string;
    entityId: string;
    action: string;
    summary: string;
    metadata?: Record<string, unknown>;
  }
): void {
  db.prepare(
    `INSERT INTO activity_logs (id, actor_user_id, entity_type, entity_id, action, summary, metadata_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    generateId("act"),
    params.actorUserId,
    params.entityType,
    params.entityId,
    params.action,
    params.summary,
    JSON.stringify(params.metadata ?? {}),
    new Date().toISOString()
  );
}

export function logAudit(
  db: DatabaseSync,
  params: {
    actorUserId: string | null;
    actorRole: string;
    action: string;
    targetType: string;
    targetId: string;
    status: "success" | "denied" | "error";
    details?: Record<string, unknown>;
  }
): void {
  db.prepare(
    `INSERT INTO audit_logs (id, actor_user_id, actor_role, action, target_type, target_id, status, details_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    generateId("aud"),
    params.actorUserId,
    params.actorRole,
    params.action,
    params.targetType,
    params.targetId,
    params.status,
    JSON.stringify(params.details ?? {}),
    new Date().toISOString()
  );
}

export function createNotification(
  db: DatabaseSync,
  params: {
    recipientUserId: string;
    type: string;
    title: string;
    message: string;
    linkHref?: string;
  }
): void {
  db.prepare(
    `INSERT INTO notifications (id, recipient_user_id, type, title, message, link_href, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    generateId("ntf"),
    params.recipientUserId,
    params.type,
    params.title,
    params.message,
    params.linkHref ?? "/dashboard",
    new Date().toISOString()
  );
}
