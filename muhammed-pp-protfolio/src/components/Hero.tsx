"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Terminal, Cpu, Network, ShieldCheck, Sparkles } from "lucide-react";

interface HeroProps {
  profile: {
    name: string;
    headline: string;
    supportingCopy: string;
    location: string;
    education: string;
    portraitUrl?: string | null;
  };
}

export default function Hero({ profile }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const portraitMotionRef = useRef<HTMLDivElement>(null);
  const heroGlowRef = useRef<HTMLDivElement>(null);
  const heroSignalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let reducedMotion = mediaQuery.matches;

    const reset = () => {
      if (portraitMotionRef.current) {
        portraitMotionRef.current.style.transform = "translate3d(0, 0, 0) scale(1)";
        portraitMotionRef.current.style.opacity = "1";
      }
      if (heroGlowRef.current) heroGlowRef.current.style.transform = "translate3d(0, 0, 0)";
      if (heroSignalRef.current) heroSignalRef.current.style.transform = "translate3d(0, 0, 0)";
    };

    const update = () => {
      frame = 0;
      const hero = heroRef.current;
      if (!hero) return;

      if (reducedMotion) {
        reset();
        return;
      }

      const heroHeight = Math.max(hero.offsetHeight, 1);
      const localProgress = Math.min(Math.max(window.scrollY / (heroHeight * 0.92), 0), 1);
      const motionScale = window.innerWidth < 640 ? 0.42 : window.innerWidth < 1024 ? 0.7 : 1;

      // Counter-scroll keeps the portrait visually slower than the foreground page.
      if (portraitMotionRef.current) {
        portraitMotionRef.current.style.transform = `translate3d(0, ${Math.round(localProgress * 56 * motionScale)}px, 0) scale(${(1 - localProgress * 0.035 * motionScale).toFixed(3)})`;
        portraitMotionRef.current.style.opacity = (1 - localProgress * 0.16 * motionScale).toFixed(3);
      }

      if (heroGlowRef.current) {
        heroGlowRef.current.style.transform = `translate3d(${Math.round(localProgress * 28 * motionScale)}px, ${Math.round(-localProgress * 68 * motionScale)}px, 0) scale(${(1 + localProgress * 0.07 * motionScale).toFixed(3)})`;
      }

      if (heroSignalRef.current) {
        heroSignalRef.current.style.transform = `translate3d(${Math.round(-localProgress * 34 * motionScale)}px, ${Math.round(localProgress * 22 * motionScale)}px, 0)`;
      }
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      requestUpdate();
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    mediaQuery.addEventListener("change", onMotionChange);
    requestUpdate();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      mediaQuery.removeEventListener("change", onMotionChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id.replace("#", ""));
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const hasCustomPortrait = Boolean(profile.portraitUrl && profile.portraitUrl.trim().length > 0);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="cinematic-section cinematic-section--hero relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden"
    >
      {/* Hero-specific accents add close-range depth over the global moving atmosphere. */}
      <div className="absolute inset-0 tech-grid pointer-events-none opacity-30" />
      <div
        ref={heroGlowRef}
        className="absolute top-1/4 -left-48 w-96 h-96 bg-[#1685FF]/12 rounded-full blur-[120px] pointer-events-none will-change-transform"
      />
      <div className="absolute bottom-10 right-0 w-[420px] h-[420px] bg-[#1685FF]/08 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle restrained horizon signal */}
      <div
        ref={heroSignalRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[#1685FF]/40 to-transparent animate-blue-pulse will-change-transform"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & Story */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10151D] border border-white/[0.09] text-xs text-[#929CAA]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Kolantha, Kerala, India</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1685FF]/10 border border-[#1685FF]/25 text-xs text-[#55B5FF]">
                <Terminal className="w-3 h-3 text-[#1685FF]" />
                <span>DIGIHUB Administrator &bull; Technician</span>
              </div>
            </div>

            {/* Oversized Name Typography */}
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#929CAA] font-mono mb-2">
                PERSONAL PORTFOLIO
              </p>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F7FA] leading-[1.03]">
                MUHAMMED <span className="text-[#1685FF]">PP</span>
              </h1>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F5F7FA]/90 leading-tight">
              Curious by nature.
              <br />
              <span className="text-[#55B5FF]">Built through technology.</span>
            </h2>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#929CAA] max-w-xl leading-relaxed">
              {profile.supportingCopy}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => scrollTo("projects")}
                className="px-6 py-3 rounded-lg bg-[#1685FF] hover:bg-[#55B5FF] text-white font-medium text-sm transition-all duration-200 shadow-[0_0_20px_rgba(22,133,255,0.35)] flex items-center gap-2 cursor-pointer hover:shadow-[0_0_25px_rgba(85,181,255,0.5)]"
              >
                Explore My Work
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollTo("about")}
                className="px-5 py-3 rounded-lg bg-[#10151D] hover:bg-[#161F2C] border border-white/[0.09] hover:border-white/20 text-[#F5F7FA] font-medium text-sm transition-all duration-200 cursor-pointer"
              >
                About Me
              </button>

              <button
                onClick={() => scrollTo("contact")}
                className="px-5 py-3 rounded-lg bg-transparent hover:bg-white/[0.04] text-[#929CAA] hover:text-[#F5F7FA] font-medium text-sm transition-all duration-200 cursor-pointer"
              >
                Contact
              </button>
            </div>

            {/* Minimal Factual Highlights Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/[0.07]">
              <div className="p-3 rounded-lg bg-[#0A0D12]/80 border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-xs text-[#929CAA] mb-1">
                  <Cpu className="w-3.5 h-3.5 text-[#1685FF]" />
                  <span>Systems</span>
                </div>
                <div className="text-sm font-semibold text-[#F5F7FA]">Hardware & OS</div>
                <div className="text-[11px] text-[#929CAA]">Lab troubleshooting</div>
              </div>

              <div className="p-3 rounded-lg bg-[#0A0D12]/80 border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-xs text-[#929CAA] mb-1">
                  <Network className="w-3.5 h-3.5 text-[#1685FF]" />
                  <span>Networks</span>
                </div>
                <div className="text-sm font-semibold text-[#F5F7FA]">LAN & DHCP</div>
                <div className="text-[11px] text-[#929CAA]">Domain environments</div>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3 rounded-lg bg-[#0A0D12]/80 border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-xs text-[#929CAA] mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1685FF]" />
                  <span>Campus Role</span>
                </div>
                <div className="text-sm font-semibold text-[#F5F7FA]">DIGIHUB Admin</div>
                <div className="text-[11px] text-[#929CAA]">Darul Hasanath</div>
              </div>
            </div>
          </div>

          {/* Right Column: Art-Directed Portrait Experience */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              ref={portraitMotionRef}
              className="relative w-full max-w-[380px] sm:max-w-[420px] will-change-transform"
            >
              {/* Outer Decorative Technical Frame */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-[#1685FF]/30 via-transparent to-[#1685FF]/15 blur-sm opacity-70" />

              <div className="relative rounded-2xl bg-[#0A0D12] border border-white/[0.12] p-3 shadow-2xl overflow-hidden">
                {/* Frame Corner Accents */}
                <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-[#1685FF]" />
                <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-[#1685FF]" />
                <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-[#1685FF]" />
                <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-[#1685FF]" />

                {/* Portrait Display or Polished Placeholder */}
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#10151D] border border-white/[0.08] flex flex-col items-center justify-center p-6 text-center">
                  {hasCustomPortrait ? (
                    <img
                      src={profile.portraitUrl!}
                      alt="Muhammed PP portrait"
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-between py-6 px-2">
                      {/* Top Frame Tech Header */}
                      <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#929CAA] border-b border-white/[0.06] pb-2">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1685FF]" />
                          PORTRAIT FRAME
                        </span>
                        <span>MPP-ID // 001</span>
                      </div>

                      {/* Center Graphic */}
                      <div className="flex flex-col items-center my-auto">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-b from-[#1685FF]/20 to-[#10151D] border border-[#1685FF]/40 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(22,133,255,0.25)] relative group">
                          <span className="font-mono text-3xl font-extrabold tracking-wider text-white">
                            <span className="text-[#1685FF]">M</span>PP
                          </span>
                          <div className="absolute inset-0 rounded-2xl border border-[#55B5FF]/30 animate-pulse pointer-events-none" />
                        </div>
                        <h3 className="font-semibold text-base text-[#F5F7FA]">Muhammed PP</h3>
                        <p className="text-xs text-[#929CAA] max-w-xs mt-1">
                          Student &bull; Computer Technician &bull; DIGIHUB Administrator
                        </p>
                      </div>

                      {/* Bottom Instruction Note */}
                      <div className="w-full bg-[#050608]/90 rounded-lg p-2.5 border border-white/[0.06] text-left">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#55B5FF] font-medium">
                          <Sparkles className="w-3 h-3 text-[#1685FF]" />
                          Portrait Placeholder
                        </div>
                        <p className="text-[10px] text-[#929CAA] mt-0.5 leading-snug">
                          Upload your real portrait via the{" "}
                          <a href="/admin" className="text-[#55B5FF] underline hover:text-white">
                            Admin Panel
                          </a>{" "}
                          or place it at <code className="text-[#F5F7FA]">/public/images/muhammed-pp.jpg</code>.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Portrait Caption Strip */}
                <div className="mt-3 px-2 py-1.5 flex items-center justify-between text-xs text-[#929CAA]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#1685FF]" />
                    Darul Hasanath Islamic College
                  </span>
                  <span className="font-mono text-[11px] text-[#55B5FF]">Kerala, IN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Scroll Indicator */}
        <div className="mt-16 sm:mt-20 flex justify-center">
          <button
            onClick={() => scrollTo("about")}
            className="flex flex-col items-center gap-2 text-xs font-mono text-[#929CAA] hover:text-white transition-colors cursor-pointer group"
          >
            <span>SCROLL TO EXPLORE</span>
            <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1 group-hover:border-[#1685FF] transition-colors">
              <div className="w-1 h-2 rounded-full bg-[#1685FF] animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
