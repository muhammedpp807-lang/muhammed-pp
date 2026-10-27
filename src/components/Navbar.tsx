"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, Shield } from "lucide-react";

interface NavbarProps {
  isAdmin?: boolean;
}

const NAV_LINKS = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Featured", href: "#featured" },
  { name: "Timeline", href: "#timeline" },
  { name: "Milestones", href: "#achievements" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar({ isAdmin = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ["hero", "about", "skills", "projects", "featured", "timeline", "achievements", "contact"];
      const scrollPosition = window.scrollY + 180;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id.replace("#", ""));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050608]/85 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-xl shadow-black/40"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Monogram */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("hero");
            }}
            className="group flex items-center gap-3 focus:outline-none"
            aria-label="Muhammed PP Home"
          >
            <div className="w-9 h-9 rounded-md bg-[#10151D] border border-white/15 flex items-center justify-center font-mono font-bold text-sm tracking-wider text-white group-hover:border-[#1685FF] group-hover:shadow-[0_0_12px_rgba(22,133,255,0.4)] transition-all">
              <span className="text-[#1685FF]">M</span>PP
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-[#F5F7FA] group-hover:text-white">
                MUHAMMED PP
              </span>
              <span className="text-[10px] text-[#929CAA] tracking-widest uppercase font-mono">
                Technician &bull; Admin
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#10151D]/60 border border-white/[0.08] px-3 py-1.5 rounded-full backdrop-blur-sm">
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={link.name}
                  onClick={() => scrollTo(link.href)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "text-white bg-[#1685FF]/20 border border-[#1685FF]/40 shadow-[0_0_10px_rgba(22,133,255,0.25)]"
                      : "text-[#929CAA] hover:text-[#F5F7FA] hover:bg-white/[0.04]"
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scrollTo("#contact")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-md bg-[#1685FF] hover:bg-[#55B5FF] text-white transition-all shadow-[0_0_15px_rgba(22,133,255,0.3)] cursor-pointer"
            >
              Let&apos;s Connect
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Unobtrusive Admin Portal Link */}
            <Link
              href="/admin"
              className="p-2 rounded-md border border-white/[0.07] bg-[#10151D]/50 text-[#929CAA] hover:text-white hover:border-white/20 transition-all text-xs"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-[#929CAA] hover:text-[#1685FF]" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/admin"
              className="p-2 rounded-md border border-white/[0.07] bg-[#10151D] text-[#929CAA]"
              aria-label="Admin Portal"
            >
              <Shield className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md bg-[#10151D] border border-white/10 text-[#F5F7FA] hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#55B5FF]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 px-4 pt-3 pb-6 bg-[#0A0D12]/98 border-b border-white/10 backdrop-blur-xl animate-in slide-in-from-top-4 duration-200 shadow-2xl">
          <nav className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={link.name}
                  onClick={() => scrollTo(link.href)}
                  className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#1685FF]/20 text-white border border-[#1685FF]/30 font-semibold"
                      : "text-[#929CAA] hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => scrollTo("#contact")}
                className="w-full text-center py-2.5 rounded-lg bg-[#1685FF] text-white text-sm font-semibold flex items-center justify-center gap-2"
              >
                Let&apos;s Connect <ArrowUpRight className="w-4 h-4" />
              </button>
              <Link
                href="/admin"
                className="w-full text-center py-2 text-xs text-[#929CAA] hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Area &rarr;
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
