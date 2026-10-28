"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import FeaturedProject from "./FeaturedProject";
import ProjectGallery from "./ProjectGallery";
import ProjectModal from "./ProjectModal";
import Timeline from "./Timeline";
import Achievements from "./Achievements";
import Contact from "./Contact";
import Footer from "./Footer";
import ParallaxBackground from "./ParallaxBackground";
import type { ProfileSettings, Project, TimelineEntry, Achievement } from "@/db/schema";

interface PortfolioClientProps {
  profile: ProfileSettings;
  projects: Project[];
  timeline: TimelineEntry[];
  achievements: Achievement[];
}

export default function PortfolioClient({
  profile,
  projects,
  timeline,
  achievements,
}: PortfolioClientProps) {
  const [activeCaseStudy, setActiveCaseStudy] = useState<Project | null>(null);

  // Determine featured project (either flagged featured or fallback to project with id=2 or first project)
  const featured =
    projects.find((p) => p.featured) ||
    projects.find((p) => p.id === (profile.featuredProjectId || 2)) ||
    projects[0];

  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[#050608] text-[#F5F7FA]">
      <ParallaxBackground />
      <Navbar />

      <main className="relative z-10">
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills />
        {featured && (
          <FeaturedProject project={featured} onOpenCaseStudy={(p) => setActiveCaseStudy(p)} />
        )}
        <ProjectGallery
          projects={projects}
          onOpenCaseStudy={(p) => setActiveCaseStudy(p)}
        />
        <Timeline entries={timeline} />
        <Achievements achievements={achievements} />
        <Contact profile={profile} />
      </main>

      <div className="relative z-10">
        <Footer githubUrl={profile.githubUrl} />
      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={activeCaseStudy}
        onClose={() => setActiveCaseStudy(null)}
      />
    </div>
  );
}
