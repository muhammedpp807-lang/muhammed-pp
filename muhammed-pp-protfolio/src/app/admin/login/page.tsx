"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, Shield, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] text-[#F5F7FA] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 -right-24 w-80 h-80 bg-[#1685FF]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-[#929CAA] hover:text-white hover:border-[#1685FF] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Monogram Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#10151D] border border-white/15 flex items-center justify-center font-mono font-bold text-lg text-white mx-auto mb-3 shadow-[0_0_20px_rgba(22,133,255,0.3)]">
            <span className="text-[#1685FF]">M</span>PP
          </div>
          <h1 className="text-2xl font-extrabold text-[#F5F7FA] tracking-tight">
            Administrator Portal
          </h1>
          <p className="text-xs text-[#929CAA] mt-1 font-mono">
            Muhammed PP &bull; Content &amp; Systems Management
          </p>
        </div>

        {/* Login Box */}
        <div className="rounded-2xl bg-[#0A0D12] border border-white/[0.1] p-8 shadow-2xl relative">
          <div className="flex items-center gap-2 text-xs font-mono text-[#55B5FF] mb-6 border-b border-white/[0.08] pb-3">
            <Shield className="w-4 h-4 text-[#1685FF]" />
            <span>AUTHENTICATED ACCESS ONLY</span>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-mono uppercase tracking-wider text-[#929CAA] mb-1.5"
              >
                Admin Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-4 pr-11 py-3 rounded-lg bg-[#10151D] border border-white/[0.1] text-sm text-[#F5F7FA] placeholder-[#929CAA]/40 focus:outline-none focus:border-[#1685FF] focus:ring-1 focus:ring-[#1685FF] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#929CAA] hover:text-white p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-[#1685FF] hover:bg-[#55B5FF] text-white text-sm font-semibold transition-all duration-200 shadow-[0_0_20px_rgba(22,133,255,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Secure setup notice: no default credentials are shipped. */}
          <div className="mt-6 pt-5 border-t border-white/[0.07] text-[11px] text-[#929CAA] leading-relaxed">
            <div className="flex items-center gap-1.5 text-xs text-[#55B5FF] font-medium mb-1">
              <Shield className="w-3.5 h-3.5 text-[#1685FF]" />
              <span>Private administrator access</span>
            </div>
            <p>
              Admin access is provisioned on the server with a unique 16+ character <code className="text-white">ADMIN_PASSWORD</code>. The public portfolio remains available without signing in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
