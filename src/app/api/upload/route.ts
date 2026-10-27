import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
const MAX_SIZE = 6 * 1024 * 1024; // 6MB

export async function POST(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file format. Allowed: JPG, PNG, WEBP, SVG, GIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File exceeds 6MB limit." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name) || ".png";
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
    const filename = `${cleanBase}-${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl, filename });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
