import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const SCRYPT_KEYLEN = 64;
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto
    .scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_PARAMS)
    .toString("hex");
  return `scrypt$${salt}$${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") {
    return false;
  }
  const [, salt, expectedHex] = parts;
  if (!salt || !expectedHex) return false;

  try {
    const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_PARAMS);
    const expected = Buffer.from(expectedHex, "hex");
    if (derived.length !== expected.length) return false;
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashSessionToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

const globalForSecret = globalThis as unknown as { __eagleSessionSecret?: string };

export function getSessionSecret(): string {
  const envSecret = process.env.EAGLE_SESSION_SECRET;
  if (envSecret && envSecret.length >= 32) {
    return envSecret;
  }
  if (globalForSecret.__eagleSessionSecret) {
    return globalForSecret.__eagleSessionSecret;
  }

  // Persist a shared server-local secret under data/.session-secret so all
  // Next.js route/page chunks verify the same HMAC signature when EAGLE_SESSION_SECRET
  // is not explicitly configured.
  const secretDir = path.join(process.cwd(), "data");
  const secretFile = path.join(secretDir, ".session-secret");
  try {
    if (fs.existsSync(secretFile)) {
      const existing = fs.readFileSync(secretFile, "utf8").trim();
      if (existing.length >= 32) {
        globalForSecret.__eagleSessionSecret = existing;
        return existing;
      }
    }
    fs.mkdirSync(secretDir, { recursive: true });
    const generated = crypto.randomBytes(32).toString("hex");
    fs.writeFileSync(secretFile, generated, { mode: 0o600 });
    globalForSecret.__eagleSessionSecret = generated;
    return generated;
  } catch {
    const fallback = crypto
      .createHash("sha256")
      .update("eagle-local-fallback-key-configure-EAGLE_SESSION_SECRET")
      .digest("hex");
    globalForSecret.__eagleSessionSecret = fallback;
    return fallback;
  }
}

export function signSessionCookieValue(rawToken: string): string {
  const sig = crypto
    .createHmac("sha256", getSessionSecret())
    .update(rawToken)
    .digest("base64url");
  return `${rawToken}.${sig}`;
}

export function verifySignedSessionCookie(cookieValue: string): string | null {
  const dotIndex = cookieValue.lastIndexOf(".");
  if (dotIndex <= 0) return null;
  const rawToken = cookieValue.slice(0, dotIndex);
  const providedSig = cookieValue.slice(dotIndex + 1);
  if (!rawToken || !providedSig) return null;

  const expectedSig = crypto
    .createHmac("sha256", getSessionSecret())
    .update(rawToken)
    .digest("base64url");

  const a = Buffer.from(providedSig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length) return null;
  return crypto.timingSafeEqual(a, b) ? rawToken : null;
}

export function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}
