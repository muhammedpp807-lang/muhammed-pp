"use client";

import { ArrowUpRight, Terminal, Layers, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { Project } from "@/db/schema";

interface FeaturedProjectProps {
  project: Project;
  onOpenCaseStudy: (project: Project) => void;
}

export default function FeaturedProject({ project, onOpenCaseStudy }: FeaturedProjectProps) {
  if (!project) return null;

  return (
    <section id="featured" className="cinematic-section cinematic-section--featured relative py-24 bg-[#0A0D12]/[0.82] border-t border-b border-white/[0.08] overflow-hidden">
      {/* Decorative subtle lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#1685FF]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1685FF]/10 border border-[#1685FF]/30 text-xs font-mono text-[#55B5FF] w-fit mb-6">
          <Layers className="w-3.5 h-3.5 text-[#1685FF]" />
          <span>FEATURED PROJECT SPOTLIGHT</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Editorial Information */}
          <div className="lg:col-span-6 flex flex-col space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#929CAA]">
                {project.category}
              </span>
              <span className="text-[#929CAA]">&bull;</span>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {project.status}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F7FA] tracking-tight leading-[1.08]">
              {project.title}
            </h2>

            <p className="text-sm font-mono text-[#55B5FF] tracking-wide">
              {project.subtitle}
            </p>

            <p className="text-base text-[#929CAA] leading-relaxed">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-md bg-[#10151D] border border-white/[0.08] text-xs font-mono text-[#F5F7FA]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-4">
              <button
                onClick={() => onOpenCaseStudy(project)}
                className="px-6 py-3 rounded-lg bg-[#1685FF] hover:bg-[#55B5FF] text-white font-medium text-sm transition-all duration-200 shadow-[0_0_20px_rgba(22,133,255,0.3)] flex items-center gap-2 cursor-pointer"
              >
                View Full Case Study
                <ArrowUpRight className="w-4 h-4" />
              </button>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-lg bg-[#10151D] hover:bg-[#161F2C] border border-white/[0.09] text-[#F5F7FA] font-medium text-sm transition-all duration-200 flex items-center gap-1.5"
                >
                  Visit Verified Link
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Visual Technical Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl bg-[#10151D] border border-white/[0.12] p-5 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#1685FF]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Terminal-like Window Header */}
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  <span className="ml-2 text-xs font-mono text-[#929CAA]">
                    sys://projects/{project.slug}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#55B5FF] uppercase">
                  ACTIVE SPEC
                </span>
              </div>

              {/* Graphical Blueprint Preview */}
              <div className="aspect-[16/10] rounded-xl bg-[#050608] border border-white/[0.06] p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#1685FF] mb-2">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>SYSTEM ARCHITECTURE PREVIEW</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-1">{project.title}</h4>
                  <p className="text-xs text-[#929CAA] max-w-sm line-clamp-3">
                    {project.caseStudy.slice(0, 160)}...
                  </p>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.08]">
                  <div className="p-2 rounded bg-[#10151D]/80 border border-white/[0.05]">
                    <div className="text-[10px] uppercase font-mono text-[#929CAA]">Role</div>
                    <div className="text-xs font-semibold text-white">IT Lab Administrator</div>
                  </div>
                  <div className="p-2 rounded bg-[#10151D]/80 border border-white/[0.05]">
                    <div className="text-[10px] uppercase font-mono text-[#929CAA]">Privacy Status</div>
                    <div className="text-xs font-semibold text-emerald-400">Sanitized &amp; Compliant</div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Highlights */}
              <div className="mt-4 pt-3 border-t border-white/[0.07] flex items-center justify-between text-xs text-[#929CAA]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1685FF]" />
                  <span>Practical Computer-Lab Operations</span>
                </span>
                <button
                  onClick={() => onOpenCaseStudy(project)}
                  className="text-[#55B5FF] hover:underline cursor-pointer"
                >
                  Read breakdown &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
