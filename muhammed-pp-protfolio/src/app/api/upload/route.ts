import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifyAdminSession } from "@/lib/auth";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};
const MAX_SIZE = 4 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_SIZE + 64 * 1024) {
      return NextResponse.json({ error: "Images must be 4 MB or smaller." }, { status: 413 });
    }
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Choose a supported image file." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file === "string" || typeof file.arrayBuffer !== "function") {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Use a JPG, PNG, WebP, GIF, or SVG image." }, { status: 415 });
  }
  if (file.size < 1 || file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Images must be 4 MB or smaller." }, { status: 413 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const originalExt = path.extname(file.name);
    const originalBase = path.basename(file.name, originalExt);
    const cleanBase = originalBase.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30) || "portfolio-image";
    const filename = `${cleanBase}-${Date.now()}${EXTENSIONS[file.type]}`;

    if (process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN || (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID)) {
      const blob = await put(`uploads/${filename}`, buffer, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
        cacheControlMaxAge: 60 * 60 * 24 * 30,
      });
      return NextResponse.json({ success: true, url: blob.url, filename });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer, { flag: "wx" });
    return NextResponse.json({ success: true, url: `/uploads/${filename}`, filename });
  } catch (error) {
    console.error("Upload error:", error);
    const message = process.env.VERCEL
      ? "Image storage is unavailable. Connect a Vercel Blob store to this project and redeploy."
      : "Failed to store this image.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
