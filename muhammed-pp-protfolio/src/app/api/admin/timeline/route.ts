import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { timelineEntries } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const list = await db.select().from(timelineEntries).orderBy(asc(timelineEntries.sortOrder), asc(timelineEntries.id));
    return NextResponse.json({ timeline: list });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch timeline" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, category, organization, description, period, sortOrder, published } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const [created] = await db
      .insert(timelineEntries)
      .values({
        title: title.trim(),
        category: category?.trim() || "Milestone",
        organization: organization?.trim() || "",
        description: description.trim(),
        period: period?.trim() || "Ongoing",
        sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
        published: published !== undefined ? Boolean(published) : true,
      })
      .returning();

    return NextResponse.json({ success: true, item: created });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create timeline entry" }, { status: 500 });
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
    if (updates.category !== undefined) cleanUpdates.category = updates.category.trim();
    if (updates.organization !== undefined) cleanUpdates.organization = updates.organization.trim();
    if (updates.description !== undefined) cleanUpdates.description = updates.description.trim();
    if (updates.period !== undefined) cleanUpdates.period = updates.period.trim();
    if (updates.sortOrder !== undefined) cleanUpdates.sortOrder = Number(updates.sortOrder);
    if (updates.published !== undefined) cleanUpdates.published = Boolean(updates.published);

    const [updated] = await db
      .update(timelineEntries)
      .set(cleanUpdates)
      .where(eq(timelineEntries.id, Number(id)))
      .returning();

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update timeline entry" }, { status: 500 });
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

    await db.delete(timelineEntries).where(eq(timelineEntries.id, Number(id)));
    return NextResponse.json({ success: true, message: "Entry deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete timeline entry" }, { status: 500 });
  }
}
