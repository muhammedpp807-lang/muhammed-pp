"use client";

import { useState } from "react";
import { ExternalLink, Layers, ArrowUpRight, Code, Server, Gamepad2, GraduationCap } from "lucide-react";
import type { Project } from "@/db/schema";

interface ProjectGalleryProps {
  projects: Project[];
  onOpenCaseStudy: (project: Project) => void;
}

const CATEGORY_TABS = [
  { id: "all", label: "All Projects" },
  { id: "Web Platform", label: "Web Platforms" },
  { id: "IT & Systems", label: "IT & Systems" },
  { id: "Educational Web App", label: "Educational" },
  { id: "Interactive Simulation", label: "Simulations" },
];

export default function ProjectGallery({ projects, onOpenCaseStudy }: ProjectGalleryProps) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProjects =
    activeTab === "all"
      ? projects
      : projects.filter((p) => p.category.toLowerCase().includes(activeTab.toLowerCase()));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Live":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "Practical Project":
        return "bg-[#1685FF]/15 text-[#55B5FF] border-[#1685FF]/30";
      case "Prototype":
        return "bg-purple-500/15 text-purple-300 border-purple-500/30";
      case "Experimental":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      default:
        return "bg-white/10 text-white border-white/20";
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes("IT") || category.includes("System")) return Server;
    if (category.includes("Simulation") || category.includes("Game")) return Gamepad2;
    if (category.includes("Educational")) return GraduationCap;
    return Code;
  };

  return (
    <section id="projects" className="cinematic-section cinematic-section--projects relative py-24 bg-[#050608]/[0.78]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1685FF]/10 border border-[#1685FF]/30 text-xs font-mono text-[#55B5FF] mb-3">
              <Layers className="w-3.5 h-3.5 text-[#1685FF]" />
              <span>03 // PROJECT SHOWCASE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FA]">
              Featured Projects &amp;
              <br />
              <span className="text-[#1685FF]">Practical Builds</span>
            </h2>
          </div>

          <p className="text-sm text-[#929CAA] max-w-md">
            Genuine work encompassing web development, IT lab operations, interactive educational tools, and browser simulations.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-white/[0.08] pb-4">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#1685FF] text-white shadow-[0_0_15px_rgba(22,133,255,0.35)]"
                  : "bg-[#10151D] text-[#929CAA] hover:text-[#F5F7FA] border border-white/[0.07] hover:border-white/15"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const CatIcon = getCategoryIcon(project.category);
            return (
              <div
                key={project.id}
                className="group relative rounded-2xl bg-[#10151D] border border-white/[0.09] hover:border-[#1685FF]/50 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(22,133,255,0.12)]"
              >
                <div>
                  {/* Top Meta */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-[#1685FF]/10 text-[#55B5FF]">
                        <CatIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono uppercase tracking-wider text-[#929CAA]">
                        {project.category}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded border ${getStatusBadge(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl sm:text-2xl font-bold text-[#F5F7FA] group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs font-mono text-[#55B5FF] mt-1 mb-3">
                    {project.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-[#929CAA] leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#0A0D12] border border-white/[0.06] text-[11px] font-mono text-[#929CAA]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                  <button
                    onClick={() => onOpenCaseStudy(project)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1685FF] hover:text-[#55B5FF] transition-colors cursor-pointer"
                  >
                    <span>Inspect Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1685FF]/10 hover:bg-[#1685FF]/20 text-[#55B5FF] text-xs font-mono border border-[#1685FF]/30 transition-all"
                    >
                      <span>Live Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] font-mono text-[#929CAA]/70">
                      Internal Lab / In Development
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
