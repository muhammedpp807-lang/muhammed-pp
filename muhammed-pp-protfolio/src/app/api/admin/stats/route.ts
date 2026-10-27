import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { projects, achievements, contactMessages, timelineEntries, profileSettings } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const totalProjects = await db.select({ count: sql<number>`count(*)::int` }).from(projects);
    const publishedProjects = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(projects)
      .where(eq(projects.published, true));

    const totalAchievements = await db.select({ count: sql<number>`count(*)::int` }).from(achievements);
    const publishedAchievements = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(achievements)
      .where(eq(achievements.published, true));

    const totalMessages = await db.select({ count: sql<number>`count(*)::int` }).from(contactMessages);
    const unreadMessages = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(contactMessages)
      .where(eq(contactMessages.isRead, false));

    const totalTimeline = await db.select({ count: sql<number>`count(*)::int` }).from(timelineEntries);

    const [profile] = await db.select().from(profileSettings).limit(1);

    return NextResponse.json({
      stats: {
        totalProjects: totalProjects[0]?.count || 0,
        publishedProjects: publishedProjects[0]?.count || 0,
        totalAchievements: totalAchievements[0]?.count || 0,
        publishedAchievements: publishedAchievements[0]?.count || 0,
        totalMessages: totalMessages[0]?.count || 0,
        unreadMessages: unreadMessages[0]?.count || 0,
        totalTimeline: totalTimeline[0]?.count || 0,
        hasPortrait: Boolean(profile?.portraitUrl && profile.portraitUrl.length > 0),
        portraitUrl: profile?.portraitUrl || "",
        lastUpdated: profile?.updatedAt || new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}
