import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
    return NextResponse.json({ messages: list });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contact messages" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, isRead } = body;

    if (!id) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
    }

    const [updated] = await db
      .update(contactMessages)
      .set({ isRead: Boolean(isRead) })
      .where(eq(contactMessages.id, Number(id)))
      .returning();

    return NextResponse.json({ success: true, message: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
    }

    await db.delete(contactMessages).where(eq(contactMessages.id, Number(id)));
    return NextResponse.json({ success: true, message: "Message deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
