import crypto from "node:crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { adminConfig } from "@/db/schema";

const COOKIE_NAME = "mpp_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const PASSWORD_ITERATIONS = 310_000;
const LEGACY_PASSWORD_SALT = "mpp_salt_2026";
const MIN_ADMIN_PASSWORD_LENGTH = 16;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const derived = crypto.pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, 64, "sha512");
  return `pbkdf2-sha512$${PASSWORD_ITERATIONS}$${salt.toString("base64url")}$${derived.toString("base64url")}`;
}

function safeStringEqual(left: string, right: string) {
  const a = Buffer.from(left, "utf8");
  const b = Buffer.from(right, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function isLegacyPasswordHash(storedHash: string) {
  return /^[a-f0-9]{128}$/i.test(storedHash);
}

function verifyPassword(password: string, storedHash: string) {
  const parts = storedHash.split("$");
  if (parts.length === 4 && parts[0] === "pbkdf2-sha512") {
    const iterations = Number(parts[1]);
    if (!Number.isInteger(iterations) || iterations < 100_000 || iterations > 1_000_000) return false;
    try {
      const salt = Buffer.from(parts[2], "base64url");
      const expected = Buffer.from(parts[3], "base64url");
      if (salt.length < 16 || expected.length !== 64) return false;
      const actual = crypto.pbkdf2Sync(password, salt, iterations, expected.length, "sha512");
      return crypto.timingSafeEqual(actual, expected);
    } catch {
      return false;
    }
  }

  // Backward compatibility only: old database hashes are upgraded after a secure env-password login.
  if (isLegacyPasswordHash(storedHash)) {
    const legacy = crypto.pbkdf2Sync(password, LEGACY_PASSWORD_SALT, 1000, 64, "sha512").toString("hex");
    return safeStringEqual(legacy, storedHash.toLowerCase());
  }
  return false;
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

    const expiresAt = Number.parseInt(expiresAtStr, 10);
    if (!Number.isSafeInteger(expiresAt) || Date.now() > expiresAt) return false;

    const payload = `${user}:${expiresAtStr}`;
    const expectedHmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    return safeStringEqual(receivedHmac, expectedHmac);
  } catch {
    return false;
  }
}

export async function getAdminConfig() {
  const [existing] = await db.select().from(adminConfig).where(eq(adminConfig.id, "admin_auth")).limit(1);
  if (existing) return existing;

  const initialPassword = process.env.ADMIN_PASSWORD;
  if (!initialPassword || initialPassword.length < MIN_ADMIN_PASSWORD_LENGTH) {
    throw new Error(`Admin is not provisioned. Set ADMIN_PASSWORD to a unique password with at least ${MIN_ADMIN_PASSWORD_LENGTH} characters before first admin sign-in.`);
  }

  const [created] = await db
    .insert(adminConfig)
    .values({
      id: "admin_auth",
      passwordHash: hashPassword(initialPassword),
      sessionSecret: crypto.randomBytes(32).toString("base64url"),
    })
    .onConflictDoNothing()
    .returning();

  if (created) return created;
  const [raced] = await db.select().from(adminConfig).where(eq(adminConfig.id, "admin_auth")).limit(1);
  if (!raced) throw new Error("Admin configuration could not be created.");
  return raced;
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
    let config = await getAdminConfig();

    if (isLegacyPasswordHash(config.passwordHash)) {
      const bootstrapPassword = process.env.ADMIN_PASSWORD;
      if (!bootstrapPassword || bootstrapPassword.length < MIN_ADMIN_PASSWORD_LENGTH || !safeStringEqual(password, bootstrapPassword)) {
        return {
          success: false,
          error: `This database has a legacy admin hash. Set a new ${MIN_ADMIN_PASSWORD_LENGTH}+ character ADMIN_PASSWORD in the server environment, then sign in once to upgrade it.`,
        };
      }

      const [upgraded] = await db
        .update(adminConfig)
        .set({
          passwordHash: hashPassword(bootstrapPassword),
          sessionSecret: crypto.randomBytes(32).toString("base64url"),
          updatedAt: new Date(),
        })
        .where(eq(adminConfig.id, "admin_auth"))
        .returning();
      if (!upgraded) return { success: false, error: "Admin credentials could not be upgraded." };
      config = upgraded;
    } else if (!verifyPassword(password, config.passwordHash)) {
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
    const message = error instanceof Error ? error.message : "Authentication system error";
    return { success: false, error: message };
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
    if (!verifyPassword(oldPass, config.passwordHash)) {
      return { success: false, error: "Current password is not correct" };
    }

    if (!newPass || newPass.length < MIN_ADMIN_PASSWORD_LENGTH) {
      return { success: false, error: `New password must be at least ${MIN_ADMIN_PASSWORD_LENGTH} characters long` };
    }

    await db
      .update(adminConfig)
      .set({
        passwordHash: hashPassword(newPass),
        sessionSecret: crypto.randomBytes(32).toString("base64url"),
        updatedAt: new Date(),
      })
      .where(eq(adminConfig.id, "admin_auth"));

    return { success: true };
  } catch (error) {
    console.error("Password update error:", error);
    return { success: false, error: "Failed to update password" };
  }
}
