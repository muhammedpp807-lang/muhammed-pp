"use client";

import { X, ExternalLink, GitBranch, Terminal, CheckCircle2, ShieldAlert } from "lucide-react";
import type { Project } from "@/db/schema";
import { useEffect } from "react";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#0A0D12] border border-white/[0.12] rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1685FF] bg-[#1685FF]/10 px-2.5 py-1 rounded">
              {project.category}
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">
              {project.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#10151D] border border-white/10 text-[#929CAA] hover:text-white hover:border-white/20 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto space-y-6 pr-1">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
              {project.title}
            </h3>
            <p className="text-sm font-mono text-[#55B5FF] mt-1">{project.subtitle}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#10151D] border border-white/[0.07]">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#929CAA] mb-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#1685FF]" />
              PROJECT OVERVIEW
            </h4>
            <p className="text-sm text-[#F5F7FA]/90 leading-relaxed">{project.description}</p>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#929CAA] mb-2">
              TECHNICAL CASE STUDY &amp; LEARNING NOTES
            </h4>
            <div className="text-sm text-[#929CAA] leading-relaxed space-y-3 bg-[#050608] p-5 rounded-xl border border-white/[0.06]">
              <p>{project.caseStudy}</p>
            </div>
          </div>

          {/* Privacy Note for IT Administration */}
          {project.slug === "digihub-it-administration" && (
            <div className="p-3.5 rounded-lg bg-[#10151D] border border-amber-500/30 flex items-start gap-2.5 text-xs text-[#929CAA]">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy &amp; Security Compliance:</strong> Institutional IP addresses, local subnets, credentials, and internal student workstation records are strictly kept private.
              </span>
            </div>
          )}

          {/* Tech Stack Tags */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#929CAA] mb-2.5">
              VERIFIED TECHNOLOGIES USED
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-md bg-[#10151D] border border-white/[0.08] text-xs font-mono text-[#55B5FF]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Links */}
        <div className="pt-5 mt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1685FF] hover:bg-[#55B5FF] text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(22,133,255,0.3)]"
              >
                <span>Visit Live Destination</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#10151D] hover:bg-[#161F2C] border border-white/10 text-[#F5F7FA] text-xs font-semibold transition-all"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Source Repository</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#10151D] text-[#929CAA] hover:text-white text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
