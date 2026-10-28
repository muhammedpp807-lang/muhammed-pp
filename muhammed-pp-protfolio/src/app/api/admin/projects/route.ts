import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allProjects = await db.select().from(projects).orderBy(asc(projects.sortOrder), asc(projects.id));
    return NextResponse.json({ projects: allProjects });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { title, subtitle, category, status, description, caseStudy, tags, liveUrl, githubUrl, imageUrl, featured, published, sortOrder } = data;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const slug = (title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")) + "-" + Math.random().toString(36).substring(2, 6);

    const [created] = await db
      .insert(projects)
      .values({
        slug,
        title: title.trim(),
        subtitle: subtitle?.trim() || "",
        category: category?.trim() || "Web Project",
        status: status || "Practical Project",
        description: description.trim(),
        caseStudy: caseStudy?.trim() || description.trim(),
        tags: Array.isArray(tags) ? tags : ["Tech"],
        liveUrl: liveUrl?.trim() || "",
        githubUrl: githubUrl?.trim() || "",
        imageUrl: imageUrl?.trim() || "",
        featured: Boolean(featured),
        published: published !== undefined ? Boolean(published) : true,
        sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
      })
      .returning();

    return NextResponse.json({ success: true, project: created });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { id, ...updates } = data;

    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Clean up updates object
    const cleanUpdates: Record<string, any> = {};
    if (updates.title !== undefined) cleanUpdates.title = updates.title.trim();
    if (updates.subtitle !== undefined) cleanUpdates.subtitle = updates.subtitle.trim();
    if (updates.category !== undefined) cleanUpdates.category = updates.category.trim();
    if (updates.status !== undefined) cleanUpdates.status = updates.status;
    if (updates.description !== undefined) cleanUpdates.description = updates.description.trim();
    if (updates.caseStudy !== undefined) cleanUpdates.caseStudy = updates.caseStudy.trim();
    if (updates.tags !== undefined) cleanUpdates.tags = Array.isArray(updates.tags) ? updates.tags : [];
    if (updates.liveUrl !== undefined) cleanUpdates.liveUrl = updates.liveUrl.trim();
    if (updates.githubUrl !== undefined) cleanUpdates.githubUrl = updates.githubUrl.trim();
    if (updates.imageUrl !== undefined) cleanUpdates.imageUrl = updates.imageUrl.trim();
    if (updates.featured !== undefined) cleanUpdates.featured = Boolean(updates.featured);
    if (updates.published !== undefined) cleanUpdates.published = Boolean(updates.published);
    if (updates.sortOrder !== undefined) cleanUpdates.sortOrder = Number(updates.sortOrder);

    const [updated] = await db
      .update(projects)
      .set(cleanUpdates)
      .where(eq(projects.id, Number(id)))
      .returning();

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    await db.delete(projects).where(eq(projects.id, Number(id)));
    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
