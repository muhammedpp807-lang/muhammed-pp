import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { profileSettings, projects, timelineEntries, achievements, contactMessages } from "@/db/schema";
import { desc, asc } from "drizzle-orm";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    redirect("/admin/login");
  }

  // Load all data
  let [profile] = await db.select().from(profileSettings).limit(1);
  if (!profile) {
    const [inserted] = await db.insert(profileSettings).values({ id: "default" }).returning();
    profile = inserted;
  }

  const allProjects = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder), asc(projects.id));

  const allTimeline = await db
    .select()
    .from(timelineEntries)
    .orderBy(asc(timelineEntries.sortOrder), asc(timelineEntries.id));

  const allAchievements = await db
    .select()
    .from(achievements)
    .orderBy(asc(achievements.sortOrder), asc(achievements.id));

  const allMessages = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt));

  return (
    <AdminDashboard
      initialProfile={profile}
      initialProjects={allProjects}
      initialTimeline={allTimeline}
      initialAchievements={allAchievements}
      initialMessages={allMessages}
    />
  );
}
