import { NextResponse } from "next/server";
import { loginAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const res = await loginAdmin(password);
    if (!res.success) {
      return NextResponse.json({ error: res.error || "Authentication failed" }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: "Authenticated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Server error during authentication" }, { status: 500 });
  }
}
