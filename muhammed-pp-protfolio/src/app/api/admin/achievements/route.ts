import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { achievements } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const list = await db.select().from(achievements).orderBy(asc(achievements.sortOrder), asc(achievements.id));
    return NextResponse.json({ achievements: list });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, issuer, period, description, credentialUrl, published, sortOrder } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const [created] = await db
      .insert(achievements)
      .values({
        title: title.trim(),
        issuer: issuer?.trim() || "",
        period: period?.trim() || "",
        description: description.trim(),
        credentialUrl: credentialUrl?.trim() || "",
        published: published !== undefined ? Boolean(published) : true,
        sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
      })
      .returning();

    return NextResponse.json({ success: true, item: created });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const cleanUpdates: Record<string, any> = {};
    if (updates.title !== undefined) cleanUpdates.title = updates.title.trim();
    if (updates.issuer !== undefined) cleanUpdates.issuer = updates.issuer.trim();
    if (updates.period !== undefined) cleanUpdates.period = updates.period.trim();
    if (updates.description !== undefined) cleanUpdates.description = updates.description.trim();
    if (updates.credentialUrl !== undefined) cleanUpdates.credentialUrl = updates.credentialUrl.trim();
    if (updates.published !== undefined) cleanUpdates.published = Boolean(updates.published);
    if (updates.sortOrder !== undefined) cleanUpdates.sortOrder = Number(updates.sortOrder);

    const [updated] = await db
      .update(achievements)
      .set(cleanUpdates)
      .where(eq(achievements.id, Number(id)))
      .returning();

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update achievement" }, { status: 500 });
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
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.delete(achievements).where(eq(achievements.id, Number(id)));
    return NextResponse.json({ success: true, message: "Achievement deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete achievement" }, { status: 500 });
  }
}
