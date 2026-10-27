"use client";

import Link from "next/link";
import { ArrowUp, GitBranch, Shield, Heart } from "lucide-react";

interface FooterProps {
  githubUrl?: string | null;
}

export default function Footer({ githubUrl = "https://github.com/muhammedpp807-lang" }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050608]/[0.88] backdrop-blur-sm border-t border-white/[0.08] pt-16 pb-12 text-[#929CAA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/[0.06]">
          {/* Brand & Tagline */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-[#10151D] border border-white/15 flex items-center justify-center font-mono font-bold text-xs text-white">
                <span className="text-[#1685FF]">M</span>PP
              </div>
              <span className="font-bold text-base text-[#F5F7FA] tracking-tight">
                MUHAMMED PP
              </span>
            </div>
            <p className="text-xs font-mono text-[#55B5FF] tracking-wider">
              Learning. Building. Improving.
            </p>
            <p className="text-xs text-[#929CAA] max-w-sm">
              Student &bull; Computer Technician &bull; DIGIHUB Administrator. Based in Kolantha, Kerala, India.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#skills" className="hover:text-white transition-colors">
              Skills
            </a>
            <a href="#projects" className="hover:text-white transition-colors">
              Projects
            </a>
            <a href="#timeline" className="hover:text-white transition-colors">
              Timeline
            </a>
            <a href="#achievements" className="hover:text-white transition-colors">
              Milestones
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#55B5FF] hover:underline"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="p-3 rounded-lg bg-[#10151D] border border-white/10 text-[#929CAA] hover:text-white hover:border-[#1685FF] transition-all cursor-pointer flex items-center gap-2 text-xs font-mono group"
            aria-label="Back to top"
          >
            <span>TOP</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#929CAA]/80">
          <div>
            &copy; {currentYear} Muhammed PP. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Darul Hasanath Islamic College</span>
            <span>&bull;</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-[#929CAA] hover:text-[#55B5FF] transition-colors"
            >
              <Shield className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
