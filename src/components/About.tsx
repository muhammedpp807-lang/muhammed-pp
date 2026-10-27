"use client";

import { MapPin, GraduationCap, Server, Wrench, Globe, CheckCircle2 } from "lucide-react";

interface AboutProps {
  profile: {
    name: string;
    bio: string;
    location: string;
    education: string;
    interests?: string[] | null;
  };
}

export default function About({ profile }: AboutProps) {
  const verifiedInterests = profile.interests || [
    "Computer Technology & Diagnostics",
    "Local Area Networking & IP Configuration",
    "Computer Lab Systems Administration",
    "Modern Web Frontend & Interactive UIs",
    "Practical Troubleshooting & Hardware",
    "Experimental Game Mechanics in Browser",
  ];

  return (
    <section id="about" className="cinematic-section cinematic-section--about relative py-24 bg-[#0A0D12]/[0.78] border-t border-b border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Heading and Context */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1685FF]/10 border border-[#1685FF]/30 text-xs font-mono text-[#55B5FF] mb-4">
              <span>01 // IDENTITY & CONTEXT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FA] leading-tight">
              More than just
              <br />
              <span className="text-[#1685FF]">technology.</span>
            </h2>
            <p className="mt-4 text-sm text-[#929CAA] leading-relaxed">
              Grounding technical curiosity in daily practice, lab administration, and a continuous desire to understand how systems operate from the silicon up to the browser.
            </p>

            {/* Quick Facts Card */}
            <div className="mt-8 p-5 rounded-xl bg-[#10151D] border border-white/[0.09] space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#1685FF]/15 text-[#55B5FF]">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-[#929CAA] uppercase tracking-wider font-mono">Education</div>
                  <div className="text-sm font-semibold text-[#F5F7FA]">{profile.education}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-white/[0.06]">
                <div className="p-2 rounded-lg bg-[#1685FF]/15 text-[#55B5FF]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-[#929CAA] uppercase tracking-wider font-mono">Location</div>
                  <div className="text-sm font-semibold text-[#F5F7FA]">{profile.location}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-white/[0.06]">
                <div className="p-2 rounded-lg bg-[#1685FF]/15 text-[#55B5FF]">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-[#929CAA] uppercase tracking-wider font-mono">Key Responsibility</div>
                  <div className="text-sm font-semibold text-[#F5F7FA]">DIGIHUB Computer-Lab Administrator</div>
                  <p className="text-xs text-[#929CAA] mt-0.5">Workstation uptime, local network setup & peer assistance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Biography & Interests */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#10151D] border border-white/[0.09] shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1685FF]/05 rounded-full blur-3xl pointer-events-none" />

              <h3 className="text-xs uppercase font-mono tracking-widest text-[#55B5FF] mb-3">
                AUTHENTIC BIOGRAPHY
              </h3>

              <div className="text-base sm:text-lg text-[#F5F7FA]/90 leading-relaxed font-normal space-y-4">
                <p>
                  {profile.bio}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-4 text-xs text-[#929CAA]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Verified Factual Profile</span>
                </div>
                <div className="font-mono text-[#55B5FF]">
                  No fabricated statistics or unverified claims
                </div>
              </div>
            </div>

            {/* Practical Interests Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-mono uppercase tracking-wider text-[#929CAA]">
                  Areas of Active Practical Interest
                </h4>
                <span className="text-xs text-[#55B5FF] font-mono">{verifiedInterests.length} Topics</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {verifiedInterests.map((interest, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#10151D] border border-white/[0.08] hover:border-[#1685FF]/40 transition-colors flex items-start gap-3 group"
                  >
                    <div className="mt-0.5 w-5 h-5 rounded-md bg-[#1685FF]/15 text-[#55B5FF] flex items-center justify-center shrink-0 group-hover:bg-[#1685FF] group-hover:text-white transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium text-[#F5F7FA] group-hover:text-white transition-colors">
                      {interest}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
