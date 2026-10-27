"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Layers,
  User,
  Calendar,
  Award,
  Mail,
  Lock,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Upload,
  RefreshCw,
  Search,
  Eye,
  EyeOff,
  Star,
  Loader2,
  X,
  FileText,
  AlertCircle,
  Copy,
  Terminal,
} from "lucide-react";
import type {
  ProfileSettings,
  Project,
  TimelineEntry,
  Achievement,
  ContactMessage,
} from "@/db/schema";

interface AdminDashboardProps {
  initialProfile: ProfileSettings;
  initialProjects: Project[];
  initialTimeline: TimelineEntry[];
  initialAchievements: Achievement[];
  initialMessages: ContactMessage[];
}

export default function AdminDashboard({
  initialProfile,
  initialProjects,
  initialTimeline,
  initialAchievements,
  initialMessages,
}: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "projects" | "profile" | "timeline" | "achievements" | "messages" | "security"
  >("overview");

  // State data
  const [profile, setProfile] = useState<ProfileSettings>(initialProfile);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [timeline, setTimeline] = useState<TimelineEntry[]>(initialTimeline);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);

  // Status feedback
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const showFeedback = (type: "success" | "error", text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Sign out
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  // ================= PROJECT ACTIONS =================
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.description) {
      showFeedback("error", "Project Title and Description are required");
      return;
    }
    setSaving(true);
    try {
      if (isNewProject) {
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProject),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setProjects([...projects, data.project]);
        showFeedback("success", "Project created successfully");
      } else {
        const res = await fetch("/api/admin/projects", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProject),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setProjects(projects.map((p) => (p.id === data.project.id ? data.project : p)));
        showFeedback("success", "Project updated successfully");
      }
      setEditingProject(null);
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setProjects(projects.filter((p) => p.id !== id));
      showFeedback("success", "Project deleted");
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to delete project");
    }
  };

  const handleTogglePublishProject = async (proj: Project) => {
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: proj.id, published: !proj.published }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProjects(projects.map((p) => (p.id === proj.id ? { ...p, published: !proj.published } : p)));
      showFeedback("success", `Project ${!proj.published ? "published" : "hidden"}`);
    } catch (err: any) {
      showFeedback("error", err.message);
    }
  };

  const handleToggleFeatured = async (proj: Project) => {
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: proj.id, featured: !proj.featured }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProjects(
        projects.map((p) =>
          p.id === proj.id ? { ...p, featured: !proj.featured } : { ...p, featured: false }
        )
      );
      showFeedback("success", "Featured spotlight updated");
    } catch (err: any) {
      showFeedback("error", err.message);
    }
  };

  // ================= PROFILE ACTIONS =================
  const [profileForm, setProfileForm] = useState<ProfileSettings>(profile);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProfile(data.profile);
      showFeedback("success", "Profile settings saved");
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // ================= TIMELINE ACTIONS =================
  const [editingTimeline, setEditingTimeline] = useState<Partial<TimelineEntry> | null>(null);
  const [isNewTimeline, setIsNewTimeline] = useState(false);

  const handleSaveTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTimeline?.title || !editingTimeline?.description) {
      showFeedback("error", "Title and description required");
      return;
    }
    setSaving(true);
    try {
      if (isNewTimeline) {
        const res = await fetch("/api/admin/timeline", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingTimeline),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setTimeline([...timeline, data.item]);
        showFeedback("success", "Timeline milestone created");
      } else {
        const res = await fetch("/api/admin/timeline", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingTimeline),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setTimeline(timeline.map((t) => (t.id === data.item.id ? data.item : t)));
        showFeedback("success", "Timeline entry updated");
      }
      setEditingTimeline(null);
    } catch (err: any) {
      showFeedback("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTimeline = async (id: number) => {
    if (!confirm("Delete this timeline entry?")) return;
    try {
      const res = await fetch(`/api/admin/timeline?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setTimeline(timeline.filter((t) => t.id !== id));
      showFeedback("success", "Timeline entry removed");
    } catch (err: any) {
      showFeedback("error", err.message);
    }
  };

  // ================= ACHIEVEMENTS ACTIONS =================
  const [editingAchievement, setEditingAchievement] = useState<Partial<Achievement> | null>(null);
  const [isNewAchievement, setIsNewAchievement] = useState(false);

  const handleSaveAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAchievement?.title || !editingAchievement?.description) {
      showFeedback("error", "Title and description required");
      return;
    }
    setSaving(true);
    try {
      if (isNewAchievement) {
        const res = await fetch("/api/admin/achievements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingAchievement),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setAchievements([...achievements, data.item]);
        showFeedback("success", "Achievement created");
      } else {
        const res = await fetch("/api/admin/achievements", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingAchievement),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setAchievements(achievements.map((a) => (a.id === data.item.id ? data.item : a)));
        showFeedback("success", "Achievement updated");
      }
      setEditingAchievement(null);
    } catch (err: any) {
      showFeedback("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAchievement = async (id: number) => {
    if (!confirm("Delete this credential?")) return;
    try {
      const res = await fetch(`/api/admin/achievements?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setAchievements(achievements.filter((a) => a.id !== id));
      showFeedback("success", "Achievement deleted");
    } catch (err: any) {
      showFeedback("error", err.message);
    }
  };

  // ================= MESSAGES ACTIONS =================
  const handleToggleMessageRead = async (msg: ContactMessage) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg.id, isRead: !msg.isRead }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages(messages.map((m) => (m.id === msg.id ? { ...m, isRead: !msg.isRead } : m)));
    } catch (err: any) {
      showFeedback("error", err.message);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm("Permanently delete this message?")) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setMessages(messages.filter((m) => m.id !== id));
      showFeedback("success", "Message deleted");
    } catch (err: any) {
      showFeedback("error", err.message);
    }
  };

  // ================= UPLOAD HELPER =================
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setUploadedUrl(data.url);
      if (targetField === "portrait") {
        setProfileForm((prev) => ({ ...prev, portraitUrl: data.url }));
      }
      showFeedback("success", `File uploaded to ${data.url}`);
    } catch (err: any) {
      showFeedback("error", err.message);
    } finally {
      setUploading(false);
    }
  };

  // ================= PASSWORD UPDATE =================
  const [passwordState, setPasswordState] = useState({ oldPass: "", newPass: "", confirmPass: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordState.newPass !== passwordState.confirmPass) {
      showFeedback("error", "New passwords do not match");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: passwordState.oldPass,
          newPassword: passwordState.newPass,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showFeedback("success", "Password updated successfully");
      setPasswordState({ oldPass: "", newPass: "", confirmPass: "" });
    } catch (err: any) {
      showFeedback("error", err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="min-h-screen bg-[#050608] text-[#F5F7FA] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0A0D12] border-r border-white/[0.08] p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/[0.08] mb-6">
            <div className="w-9 h-9 rounded-lg bg-[#10151D] border border-white/15 flex items-center justify-center font-mono font-bold text-sm text-white">
              <span className="text-[#1685FF]">M</span>PP
            </div>
            <div>
              <div className="font-bold text-sm text-[#F5F7FA]">Admin Console</div>
              <div className="text-[11px] font-mono text-[#55B5FF]">Muhammed PP</div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "overview"
                  ? "bg-[#1685FF] text-white shadow-[0_0_15px_rgba(22,133,255,0.3)]"
                  : "text-[#929CAA] hover:text-white hover:bg-[#10151D]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "projects"
                  ? "bg-[#1685FF] text-white shadow-[0_0_15px_rgba(22,133,255,0.3)]"
                  : "text-[#929CAA] hover:text-white hover:bg-[#10151D]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                <span>Projects</span>
              </div>
              <span className="text-[10px] font-mono bg-black/30 px-1.5 py-0.5 rounded">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-[#1685FF] text-white shadow-[0_0_15px_rgba(22,133,255,0.3)]"
                  : "text-[#929CAA] hover:text-white hover:bg-[#10151D]"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile &amp; Bio</span>
            </button>

            <button
              onClick={() => setActiveTab("timeline")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "timeline"
                  ? "bg-[#1685FF] text-white shadow-[0_0_15px_rgba(22,133,255,0.3)]"
                  : "text-[#929CAA] hover:text-white hover:bg-[#10151D]"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Learning Timeline</span>
            </button>

            <button
              onClick={() => setActiveTab("achievements")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "achievements"
                  ? "bg-[#1685FF] text-white shadow-[0_0_15px_rgba(22,133,255,0.3)]"
                  : "text-[#929CAA] hover:text-white hover:bg-[#10151D]"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Achievements</span>
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "messages"
                  ? "bg-[#1685FF] text-white shadow-[0_0_15px_rgba(22,133,255,0.3)]"
                  : "text-[#929CAA] hover:text-white hover:bg-[#10151D]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>Contact Inbox</span>
              </div>
              {unreadCount > 0 && (
                <span className="text-[10px] font-mono bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "security"
                  ? "bg-[#1685FF] text-white shadow-[0_0_15px_rgba(22,133,255,0.3)]"
                  : "text-[#929CAA] hover:text-white hover:bg-[#10151D]"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Security</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/[0.08] space-y-2 mt-6">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#10151D] text-xs font-medium text-[#929CAA] hover:text-white transition-all border border-white/[0.07]"
          >
            <span className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-[#55B5FF]" />
              <span>View Live Site</span>
            </span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-6xl overflow-y-auto">
        {/* Top Feedback Banner */}
        {feedback && (
          <div
            className={`p-4 rounded-xl mb-6 flex items-center gap-3 text-sm animate-in fade-in duration-200 ${
              feedback.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* TAB: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA]">System Overview</h1>
              <p className="text-xs text-[#929CAA] font-mono mt-1">
                Live database statistics for Muhammed PP Portfolio
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-[#0A0D12] border border-white/[0.08]">
                <div className="text-xs font-mono uppercase text-[#929CAA]">Published Projects</div>
                <div className="text-3xl font-bold text-[#F5F7FA] mt-1">
                  {projects.filter((p) => p.published).length}
                </div>
                <div className="text-[11px] text-[#55B5FF] font-mono mt-1">
                  {projects.length} Total records
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#0A0D12] border border-white/[0.08]">
                <div className="text-xs font-mono uppercase text-[#929CAA]">Achievements</div>
                <div className="text-3xl font-bold text-[#F5F7FA] mt-1">
                  {achievements.filter((a) => a.published).length}
                </div>
                <div className="text-[11px] text-[#929CAA] font-mono mt-1">
                  Verified credentials
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#0A0D12] border border-white/[0.08]">
                <div className="text-xs font-mono uppercase text-[#929CAA]">Contact Messages</div>
                <div className="text-3xl font-bold text-[#F5F7FA] mt-1">{messages.length}</div>
                <div className="text-[11px] text-rose-400 font-mono mt-1">
                  {unreadCount} Unread
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#0A0D12] border border-white/[0.08]">
                <div className="text-xs font-mono uppercase text-[#929CAA]">Portrait Status</div>
                <div className="text-sm font-semibold text-emerald-400 mt-2">
                  {profile.portraitUrl ? "Active Custom Image" : "Placeholder Active"}
                </div>
                <div className="text-[11px] text-[#929CAA] font-mono mt-1">
                  Direct upload enabled
                </div>
              </div>
            </div>

            {/* Fast Asset Uploader Utility */}
            <div className="p-6 rounded-2xl bg-[#0A0D12] border border-white/[0.09] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#F5F7FA] flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#1685FF]" />
                    <span>Direct Asset Uploader</span>
                  </h3>
                  <p className="text-xs text-[#929CAA] mt-0.5">
                    Upload portraits, project screenshots, or certificate images directly to the server.
                  </p>
                </div>

                <label className="px-4 py-2 rounded-lg bg-[#1685FF] hover:bg-[#55B5FF] text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all">
                  {uploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{uploading ? "Uploading..." : "Upload File"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e)}
                    disabled={uploading}
                  />
                </label>
              </div>

              {uploadedUrl && (
                <div className="p-3 rounded-lg bg-[#10151D] border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-[#55B5FF]">
                  <span>Uploaded URL: {uploadedUrl}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(uploadedUrl);
                      showFeedback("success", "URL copied to clipboard");
                    }}
                    className="p-1 text-[#929CAA] hover:text-white"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Recent Messages Preview */}
            <div className="p-6 rounded-2xl bg-[#0A0D12] border border-white/[0.09]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#F5F7FA]">Recent Visitor Inquiries</h3>
                <button
                  onClick={() => setActiveTab("messages")}
                  className="text-xs text-[#55B5FF] hover:underline"
                >
                  View All &rarr;
                </button>
              </div>

              {messages.length === 0 ? (
                <div className="text-xs text-[#929CAA] py-4 text-center">
                  No contact messages received yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.slice(0, 3).map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        msg.isRead
                          ? "bg-[#10151D]/60 border-white/[0.06] text-[#929CAA]"
                          : "bg-[#10151D] border-[#1685FF]/40 text-[#F5F7FA]"
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{msg.name} ({msg.email})</div>
                        <div className="line-clamp-1 text-[#929CAA]">{msg.message}</div>
                      </div>
                      <span className="text-[10px] font-mono text-[#929CAA]">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: PROJECTS */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-[#F5F7FA]">Project Showcase Manager</h1>
                <p className="text-xs text-[#929CAA] font-mono mt-1">
                  Manage verified projects, statuses, tags, and case studies
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProject({
                    title: "",
                    subtitle: "",
                    category: "Web Platform",
                    status: "Practical Project",
                    description: "",
                    caseStudy: "",
                    tags: ["Web", "TypeScript"],
                    liveUrl: "",
                    githubUrl: "",
                    imageUrl: "",
                    featured: false,
                    published: true,
                    sortOrder: projects.length + 1,
                  });
                  setIsNewProject(true);
                }}
                className="px-4 py-2 rounded-lg bg-[#1685FF] hover:bg-[#55B5FF] text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </button>
            </div>

            {/* Project List */}
            <div className="space-y-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl bg-[#0A0D12] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#F5F7FA]">{proj.title}</h3>
                      <span className="text-[10px] font-mono uppercase bg-[#10151D] px-2 py-0.5 rounded text-[#929CAA] border border-white/[0.06]">
                        {proj.status}
                      </span>
                      {proj.featured && (
                        <span className="text-[10px] font-mono uppercase bg-[#1685FF]/20 text-[#55B5FF] px-2 py-0.5 rounded border border-[#1685FF]/30 flex items-center gap-1">
                          <Star className="w-2.5 h-2.5" /> Spotlight
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#929CAA] line-clamp-1">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono text-[#55B5FF]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleFeatured(proj)}
                      className={`p-2 rounded-lg border text-xs transition-all ${
                        proj.featured
                          ? "bg-[#1685FF]/20 border-[#1685FF] text-[#55B5FF]"
                          : "bg-[#10151D] border-white/10 text-[#929CAA] hover:text-white"
                      }`}
                      title="Toggle Featured"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleTogglePublishProject(proj)}
                      className={`p-2 rounded-lg border text-xs transition-all ${
                        proj.published
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                          : "bg-[#10151D] border-white/10 text-[#929CAA] hover:text-white"
                      }`}
                      title={proj.published ? "Published (click to hide)" : "Hidden (click to publish)"}
                    >
                      {proj.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        setEditingProject(proj);
                        setIsNewProject(false);
                      }}
                      className="p-2 rounded-lg bg-[#10151D] border border-white/10 text-[#929CAA] hover:text-white hover:border-white/20 transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-2 rounded-lg bg-[#10151D] border border-white/10 text-rose-400 hover:bg-rose-500/10 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Edit / Add Project */}
            {editingProject && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="relative w-full max-w-2xl bg-[#0A0D12] border border-white/[0.12] rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-5">
                    <h2 className="text-lg font-bold text-[#F5F7FA]">
                      {isNewProject ? "Add Verified Project" : "Edit Project"}
                    </h2>
                    <button
                      onClick={() => setEditingProject(null)}
                      className="p-1 text-[#929CAA] hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProject} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProject.title || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={editingProject.subtitle || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                          Category
                        </label>
                        <select
                          value={editingProject.category || "Web Platform"}
                          onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                        >
                          <option value="Web Platform">Web Platform</option>
                          <option value="IT & Systems">IT &amp; Systems</option>
                          <option value="Educational Web App">Educational Web App</option>
                          <option value="Interactive Simulation">Interactive Simulation</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                          Status
                        </label>
                        <select
                          value={editingProject.status || "Practical Project"}
                          onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                        >
                          <option value="Live">Live</option>
                          <option value="Practical Project">Practical Project</option>
                          <option value="Prototype">Prototype</option>
                          <option value="Experimental">Experimental</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                        Short Description *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={editingProject.description || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                        Technical Case Study Breakdown *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={editingProject.caseStudy || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, caseStudy: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={editingProject.tags ? editingProject.tags.join(", ") : ""}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                          })
                        }
                        placeholder="Next.js, TypeScript, Tailwind"
                        className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                          Live Destination URL
                        </label>
                        <input
                          type="url"
                          value={editingProject.liveUrl || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                          GitHub Repository URL
                        </label>
                        <input
                          type="url"
                          value={editingProject.githubUrl || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProject.published ?? true}
                          onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                          className="rounded bg-[#10151D] border-white/20 text-[#1685FF]"
                        />
                        <span>Published</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProject.featured ?? false}
                          onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                          className="rounded bg-[#10151D] border-white/20 text-[#1685FF]"
                        />
                        <span>Featured Spotlight</span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => setEditingProject(null)}
                        className="px-4 py-2 rounded-lg bg-[#10151D] text-[#929CAA] hover:text-white text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2 rounded-lg bg-[#1685FF] hover:bg-[#55B5FF] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save Project"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: PROFILE & BIO */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-[#F5F7FA]">Profile &amp; Biography</h1>
              <p className="text-xs text-[#929CAA] font-mono mt-1">
                Update the hero headline, authentic biography, location, education, and portrait
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Portrait Upload Section */}
              <div className="p-6 rounded-2xl bg-[#0A0D12] border border-white/[0.09] flex flex-col sm:flex-row items-center gap-6">
                <div className="w-28 h-36 rounded-xl bg-[#10151D] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 relative">
                  {profileForm.portraitUrl ? (
                    <img
                      src={profileForm.portraitUrl}
                      alt="Portrait preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-mono text-xs text-[#929CAA] text-center p-2">
                      No photo set
                    </span>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <h3 className="text-sm font-bold text-white">Portrait Photo</h3>
                  <p className="text-xs text-[#929CAA]">
                    Upload your real portrait photograph. It will display in the Hero section preserving your authentic identity.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <label className="px-4 py-2 rounded-lg bg-[#1685FF] hover:bg-[#55B5FF] text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? "Uploading..." : "Upload Real Portrait"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "portrait")}
                        disabled={uploading}
                      />
                    </label>

                    <input
                      type="text"
                      value={profileForm.portraitUrl || ""}
                      onChange={(e) => setProfileForm({ ...profileForm, portraitUrl: e.target.value })}
                      placeholder="Or enter image URL (/images/photo.jpg)"
                      className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Identity Details */}
              <div className="p-6 rounded-2xl bg-[#0A0D12] border border-white/[0.09] space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                      Tagline / Roles
                    </label>
                    <input
                      type="text"
                      value={profileForm.tagline}
                      onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                      Education / College
                    </label>
                    <input
                      type="text"
                      value={profileForm.education}
                      onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={profileForm.headline}
                    onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                    Supporting Hero Copy
                  </label>
                  <textarea
                    rows={2}
                    value={profileForm.supportingCopy}
                    onChange={(e) => setProfileForm({ ...profileForm, supportingCopy: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                    Authentic Biography (About Section)
                  </label>
                  <textarea
                    rows={4}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                      Contact Email (optional)
                    </label>
                    <input
                      type="email"
                      value={profileForm.contactEmail || ""}
                      onChange={(e) => setProfileForm({ ...profileForm, contactEmail: e.target.value })}
                      placeholder="hello@domain.com"
                      className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={profileForm.githubUrl || ""}
                      onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg bg-[#1685FF] hover:bg-[#55B5FF] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving Changes..." : "Save Profile Settings"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB: TIMELINE */}
        {activeTab === "timeline" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-[#F5F7FA]">Learning Timeline Manager</h1>
                <p className="text-xs text-[#929CAA] font-mono mt-1">
                  Manage chronological milestones and educational activities
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingTimeline({
                    title: "",
                    category: "Lab Administration",
                    organization: "",
                    description: "",
                    period: "Present",
                    sortOrder: timeline.length + 1,
                    published: true,
                  });
                  setIsNewTimeline(true);
                }}
                className="px-4 py-2 rounded-lg bg-[#1685FF] hover:bg-[#55B5FF] text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
            </div>

            <div className="space-y-3">
              {timeline.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl bg-[#0A0D12] border border-white/[0.08] flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{entry.title}</h3>
                      <span className="text-[10px] font-mono bg-[#1685FF]/10 text-[#55B5FF] px-2 py-0.5 rounded">
                        {entry.period}
                      </span>
                    </div>
                    <p className="text-xs text-[#929CAA] mt-0.5">{entry.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingTimeline(entry);
                        setIsNewTimeline(false);
                      }}
                      className="p-2 rounded-lg bg-[#10151D] border border-white/10 text-[#929CAA] hover:text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTimeline(entry.id)}
                      className="p-2 rounded-lg bg-[#10151D] border border-white/10 text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit / Add Modal */}
            {editingTimeline && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="relative w-full max-w-lg bg-[#0A0D12] border border-white/[0.12] rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
                    <h2 className="text-lg font-bold text-[#F5F7FA]">
                      {isNewTimeline ? "Add Milestone" : "Edit Milestone"}
                    </h2>
                    <button
                      onClick={() => setEditingTimeline(null)}
                      className="p-1 text-[#929CAA] hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveTimeline} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingTimeline.title || ""}
                        onChange={(e) => setEditingTimeline({ ...editingTimeline, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={editingTimeline.category || "Lab Administration"}
                          onChange={(e) =>
                            setEditingTimeline({ ...editingTimeline, category: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                          Period / Status
                        </label>
                        <input
                          type="text"
                          value={editingTimeline.period || "Present"}
                          onChange={(e) =>
                            setEditingTimeline({ ...editingTimeline, period: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                        Organization
                      </label>
                      <input
                        type="text"
                        value={editingTimeline.organization || ""}
                        onChange={(e) =>
                          setEditingTimeline({ ...editingTimeline, organization: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                        Description *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={editingTimeline.description || ""}
                        onChange={(e) =>
                          setEditingTimeline({ ...editingTimeline, description: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => setEditingTimeline(null)}
                        className="px-4 py-2 rounded-lg bg-[#10151D] text-[#929CAA] text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2 rounded-lg bg-[#1685FF] hover:bg-[#55B5FF] text-white text-xs font-semibold"
                      >
                        {saving ? "Saving..." : "Save Milestone"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: ACHIEVEMENTS */}
        {activeTab === "achievements" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-[#F5F7FA]">Achievements &amp; Certificates</h1>
                <p className="text-xs text-[#929CAA] font-mono mt-1">
                  Add genuine verified credentials and college milestone records
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingAchievement({
                    title: "",
                    issuer: "",
                    period: "",
                    description: "",
                    credentialUrl: "",
                    published: true,
                    sortOrder: achievements.length + 1,
                  });
                  setIsNewAchievement(true);
                }}
                className="px-4 py-2 rounded-lg bg-[#1685FF] hover:bg-[#55B5FF] text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Achievement</span>
              </button>
            </div>

            {achievements.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#0A0D12] border border-white/[0.08] text-center">
                <p className="text-xs text-[#929CAA]">
                  No achievements added yet. The public site currently displays the authentic empty state:
                  &quot;Every project is another step forward.&quot;
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {achievements.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#0A0D12] border border-white/[0.08] flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-white">{item.title}</h3>
                      <div className="text-xs text-[#929CAA]">{item.issuer} &bull; {item.period}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingAchievement(item);
                          setIsNewAchievement(false);
                        }}
                        className="p-2 rounded-lg bg-[#10151D] border border-white/10 text-[#929CAA] hover:text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAchievement(item.id)}
                        className="p-2 rounded-lg bg-[#10151D] border border-white/10 text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Achievement Edit Modal */}
            {editingAchievement && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="relative w-full max-w-lg bg-[#0A0D12] border border-white/[0.12] rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
                    <h2 className="text-lg font-bold text-[#F5F7FA]">
                      {isNewAchievement ? "Add Achievement" : "Edit Achievement"}
                    </h2>
                    <button
                      onClick={() => setEditingAchievement(null)}
                      className="p-1 text-[#929CAA] hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveAchievement} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingAchievement.title || ""}
                        onChange={(e) =>
                          setEditingAchievement({ ...editingAchievement, title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                          Issuer / Organization
                        </label>
                        <input
                          type="text"
                          value={editingAchievement.issuer || ""}
                          onChange={(e) =>
                            setEditingAchievement({ ...editingAchievement, issuer: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                          Date / Year
                        </label>
                        <input
                          type="text"
                          value={editingAchievement.period || ""}
                          onChange={(e) =>
                            setEditingAchievement({ ...editingAchievement, period: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                        Description *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={editingAchievement.description || ""}
                        onChange={(e) =>
                          setEditingAchievement({ ...editingAchievement, description: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                        Certificate URL / Document Link
                      </label>
                      <input
                        type="url"
                        value={editingAchievement.credentialUrl || ""}
                        onChange={(e) =>
                          setEditingAchievement({ ...editingAchievement, credentialUrl: e.target.value })
                        }
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => setEditingAchievement(null)}
                        className="px-4 py-2 rounded-lg bg-[#10151D] text-[#929CAA] text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2 rounded-lg bg-[#1685FF] hover:bg-[#55B5FF] text-white text-xs font-semibold"
                      >
                        {saving ? "Saving..." : "Save Achievement"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: CONTACT MESSAGES */}
        {activeTab === "messages" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-[#F5F7FA]">Contact Inbox</h1>
                <p className="text-xs text-[#929CAA] font-mono mt-1">
                  Private visitor submissions received via the portfolio contact form
                </p>
              </div>

              <span className="text-xs font-mono bg-[#1685FF]/15 text-[#55B5FF] px-3 py-1 rounded-full border border-[#1685FF]/30">
                {unreadCount} Unread / {messages.length} Total
              </span>
            </div>

            {messages.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#0A0D12] border border-white/[0.08] text-center">
                <p className="text-xs text-[#929CAA]">No messages in your inbox.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-5 rounded-xl border transition-all ${
                      msg.isRead
                        ? "bg-[#0A0D12] border-white/[0.06] text-[#929CAA]"
                        : "bg-[#10151D] border-[#1685FF]/40 text-[#F5F7FA] shadow-[0_0_15px_rgba(22,133,255,0.08)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#F5F7FA]">{msg.name}</span>
                          {!msg.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#1685FF] animate-pulse" />
                          )}
                        </div>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-xs text-[#55B5FF] hover:underline"
                        >
                          {msg.email}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#929CAA]">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
                        </span>

                        <button
                          onClick={() => handleToggleMessageRead(msg)}
                          className="p-1.5 rounded bg-[#10151D] border border-white/10 text-xs hover:text-white"
                          title={msg.isRead ? "Mark Unread" : "Mark Read"}
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 ${
                              msg.isRead ? "text-emerald-400" : "text-[#929CAA]"
                            }`}
                          />
                        </button>

                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1.5 rounded bg-[#10151D] border border-white/10 text-xs text-rose-400 hover:bg-rose-500/10"
                          title="Delete Message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#F5F7FA]/90 whitespace-pre-wrap bg-[#050608] p-3.5 rounded-lg border border-white/[0.05]">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: SECURITY */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-[#F5F7FA]">Security &amp; Credentials</h1>
              <p className="text-xs text-[#929CAA] font-mono mt-1">
                Update the administrator password and review session controls
              </p>
            </div>

            <div className="max-w-md p-6 rounded-2xl bg-[#0A0D12] border border-white/[0.09]">
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordState.oldPass}
                    onChange={(e) => setPasswordState({ ...passwordState, oldPass: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                    New Password (at least 8 chars) *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={passwordState.newPass}
                    onChange={(e) => setPasswordState({ ...passwordState, newPass: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#929CAA] mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={passwordState.confirmPass}
                    onChange={(e) =>
                      setPasswordState({ ...passwordState, confirmPass: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-white/10 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full py-2.5 rounded-lg bg-[#1685FF] hover:bg-[#55B5FF] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {passwordLoading ? "Updating..." : "Update Administrator Password"}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] text-[#929CAA] space-y-1">
                <p>&bull; Passwords are salted and hashed using PBKDF2-SHA512.</p>
                <p>&bull; Sessions use HttpOnly cookies with HMAC signatures.</p>
                <p>&bull; Public visitors never see or require administrative credentials.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
