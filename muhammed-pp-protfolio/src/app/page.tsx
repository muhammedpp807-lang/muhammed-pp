import { db } from "@/db";
import { profileSettings, projects, timelineEntries, achievements } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import PortfolioClient from "@/components/PortfolioClient";
import { seedDatabase } from "@/db/seed";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Ensure database has initial seeded records if needed
  let [profile] = await db.select().from(profileSettings).limit(1);
  if (!profile) {
    await seedDatabase();
    const [freshProfile] = await db.select().from(profileSettings).limit(1);
    profile = freshProfile;
  }

  const allProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.sortOrder), asc(projects.id));

  const allTimeline = await db
    .select()
    .from(timelineEntries)
    .where(eq(timelineEntries.published, true))
    .orderBy(asc(timelineEntries.sortOrder), asc(timelineEntries.id));

  const allAchievements = await db
    .select()
    .from(achievements)
    .where(eq(achievements.published, true))
    .orderBy(asc(achievements.sortOrder), asc(achievements.id));

  // Fallback profile if still empty
  const verifiedProfile = profile || {
    id: "default",
    name: "Muhammed PP",
    tagline: "Student, Computer Technician & DIGIHUB Administrator",
    headline: "Curious by nature.\nBuilt through technology.",
    supportingCopy:
      "I’m a student and computer technician exploring technology, networking, and web development through practical projects and experimentation.",
    bio: "Muhammed PP is a student at Darul Hasanath Islamic College in Kannadiparamba, Kannur, Kerala. He enjoys learning about computers, solving technical problems, exploring networking, and building websites. As an administrator at DIGIHUB, he is interested in practical computer-lab operations and IT support. His projects reflect a hands-on approach to learning, experimentation, and creative problem-solving.",
    location: "Kolantha, Kerala, India",
    education: "Darul Hasanath Islamic College, Kannadiparamba, Kannur, Kerala",
    portraitUrl: "",
    featuredProjectId: 2,
    contactEmail: "",
    githubUrl: "https://github.com/muhammedpp807-lang",
    interests: [
      "Computer Technology & Diagnostics",
      "Local Area Networking & IP Configuration",
      "Computer Lab Systems Administration",
      "Modern Web Frontend & Interactive UIs",
      "Practical Troubleshooting & Hardware",
      "Experimental Game Mechanics in Browser",
    ],
    updatedAt: new Date(),
  };

  return (
    <PortfolioClient
      profile={verifiedProfile}
      projects={allProjects}
      timeline={allTimeline}
      achievements={allAchievements}
    />
  );
}
