import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const profileSettings = pgTable("profile_settings", {
  id: text("id").primaryKey().default("default"),
  name: text("name").notNull().default("Muhammed PP"),
  tagline: text("tagline").notNull().default("Student, Computer Technician & DIGIHUB Administrator"),
  headline: text("headline").notNull().default("Curious by nature.\nBuilt through technology."),
  supportingCopy: text("supporting_copy").notNull().default(
    "I’m a student and computer technician exploring technology, networking, and web development through practical projects and experimentation."
  ),
  bio: text("bio").notNull().default(
    "Muhammed PP is a student at Darul Hasanath Islamic College in Kannadiparamba, Kannur, Kerala. He enjoys learning about computers, solving technical problems, exploring networking, and building websites. As an administrator at DIGIHUB, he is interested in practical computer-lab operations and IT support. His projects reflect a hands-on approach to learning, experimentation, and creative problem-solving."
  ),
  location: text("location").notNull().default("Kolantha, Kerala, India"),
  education: text("education").notNull().default(
    "Darul Hasanath Islamic College, Kannadiparamba, Kannur, Kerala"
  ),
  portraitUrl: text("portrait_url").default(""),
  featuredProjectId: integer("featured_project_id").default(2),
  contactEmail: text("contact_email").default(""),
  githubUrl: text("github_url").default("https://github.com/muhammedpp807-lang"),
  interests: text("interests").array().default([
    "Computer Technology & Diagnostics",
    "Local Area Networking & IP Configuration",
    "Computer Lab Systems Administration",
    "Modern Web Frontend & Interactive UIs",
    "Practical Troubleshooting & Hardware",
    "Experimental Game Mechanics in Browser"
  ]),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull(), // 'Live' | 'Practical Project' | 'Prototype' | 'Experimental'
  description: text("description").notNull(),
  caseStudy: text("case_study").notNull(),
  tags: text("tags").array().notNull(),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  imageUrl: text("image_url"),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const timelineEntries = pgTable("timeline_entries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  organization: text("organization").notNull(),
  description: text("description").notNull(),
  period: text("period").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  period: text("period").notNull(),
  description: text("description").notNull(),
  credentialUrl: text("credential_url"),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const adminConfig = pgTable("admin_config", {
  id: text("id").primaryKey().default("admin_auth"),
  passwordHash: text("password_hash").notNull(),
  sessionSecret: text("session_secret").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ProfileSettings = typeof profileSettings.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type TimelineEntry = typeof timelineEntries.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type AdminConfig = typeof adminConfig.$inferSelect;
