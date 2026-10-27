import crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "@/db";
import { adminConfig } from "@/db/schema";
import { eq } from "drizzle-orm";

const COOKIE_NAME = "mpp_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function hashPassword(password: string, salt = "mpp_salt_2026"): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

function createToken(secret: string): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `admin:${expiresAt}`;
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}:${hmac}`;
}

function verifyToken(token: string, secret: string): boolean {
  try {
    const parts = token.split(":");
    if (parts.length !== 3) return false;
    const [user, expiresAtStr, receivedHmac] = parts;
    if (user !== "admin") return false;

    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

    const payload = `${user}:${expiresAtStr}`;
    const expectedHmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(receivedHmac), Buffer.from(expectedHmac));
  } catch {
    return false;
  }
}

export async function getAdminConfig() {
  const [config] = await db.select().from(adminConfig).where(eq(adminConfig.id, "admin_auth")).limit(1);
  if (!config) {
    const initialPassword = process.env.ADMIN_PASSWORD || "mpp_admin_2026!";
    const passwordHash = hashPassword(initialPassword);
    const sessionSecret = crypto.randomBytes(32).toString("hex");
    const [newConfig] = await db
      .insert(adminConfig)
      .values({
        id: "admin_auth",
        passwordHash,
        sessionSecret,
      })
      .returning();
    return newConfig;
  }
  return config;
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (!sessionCookie?.value) return false;

    const config = await getAdminConfig();
    return verifyToken(sessionCookie.value, config.sessionSecret);
  } catch {
    return false;
  }
}

export async function loginAdmin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const config = await getAdminConfig();
    const inputHash = hashPassword(password);
    const envPass = process.env.ADMIN_PASSWORD;

    const matchesDb = crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(config.passwordHash));
    const matchesEnv = envPass ? password === envPass : false;

    if (!matchesDb && !matchesEnv) {
      return { success: false, error: "Incorrect administrator password" };
    }

    const token = createToken(config.sessionSecret);
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });

    return { success: true, token };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Authentication system error" };
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
  } catch (error) {
    console.error("Logout error:", error);
  }
}

export async function updateAdminPassword(oldPass: string, newPass: string): Promise<{ success: boolean; error?: string }> {
  try {
    const config = await getAdminConfig();
    const oldHash = hashPassword(oldPass);

    if (!crypto.timingSafeEqual(Buffer.from(oldHash), Buffer.from(config.passwordHash))) {
      return { success: false, error: "Current password is not correct" };
    }

    if (!newPass || newPass.length < 8) {
      return { success: false, error: "New password must be at least 8 characters long" };
    }

    const newHash = hashPassword(newPass);
    const newSecret = crypto.randomBytes(32).toString("hex");

    await db
      .update(adminConfig)
      .set({
        passwordHash: newHash,
        sessionSecret: newSecret,
        updatedAt: new Date(),
      })
      .where(eq(adminConfig.id, "admin_auth"));

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update password" };
  }
}
