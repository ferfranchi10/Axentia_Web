import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_SECRET = process.env.SESSION_SECRET || "axentia_fallback_secure_session_secret_key_64_bytes_value_xyz123";

interface SessionPayload {
  admin: boolean;
  exp: number;
}

export function signToken(payload: SessionPayload): string {
  const data = JSON.stringify(payload);
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(data)
    .digest("hex");
  return `${Buffer.from(data).toString("base64")}.${signature}`;
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [dataB64, signature] = parts;
    const data = Buffer.from(dataB64, "base64").toString("utf-8");

    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(data)
      .digest("hex");

    // Constant-time comparison to prevent timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload = JSON.parse(data) as SessionPayload;
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Token has expired
    }

    return payload;
  } catch {
    return null;
  }
}

// Usado por las API routes internas (motor de prospección) para verificar
// la sesión de /admin sin repetir el mismo boilerplate de cookie en cada una.
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("axentia-admin-session")?.value;
  if (!token) return false;
  const payload = verifyToken(token);
  return !!payload?.admin;
}
