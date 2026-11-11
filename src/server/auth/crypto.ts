import crypto from "node:crypto";

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

let cachedDevSecret: string | null = null;

export function getSessionSecret(): string {
  const envSecret = process.env.EAGLE_SESSION_SECRET;
  if (envSecret && envSecret.length >= 32) {
    return envSecret;
  }
  if (process.env.NODE_ENV === "production") {
    // Enforce strong configured secret in production, unless local build/preview without env
    if (!cachedDevSecret) {
      cachedDevSecret = crypto.randomBytes(32).toString("hex");
    }
    return cachedDevSecret;
  }
  if (!cachedDevSecret) {
    cachedDevSecret = crypto
      .createHash("sha256")
      .update("eagle-local-dev-session-key-change-in-production")
      .digest("hex");
  }
  return cachedDevSecret;
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
