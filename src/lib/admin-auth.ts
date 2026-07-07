import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const ADMIN_EMAIL = "info@zerasoftwarestudio.com";
const ADMIN_PASSWORD_HASH = createHash("sha256").update("admin123!").digest("hex");
const JWT_SECRET = process.env.ADMIN_JWT_SECRET ?? "micro-admin-secret-fallback-key-2024";
const COOKIE_NAME = "admin_session";

function base64url(input: string): string {
  return Buffer.from(input).toString("base64url");
}

function sign(payload: Record<string, unknown>): string {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64url(JSON.stringify(payload));
  const signature = createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

function verify(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const expected = createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function validateCredentials(email: string, password: string): boolean {
  if (email !== ADMIN_EMAIL) return false;
  const hash = createHash("sha256").update(password).digest("hex");
  return hash === ADMIN_PASSWORD_HASH;
}

export function createSessionToken(): string {
  return sign({
    sub: ADMIN_EMAIL,
    role: "admin",
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000,
  });
}

export function verifySessionToken(token: string): boolean {
  return verify(token) !== null;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export { COOKIE_NAME };
