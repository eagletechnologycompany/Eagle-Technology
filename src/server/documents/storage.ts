import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import type { DocumentAccessLevel, RoleId } from "@/lib/dashboard-constants";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
  ".md",
  ".txt",
  ".csv",
  ".json",
  ".docx",
  ".xlsx",
  ".pptx",
  ".zip",
]);

export const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "text/markdown",
  "text/plain",
  "text/csv",
  "application/json",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "application/octet-stream",
]);

export function getPrivateStorageDir(): string {
  const configured = process.env.EAGLE_STORAGE_DIR;
  const dir = configured || path.join(process.cwd(), "storage", "documents");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function sanitizeFileName(rawName: string): string {
  const base = path.basename(rawName).replace(/[^\w.\- ]+/g, "_").trim();
  return base.slice(0, 120) || "document";
}

function hasValidMagicBytes(ext: string, buffer: Buffer): boolean {
  if (buffer.length === 0) return false;
  if (ext === ".pdf") {
    return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
  }
  if (ext === ".png") {
    return (
      buffer.length >= 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }
  if (ext === ".jpg" || ext === ".jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (ext === ".zip" || ext === ".docx" || ext === ".xlsx" || ext === ".pptx") {
    return buffer.length >= 2 && buffer[0] === 0x50 && buffer[1] === 0x4b;
  }
  if (ext === ".svg") {
    const head = buffer.subarray(0, 512).toString("utf8").toLowerCase();
    // Reject embedded <script> tags inside SVGs
    return head.includes("<svg") && !buffer.toString("utf8").toLowerCase().includes("<script");
  }
  return true;
}

export function validateAndSavePrivateFile(
  fileName: string,
  mimeType: string,
  buffer: Buffer
):
  | { ok: true; sanitizedName: string; storageKey: string; sizeBytes: number; mimeType: string }
  | { ok: false; error: string } {
  const sanitizedName = sanitizeFileName(fileName);
  const ext = path.extname(sanitizedName).toLowerCase();

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return {
      ok: false,
      error: `File extension "${ext || "unknown"}" is not permitted.`,
    };
  }

  if (mimeType && !ALLOWED_MIME_TYPES.has(mimeType)) {
    return {
      ok: false,
      error: `MIME type "${mimeType}" is not permitted.`,
    };
  }

  if (buffer.length === 0 || buffer.length > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      error: "File size must be between 1 byte and 10 MB.",
    };
  }

  if (!hasValidMagicBytes(ext, buffer)) {
    return {
      ok: false,
      error: "File contents failed security format validation.",
    };
  }

  const storageKey = `${Date.now()}-${crypto.randomUUID()}${ext}`;
  const fullPath = path.join(getPrivateStorageDir(), storageKey);
  fs.writeFileSync(fullPath, buffer);

  return {
    ok: true,
    sanitizedName,
    storageKey,
    sizeBytes: buffer.length,
    mimeType: mimeType || "application/octet-stream",
  };
}

export function readPrivateFile(storageKey: string): Buffer | null {
  const safeKey = path.basename(storageKey);
  if (safeKey !== storageKey) return null;
  const fullPath = path.join(getPrivateStorageDir(), safeKey);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath);
}

export function canUserAccessDocument(
  db: DatabaseSync,
  doc: {
    access_level: DocumentAccessLevel | string;
    allowed_roles_json: string;
    related_project_id: string | null;
    owner_user_id: string;
    uploaded_by: string;
  },
  userId: string,
  roleId: RoleId
): boolean {
  if (roleId === "ceo") return true;
  if (doc.owner_user_id === userId || doc.uploaded_by === userId) return true;

  switch (doc.access_level) {
    case "all_founders":
      return true;
    case "ceo_only":
      return false;
    case "selected_roles": {
      try {
        const roles = JSON.parse(doc.allowed_roles_json) as string[];
        return roles.includes(roleId);
      } catch {
        return false;
      }
    }
    case "project_members": {
      if (!doc.related_project_id) return false;
      const member = db
        .prepare(
          "SELECT 1 FROM project_members WHERE project_id = ? AND user_id = ?"
        )
        .get(doc.related_project_id, userId);
      return Boolean(member);
    }
    default:
      return false;
  }
}
