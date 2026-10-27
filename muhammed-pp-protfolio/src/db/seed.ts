import { db } from "./index";
import { profileSettings, projects, timelineEntries, adminConfig, contactMessages } from "./schema";
import crypto from "crypto";

export function hashPassword(password: string, salt = "mpp_salt_2026"): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

export async function seedDatabase() {
  try {
    // 1. Profile Settings
    const existingProfile = await db.select().from(profileSettings);
    if (existingProfile.length === 0) {
      await db.insert(profileSettings).values({
        id: "default",
        name: "Muhammed PP",
        tagline: "Student, Computer Technician & DIGIHUB Administrator",
        headline: "Curious by nature.\nBuilt through technology.",
        supportingCopy:
          "I’m a student and computer technician exploring technology, networking, and web development through practical projects and experimentation.",
        bio: "Muhammed PP is a student at Darul Hasanath Islamic College in Kannadiparamba, Kannur, Kerala. He enjoys learning about computers, solving technical problems, exploring networking, and building websites. As an administrator at DIGIHUB, he is interested in practical computer-lab operations and IT support. His projects reflect a hands-on approach to learning, experimentation, and creative problem-solving.",
        location: "Kolantha, Kerala, India",
        education: "Darul Hasanath Islamic College, Kannadiparamba, Kannur, Kerala",
        portraitUrl: "", // Will be uploaded by admin or provided at /images/muhammed-pp.png
        featuredProjectId: 2, // DIGIHUB IT Administration
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
      });
      console.log("Seeded profile settings");
    }

    // 2. Projects
    const existingProjects = await db.select().from(projects);
    if (existingProjects.length === 0) {
      await db.insert(projects).values([
        {
          id: 1,
          slug: "muhammed-pp-portfolio",
          title: "Muhammed PP Portfolio",
          subtitle: "Minimalist, Typography-Driven Digital Space",
          category: "Web Platform",
          status: "Live",
          description: "My personal digital space for presenting my profile, interests, and creative work.",
          caseStudy:
            "Designed with an electric-blue-accented dark aesthetic inspired by modern minimalist art direction. Built using Next.js App Router, TypeScript, and PostgreSQL with a custom server-backed admin suite. Features full responsiveness across viewports, zero startup friction for visitors, authentic factual content, and an integrated contact management system.",
          tags: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Drizzle ORM"],
          liveUrl: "https://muhammed-pp.vercel.app/",
          githubUrl: "https://github.com/muhammedpp807-lang/muhammed-pp",
          imageUrl: "",
          featured: false,
          published: true,
          sortOrder: 1,
        },
        {
          id: 2,
          slug: "digihub-it-administration",
          title: "DIGIHUB IT Administration",
          subtitle: "Computer-Lab Operations, Networking & Support",
          category: "IT & Systems",
          status: "Practical Project",
          description:
            "Practical experience supporting a computer-lab environment, exploring Windows administration, networking, and troubleshooting.",
          caseStudy:
            "Focused on practical day-to-day operations in a student computer lab. Involves workstation maintenance, diagnosing OS faults, verifying local area network connectivity (static and DHCP assignments), and establishing reliable computing environments for learners. Strictly adheres to security and privacy standards without exposing institutional configurations.",
          tags: ["Windows Administration", "LAN Networking", "Troubleshooting", "Hardware Maintenance"],
          liveUrl: "",
          githubUrl: "",
          imageUrl: "",
          featured: true,
          published: true,
          sortOrder: 2,
        },
        {
          id: 3,
          slug: "palabra-spanish-vocabulary",
          title: "Palabra / Sibaq Palabra",
          subtitle: "Interactive Spanish Vocabulary Learning Tool",
          category: "Educational Web App",
          status: "Prototype",
          description:
            "Interactive Spanish vocabulary-learning projects focused on typed answers, vocabulary practice, quizzes, and scoring.",
          caseStudy:
            "An interactive web learning application designed to help learners test and improve Spanish vocabulary. Implements typed input verification, immediate feedback states, streak and score tracking, and clean, high-contrast UI tailored for focused study sessions without distracting clutter.",
          tags: ["JavaScript", "Interactive UI", "Quiz Engine", "Language Learning", "Frontend"],
          liveUrl: "",
          githubUrl: "",
          imageUrl: "",
          featured: false,
          published: true,
          sortOrder: 3,
        },
        {
          id: 4,
          slug: "browser-football-simulation",
          title: "Browser Football Game",
          subtitle: "Experimental 3D Simulation & Player Controls",
          category: "Interactive Simulation",
          status: "Experimental",
          description:
            "An experimental browser-based football simulation exploring 3D environments, player controls, stadium presentation, and realistic gameplay.",
          caseStudy:
            "An exploratory graphics and game logic experiment built to understand interactive 3D rendering in web browsers. Investigates ball physics, pitch geometry, keyboard-driven movement controls, camera smoothing, and performance optimization across varying screen resolutions.",
          tags: ["WebGL", "Canvas", "Physics Simulation", "Game Controls", "Interactive 3D"],
          liveUrl: "",
          githubUrl: "",
          imageUrl: "",
          featured: false,
          published: true,
          sortOrder: 4,
        },
      ]);
      console.log("Seeded projects");
    }

    // 3. Timeline Entries
    const existingTimeline = await db.select().from(timelineEntries);
    if (existingTimeline.length === 0) {
      await db.insert(timelineEntries).values([
        {
          title: "Student at Darul Hasanath Islamic College",
          category: "College & Education",
          organization: "Darul Hasanath Islamic College, Kannadiparamba, Kannur, Kerala",
          description:
            "Pursuing ongoing academic studies while actively exploring computer systems, networking principles, and software development.",
          period: "Present",
          sortOrder: 1,
          published: true,
        },
        {
          title: "DIGIHUB Computer-Lab Administration",
          category: "Lab Administration",
          organization: "DIGIHUB",
          description:
            "Supporting practical computer-lab operations, maintaining student workstations, assisting peers with technical issues, and managing daily lab availability.",
          period: "Ongoing",
          sortOrder: 2,
          published: true,
        },
        {
          title: "Exploration of Computer Troubleshooting & Networking",
          category: "Technical Systems",
          organization: "Self-Directed Practical Learning",
          description:
            "Hands-on practice with Windows environments, LAN configuration, IP addressing, DNS/DHCP concepts, and systematic diagnostic workflows.",
          period: "Continuous",
          sortOrder: 3,
          published: true,
        },
        {
          title: "Development of Personal Websites & Learning Projects",
          category: "Web Exploration",
          organization: "Personal Projects",
          description:
            "Building responsive web applications, interactive learning tools (such as the Palabra Spanish vocabulary quiz), and this portfolio platform.",
          period: "Active",
          sortOrder: 4,
          published: true,
        },
        {
          title: "Experimentation with Browser-Based 3D Football Simulation",
          category: "Game Development",
          organization: "Experimental Graphics",
          description:
            "Exploring real-time 3D environments, physics calculations, and interactive control systems directly in the web browser.",
          period: "Experimental",
          sortOrder: 5,
          published: true,
        },
      ]);
      console.log("Seeded timeline entries");
    }

    // 4. Admin Config
    const existingAdmin = await db.select().from(adminConfig);
    if (existingAdmin.length === 0) {
      const initialPassword = process.env.ADMIN_PASSWORD || "mpp_admin_2026!";
      const passwordHash = hashPassword(initialPassword);
      const sessionSecret = crypto.randomBytes(32).toString("hex");

      await db.insert(adminConfig).values({
        id: "admin_auth",
        passwordHash,
        sessionSecret,
      });
      console.log("Initialized admin authentication config");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
