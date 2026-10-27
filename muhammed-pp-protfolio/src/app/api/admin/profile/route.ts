import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { profileSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    let [profile] = await db.select().from(profileSettings).limit(1);
    if (!profile) {
      const [inserted] = await db
        .insert(profileSettings)
        .values({ id: "default" })
        .returning();
      profile = inserted;
    }
    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile settings" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const cleanUpdates: Record<string, any> = { updatedAt: new Date() };

    if (body.name !== undefined) cleanUpdates.name = body.name.trim();
    if (body.tagline !== undefined) cleanUpdates.tagline = body.tagline.trim();
    if (body.headline !== undefined) cleanUpdates.headline = body.headline.trim();
    if (body.supportingCopy !== undefined) cleanUpdates.supportingCopy = body.supportingCopy.trim();
    if (body.bio !== undefined) cleanUpdates.bio = body.bio.trim();
    if (body.location !== undefined) cleanUpdates.location = body.location.trim();
    if (body.education !== undefined) cleanUpdates.education = body.education.trim();
    if (body.portraitUrl !== undefined) cleanUpdates.portraitUrl = body.portraitUrl.trim();
    if (body.featuredProjectId !== undefined) cleanUpdates.featuredProjectId = Number(body.featuredProjectId);
    if (body.contactEmail !== undefined) cleanUpdates.contactEmail = body.contactEmail.trim();
    if (body.githubUrl !== undefined) cleanUpdates.githubUrl = body.githubUrl.trim();
    if (body.interests !== undefined) cleanUpdates.interests = Array.isArray(body.interests) ? body.interests : [];

    const [updated] = await db
      .update(profileSettings)
      .set(cleanUpdates)
      .where(eq(profileSettings.id, "default"))
      .returning();

    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Failed to update profile settings" }, { status: 500 });
  }
}
