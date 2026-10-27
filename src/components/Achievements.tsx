"use client";

import { Award, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import type { Achievement } from "@/db/schema";

interface AchievementsProps {
  achievements: Achievement[];
}

export default function Achievements({ achievements }: AchievementsProps) {
  const publishedAchievements = achievements.filter((a) => a.published);

  return (
    <section id="achievements" className="cinematic-section cinematic-section--achievements relative py-24 bg-[#050608]/[0.78]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1685FF]/10 border border-[#1685FF]/30 text-xs font-mono text-[#55B5FF] mb-3">
              <Award className="w-3.5 h-3.5 text-[#1685FF]" />
              <span>05 // CREDENTIALS &amp; MILESTONES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FA]">
              Achievements &amp;
              <br />
              <span className="text-[#1685FF]">Certificates</span>
            </h2>
          </div>

          <p className="text-sm text-[#929CAA] max-w-md">
            Documenting verified accomplishments, institutional activities, and completed milestones without artificial inflation.
          </p>
        </div>

        {/* Content or Tasteful Empty State */}
        {publishedAchievements.length === 0 ? (
          <div className="rounded-2xl bg-[#0A0D12] border border-white/[0.08] p-8 sm:p-12 text-center max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#10151D] border border-white/10 flex items-center justify-center text-[#1685FF] mb-4 shadow-[0_0_20px_rgba(22,133,255,0.2)]">
              <Sparkles className="w-7 h-7" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#F5F7FA] mb-2">
              Every project is another step forward.
            </h3>

            <p className="text-sm text-[#929CAA] leading-relaxed max-w-md">
              Genuine milestones, recognized college activities, and verified technical certificates will be documented here as they are completed.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10151D] border border-white/[0.08] text-xs font-mono text-[#55B5FF]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Authentic Credential Policy Active</span>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedAchievements.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-[#10151D] border border-white/[0.09] hover:border-[#1685FF]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#929CAA] mb-3">
                    <span>{item.issuer}</span>
                    <span className="text-[#55B5FF]">{item.period}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#F5F7FA] mb-2">{item.title}</h3>

                  <p className="text-xs text-[#929CAA] leading-relaxed">{item.description}</p>
                </div>

                {item.credentialUrl && (
                  <div className="pt-4 mt-4 border-t border-white/[0.06]">
                    <a
                      href={item.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1685FF] hover:text-[#55B5FF] transition-colors"
                    >
                      <span>Verify Certificate</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
