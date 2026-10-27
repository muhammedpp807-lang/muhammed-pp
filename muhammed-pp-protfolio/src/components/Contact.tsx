"use client";

import { useState } from "react";
import { Send, MapPin, GraduationCap, GitBranch, Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ContactProps {
  profile: {
    name: string;
    location: string;
    education: string;
    contactEmail?: string | null;
    githubUrl?: string | null;
  };
}

export default function Contact({ profile }: ContactProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    // Client-side validation
    if (formData.name.trim().length < 2) {
      setStatus({ type: "error", message: "Please enter your name (minimum 2 characters)." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatus({ type: "error", message: "Please provide a valid email address." });
      return;
    }

    if (formData.message.trim().length < 10) {
      setStatus({ type: "error", message: "Please write a message of at least 10 characters." });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to deliver message");
      }

      setStatus({
        type: "success",
        message: "Your message was sent successfully and saved to Muhammed PP's inbox!",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.message || "An error occurred while sending your message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="cinematic-section cinematic-section--contact relative py-24 bg-[#0A0D12]/[0.82] border-t border-white/[0.08] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context & Verified Channels */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1685FF]/10 border border-[#1685FF]/30 text-xs font-mono text-[#55B5FF] w-fit">
              <Mail className="w-3.5 h-3.5 text-[#1685FF]" />
              <span>06 // DIRECT CONTACT</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FA]">
              Have an idea?
              <br />
              <span className="text-[#1685FF]">Let’s connect.</span>
            </h2>

            <p className="text-base text-[#929CAA] leading-relaxed">
              Interested in technology, creative projects, or working on something interesting? Get in touch.
            </p>

            {/* Direct Details Box */}
            <div className="p-6 rounded-2xl bg-[#10151D] border border-white/[0.08] space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#1685FF]/15 text-[#55B5FF] mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs uppercase font-mono text-[#929CAA]">Location</div>
                  <div className="text-sm font-semibold text-[#F5F7FA]">{profile.location}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-white/[0.06]">
                <div className="p-2 rounded-lg bg-[#1685FF]/15 text-[#55B5FF] mt-0.5">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs uppercase font-mono text-[#929CAA]">Institution</div>
                  <div className="text-sm font-semibold text-[#F5F7FA]">{profile.education}</div>
                </div>
              </div>

              {profile.githubUrl && (
                <div className="flex items-start gap-3 pt-3 border-t border-white/[0.06]">
                  <div className="p-2 rounded-lg bg-[#1685FF]/15 text-[#55B5FF] mt-0.5">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-mono text-[#929CAA]">GitHub</div>
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-[#55B5FF] hover:underline"
                    >
                      {profile.githubUrl.replace("https://github.com/", "@")}
                    </a>
                  </div>
                </div>
              )}

              {profile.contactEmail && (
                <div className="flex items-start gap-3 pt-3 border-t border-white/[0.06]">
                  <div className="p-2 rounded-lg bg-[#1685FF]/15 text-[#55B5FF] mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-mono text-[#929CAA]">Verified Email</div>
                    <a
                      href={`mailto:${profile.contactEmail}`}
                      className="text-sm font-semibold text-[#55B5FF] hover:underline"
                    >
                      {profile.contactEmail}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Secure Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#10151D] border border-white/[0.1] shadow-2xl relative">
              <h3 className="text-xl font-bold text-[#F5F7FA] mb-2">Send a Direct Message</h3>
              <p className="text-xs text-[#929CAA] mb-6">
                Your message is stored securely in the database and accessible only via Muhammed PP&apos;s authenticated admin inbox.
              </p>

              {status && (
                <div
                  className={`p-4 rounded-xl mb-6 flex items-start gap-3 text-sm ${
                    status.type === "success"
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                      : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-[#929CAA] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-lg bg-[#050608] border border-white/[0.1] text-[#F5F7FA] placeholder-[#929CAA]/50 focus:outline-none focus:border-[#1685FF] focus:ring-1 focus:ring-[#1685FF] text-sm transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-[#929CAA] mb-1.5">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@domain.com"
                    className="w-full px-4 py-3 rounded-lg bg-[#050608] border border-white/[0.1] text-[#F5F7FA] placeholder-[#929CAA]/50 focus:outline-none focus:border-[#1685FF] focus:ring-1 focus:ring-[#1685FF] text-sm transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-[#929CAA] mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry, project idea, or question..."
                    className="w-full px-4 py-3 rounded-lg bg-[#050608] border border-white/[0.1] text-[#F5F7FA] placeholder-[#929CAA]/50 focus:outline-none focus:border-[#1685FF] focus:ring-1 focus:ring-[#1685FF] text-sm transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-lg bg-[#1685FF] hover:bg-[#55B5FF] disabled:opacity-50 text-white font-semibold text-sm transition-all duration-200 shadow-[0_0_20px_rgba(22,133,255,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-[#929CAA]/80 pt-2">
                  Protected by rate limiting. No unverified third-party scripts.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
