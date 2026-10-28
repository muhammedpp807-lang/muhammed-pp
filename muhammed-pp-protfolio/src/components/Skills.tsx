"use client";

import { useState } from "react";
import { Cpu, Network, Code2, Sparkles, Terminal, Info } from "lucide-react";

interface SkillItem {
  name: string;
  category: "computer-tech" | "networking-it" | "web-dev" | "creative-digital";
  levelType: "Demonstrated Practical Experience" | "Active Practical Learning";
  description: string;
}

const SKILLS_DATA: SkillItem[] = [
  // Computer Technology
  {
    name: "Computer Troubleshooting",
    category: "computer-tech",
    levelType: "Demonstrated Practical Experience",
    description:
      "Isolating hardware faults, peripheral connectivity failures, system crash diagnosis, and RAM/storage diagnostics in lab setups.",
  },
  {
    name: "Windows Computer Environments",
    category: "computer-tech",
    levelType: "Demonstrated Practical Experience",
    description:
      "Managing Windows 10/11 operating systems, driver configurations, system restore, service management, and software installations.",
  },
  {
    name: "Basic Computer Maintenance",
    category: "computer-tech",
    levelType: "Demonstrated Practical Experience",
    description:
      "Preventive upkeep of desktop units, component cleaning, thermal management checks, and storage integrity assessments.",
  },

  // Networking and IT
  {
    name: "LAN Concepts",
    category: "networking-it",
    levelType: "Demonstrated Practical Experience",
    description:
      "Wiring, switch cabling, local area network topologies, and diagnosing link connectivity in multi-workstation labs.",
  },
  {
    name: "IP Addressing",
    category: "networking-it",
    levelType: "Demonstrated Practical Experience",
    description:
      "Configuring IPv4 static address assignments, subnet masks, default gateways, and verifying subnet isolation.",
  },
  {
    name: "DNS & DHCP Concepts",
    category: "networking-it",
    levelType: "Active Practical Learning",
    description:
      "Understanding automated address leases, scope allocation, local DNS lookup caching, and router-assisted name resolution.",
  },
  {
    name: "Computer-Lab Administration",
    category: "networking-it",
    levelType: "Demonstrated Practical Experience",
    description:
      "Managing workstation accessibility, student access policies, peripheral setup, and overall DIGIHUB lab availability.",
  },
  {
    name: "Domain-Computer Environments",
    category: "networking-it",
    levelType: "Active Practical Learning",
    description:
      "Exploring workgroups, active directory domain join concepts, shared network storage, and centralized permission policies.",
  },

  // Web Development
  {
    name: "HTML5",
    category: "web-dev",
    levelType: "Demonstrated Practical Experience",
    description:
      "Semantic document structure, accessible landmark tags, form elements, and web standard compliance.",
  },
  {
    name: "CSS3 & Modern Layouts",
    category: "web-dev",
    levelType: "Demonstrated Practical Experience",
    description:
      "Flexbox, CSS Grid, media queries for responsive layouts, clamp() typography, and dark-mode styling systems.",
  },
  {
    name: "JavaScript",
    category: "web-dev",
    levelType: "Demonstrated Practical Experience",
    description:
      "DOM manipulation, event-driven interactions, asynchronous fetch requests, and state management in web apps.",
  },
  {
    name: "Interactive Website Development",
    category: "web-dev",
    levelType: "Demonstrated Practical Experience",
    description:
      "Building responsive personal portals, quiz tools, and fullstack applications with modern frameworks like Next.js.",
  },

  // Creative Digital Projects
  {
    name: "UI Design Experimentation",
    category: "creative-digital",
    levelType: "Demonstrated Practical Experience",
    description:
      "Designing typography-driven dark aesthetics, high-contrast visual hierarchies, and responsive micro-interactions.",
  },
  {
    name: "AI-Assisted Development Workflows",
    category: "creative-digital",
    levelType: "Active Practical Learning",
    description:
      "Leveraging AI programming agents, code assistants, and automated testing to accelerate fullstack engineering.",
  },
  {
    name: "Browser Game Concepts",
    category: "creative-digital",
    levelType: "Active Practical Learning",
    description:
      "Exploratory 3D canvas rendering, ball physics simulation, virtual keyboard inputs, and frame rate management.",
  },
  {
    name: "Digital Learning Tools",
    category: "creative-digital",
    levelType: "Demonstrated Practical Experience",
    description:
      "Developing typed interactive study tools (such as the Palabra Spanish vocabulary trainer) with instant scoring.",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Skills", icon: Terminal },
  { id: "computer-tech", label: "Computer Technology", icon: Cpu },
  { id: "networking-it", label: "Networking & IT", icon: Network },
  { id: "web-dev", label: "Web Development", icon: Code2 },
  { id: "creative-digital", label: "Creative Digital", icon: Sparkles },
];

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(null);

  const filteredSkills =
    selectedCategory === "all"
      ? SKILLS_DATA
      : SKILLS_DATA.filter((s) => s.category === selectedCategory);

  return (
    <section id="skills" className="cinematic-section cinematic-section--skills relative py-24 bg-[#050608]/[0.78]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1685FF]/10 border border-[#1685FF]/30 text-xs font-mono text-[#55B5FF] mb-3">
              <span>02 // SKILLS & CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FA]">
              Technical Skills &amp;
              <br />
              <span className="text-[#1685FF]">Practical Activities</span>
            </h2>
          </div>

          <p className="text-sm text-[#929CAA] max-w-md">
            Distinguishing hands-on lab experience from topics actively being learned. No invented percentages or inflated metrics.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/[0.08] pb-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#1685FF] text-white shadow-[0_0_15px_rgba(22,133,255,0.35)]"
                    : "bg-[#10151D] text-[#929CAA] hover:text-[#F5F7FA] border border-white/[0.07] hover:border-white/15"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill, index) => {
            const isPractical = skill.levelType === "Demonstrated Practical Experience";
            return (
              <div
                key={index}
                onClick={() => setActiveSkill(activeSkill?.name === skill.name ? null : skill)}
                className="group p-5 rounded-xl bg-[#10151D] border border-white/[0.08] hover:border-[#1685FF]/40 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                        isPractical
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-[#1685FF]/15 text-[#55B5FF] border border-[#1685FF]/30"
                      }`}
                    >
                      {isPractical ? "Practical Experience" : "Active Learning"}
                    </span>
                    <Info className="w-3.5 h-3.5 text-[#929CAA] group-hover:text-[#55B5FF] transition-colors" />
                  </div>

                  <h3 className="text-base font-semibold text-[#F5F7FA] group-hover:text-white transition-colors">
                    {skill.name}
                  </h3>
                </div>

                <p className="mt-3 text-xs text-[#929CAA] leading-relaxed line-clamp-3 group-hover:text-[#F5F7FA]/80 transition-colors">
                  {skill.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs text-[#929CAA]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Demonstrated Practical Experience (Lab &amp; Live Projects)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1685FF]" />
              <span>Active Practical Learning (Study &amp; Exploration)</span>
            </div>
          </div>
          <div className="font-mono text-[11px] text-[#55B5FF]">
            Values strictly verified without artificial ratings
          </div>
        </div>
      </div>
    </section>
  );
}
