"use client";

import { Calendar, Compass, GraduationCap, Server, Wrench, Code2, Sparkles } from "lucide-react";
import type { TimelineEntry } from "@/db/schema";

interface TimelineProps {
  entries: TimelineEntry[];
}

export default function Timeline({ entries }: TimelineProps) {
  const getCategoryIcon = (category: string) => {
    if (category.includes("Education") || category.includes("College")) return GraduationCap;
    if (category.includes("Lab") || category.includes("Admin")) return Server;
    if (category.includes("Technical") || category.includes("Systems")) return Wrench;
    if (category.includes("Web")) return Code2;
    return Sparkles;
  };

  return (
    <section id="timeline" className="cinematic-section cinematic-section--timeline relative py-24 bg-[#0A0D12]/[0.74] border-t border-b border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1685FF]/10 border border-[#1685FF]/30 text-xs font-mono text-[#55B5FF] mb-3">
              <Calendar className="w-3.5 h-3.5 text-[#1685FF]" />
              <span>04 // EXPERIENCE &amp; MILESTONES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FA]">
              Learning by
              <br />
              <span className="text-[#1685FF]">building.</span>
            </h2>
          </div>

          <p className="text-sm text-[#929CAA] max-w-md">
            A progression of real-world responsibilities, self-directed technical troubleshooting, and creative development projects.
          </p>
        </div>

        {/* Timeline List */}
        <div className="relative border-l border-white/[0.12] ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
          {entries.map((entry, index) => {
            const Icon = getCategoryIcon(entry.category);
            return (
              <div key={entry.id} className="relative group">
                {/* Node Dot */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-[#10151D] border-2 border-[#1685FF] group-hover:scale-125 group-hover:bg-[#1685FF] group-hover:shadow-[0_0_12px_rgba(22,133,255,0.7)] transition-all duration-200" />

                <div className="p-6 rounded-2xl bg-[#10151D] border border-white/[0.08] hover:border-[#1685FF]/40 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-[#1685FF]/15 text-[#55B5FF]">
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-xs font-mono uppercase tracking-wider text-[#929CAA]">
                        {entry.category}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-[#55B5FF] px-2.5 py-0.5 rounded bg-[#1685FF]/10 border border-[#1685FF]/20">
                      {entry.period}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#F5F7FA] group-hover:text-white transition-colors">
                    {entry.title}
                  </h3>

                  {entry.organization && (
                    <div className="text-xs font-mono text-[#929CAA] mt-1 mb-3">
                      {entry.organization}
                    </div>
                  )}

                  <p className="text-sm text-[#929CAA] leading-relaxed">
                    {entry.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
