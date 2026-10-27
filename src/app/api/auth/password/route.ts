import { NextResponse } from "next/server";
import { verifyAdminSession, updateAdminPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { oldPassword, newPassword } = await request.json();
    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: "Both current and new passwords are required" }, { status: 400 });
    }

    const res = await updateAdminPassword(oldPassword, newPassword);
    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
