import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type Role = "superadmin" | "admin" | "user" | "guest";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  targetType: "project" | "achievement" | "event" | "gallery";
  targetId: string;
  userId: string;
  userName: string;
  text: string;
  approved: boolean;
  pinned: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  fromName: string;
  fromEmail: string;
  toAdmin: boolean;
  subject: string;
  body: string;
  read: boolean;
  archived: boolean;
  replies: { id: string; from: string; body: string; at: string; admin?: boolean }[];
  createdAt: string;
}

export interface Item {
  id: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  date?: string;
  location?: string;
  image?: string;
  images?: string[];
  video?: string;
  source?: string;
  demo?: string;
  attachments?: { name: string; url: string; type: string }[];
  type: "project" | "achievement" | "event" | "gallery" | "file";
  featured?: boolean;
  views?: number;
  likes?: string[];
}

export interface Rating { id: string; stars: number; user?: string; at: string; }
export interface Testimonial { id: string; name: string; role?: string; text: string; approved: boolean; at: string; avatar?: string; }
export interface Notif { id: string; text: string; kind: "message" | "follower" | "comment" | "rating" | "system"; read: boolean; at: string; }

export interface AboutProfile {
  name: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  resumeUrl: string;
  availability: string;
  education: { period: string; school: string; degree: string }[];
  interests: string[];
  careerGoals: string[];
  skills: { category: string; items: string[] }[];
  social: { github: string; linkedin: string; twitter: string; website: string };
}

export interface TimelineEntry { id: string; year: string; title: string; description: string; category: "education" | "work" | "achievement" | "milestone"; }
export interface Video { id: string; title: string; description?: string; category: string; url: string; thumb?: string; source: "youtube" | "vimeo" | "upload"; createdAt: string; }

const uid = () => Math.random().toString(36).slice(2, 10);

const seedUsers: User[] = [
  { id: "u0", name: "Muhammed PP", email: "admin@muhammedpp.dev", password: "admin123", role: "superadmin", avatar: "MP", bio: "Technology Enthusiast · Web Developer · AI Explorer · Future Network Administrator", createdAt: new Date().toISOString() },
  { id: "u1", name: "Aisha Khan", email: "aisha@demo.com", password: "demo123", role: "user", createdAt: new Date().toISOString() },
  { id: "u2", name: "Rahul Das", email: "rahul@demo.com", password: "demo123", role: "user", createdAt: new Date().toISOString() },
];

const seedProjects: Item[] = [
  { id: "p1", type: "project", title: "NeonShop — E-Commerce Platform", description: "A full-stack futuristic e-commerce storefront with Stripe payments, admin analytics, and a cyberpunk UI built in React.", category: "Web App", tags: ["React","Node","Stripe"], date: "2025-09-12", image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=1600&auto=format&fit=crop", demo: "#", source: "#", views: 1243, likes: ["u1","u2"], featured: true, attachments: [{name:"Specs.pdf",url:"#",type:"pdf"}] },
  { id: "p2", type: "project", title: "CyberNet Dashboard", description: "Real-time network monitoring dashboard with live traffic charts, threat alerts, and secure role-based access.", category: "Networking", tags: ["Cybersecurity","AI","Firebase"], date: "2025-07-01", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop", demo: "#", source: "#", views: 845, likes: ["u1"], featured: true },
  { id: "p3", type: "project", title: "AI Study Assistant", description: "LLM-powered assistant that summarizes PDFs, generates flashcards, and quizzes students interactively.", category: "AI Tool", tags: ["AI","Node","Firebase"], date: "2025-11-20", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1600&auto=format&fit=crop", demo: "#", source: "#", views: 2100, likes: ["u1","u2"] , featured: true},
  { id: "p4", type: "project", title: "Portfolio CMS v1", description: "The very platform you're browsing — built to manage my complete digital presence.", category: "Web App", tags: ["React","Tailwind","CMS"], date: "2026-01-15", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop", demo: "#", source: "#", views: 530, likes: [] , featured: true},
  { id: "p5", type: "project", title: "Hardware Bench Lab", description: "Comparative benchmarking tool for PC components with interactive 3D charts.", category: "Hardware", tags: ["Hardware","Charts"], date: "2024-12-02", image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1600&auto=format&fit=crop", demo: "#", source: "#", views: 320, likes: [] },
  { id: "p6", type: "project", title: "NeonChat — Realtime Messaging", description: "Socket.io powered chat with E2E encryption, reactions and typing indicators.", category: "Web App", tags: ["Socket.io","Node"], date: "2025-04-18", image: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?q=80&w=1600&auto=format&fit=crop", demo: "#", source: "#", views: 610, likes: ["u2"] },
];

const seedAchievements: Item[] = [
  { id: "a1", type: "achievement", title: "Certified Network Security Specialist", description: "Advanced certification covering threat analysis, firewalls, and intrusion detection.", date: "2025-06-10", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop", attachments: [{name:"Certificate.pdf",url:"#",type:"pdf"}] },
  { id: "a2", type: "achievement", title: "Google IT Support Professional", description: "Comprehensive training in troubleshooting, networking, and system administration.", date: "2024-11-22", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop" },
  { id: "a3", type: "achievement", title: "Hackathon Winner — CodeFest 2025", description: "First place for AI-powered accessibility tool.", date: "2025-03-05", image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1600&auto=format&fit=crop" },
];

const seedEvents: Item[] = [
  { id: "e1", type: "event", title: "TechCon 2026 — Keynote Speaker", description: "Speaking on the future of AI-driven networks and cybersecurity.", date: "2026-05-12", location: "Kochi, India", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop" },
  { id: "e2", type: "event", title: "Cybersecurity Workshop", description: "Hands-on workshop on network defense and ethical hacking.", date: "2025-10-20", location: "Online", image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=1600&auto=format&fit=crop" },
];

const seedGallery: Item[] = [
  { id:"g1", type:"gallery", title:"Workstation Setup", image:"https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop", category:"Workspace" },
  { id:"g2", type:"gallery", title:"Conference Stage", image:"https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1400&auto=format&fit=crop", category:"Events" },
  { id:"g3", type:"gallery", title:"Lab & Hardware", image:"https://images.unsplash.com/photo-1580894908361-967195033215?q=80&w=1400&auto=format&fit=crop", category:"Hardware" },
  { id:"g4", type:"gallery", title:"Code Review", image:"https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1400&auto=format&fit=crop", category:"Workspace" },
  { id:"g5", type:"gallery", title:"Team Meetup", image:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop", category:"Events" },
  { id:"g6", type:"gallery", title:"Neon City Nights", image:"https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=1400&auto=format&fit=crop", category:"Inspiration" },
];

const seedFiles: Item[] = [
  { id:"f1", type:"file", title:"Resume — Muhammed PP.pdf", category:"Document", attachments:[{name:"Resume.pdf",url:"#",type:"pdf"}] },
  { id:"f2", type:"file", title:"AI Research Notes.docx", category:"Document", attachments:[{name:"AI_Notes.docx",url:"#",type:"docx"}] },
  { id:"f3", type:"file", title:"Networking Slides.pptx", category:"Presentation", attachments:[{name:"Networking.pptx",url:"#",type:"pptx"}] },
  { id:"f4", type:"file", title:"Source Bundle.zip", category:"Archive", attachments:[{name:"Bundle.zip",url:"#",type:"zip"}] },
];

const seedComments: Comment[] = [
  { id: "c1", targetType:"project", targetId:"p1", userId:"u1", userName:"Aisha Khan", text:"Absolutely beautiful UI — the neon accents are stunning!", approved:true, pinned:true, createdAt: new Date(Date.now()-86400000*3).toISOString() },
  { id: "c2", targetType:"project", targetId:"p3", userId:"u2", userName:"Rahul Das", text:"The AI study assistant saved me hours of revision!", approved:true, pinned:false, createdAt: new Date(Date.now()-86400000*6).toISOString() },
];

const seedMessages: Message[] = [
  { id: "m1", fromName:"Aisha Khan", fromEmail:"aisha@demo.com", toAdmin:true, subject:"Collaboration opportunity", body:"Hi Muhammed! Love your work. Would you be open to a collaboration on a developer tool I'm building?", read:false, archived:false, replies:[], createdAt: new Date(Date.now()-86400000*2).toISOString() },
];

const seedRatings: Rating[] = [
  { id: "r1", stars:5, user:"Aisha Khan", at: new Date(Date.now()-86400000*4).toISOString() },
  { id: "r2", stars:5, user:"Rahul Das", at: new Date(Date.now()-86400000*7).toISOString() },
  { id: "r3", stars:4, at: new Date(Date.now()-86400000*12).toISOString() },
];

const seedTestimonials: Testimonial[] = [
  { id:"t1", name:"Dr. Ravi Menon", role:"Professor of Computer Science", text:"Muhammed is an exceptional student — his grasp of both networking theory and modern web stacks is remarkable.", approved:true, at:new Date(Date.now()-86400000*10).toISOString() },
  { id:"t2", name:"Priya S.", role:"Startup Founder", text:"Delivered our MVP ahead of schedule. Clean code, great taste in design, and excellent communication.", approved:true, at:new Date(Date.now()-86400000*20).toISOString() },
];

const defaultAbout: AboutProfile = {
  name: "Muhammed PP",
  tagline: "Technology Enthusiast · Web Developer · AI Explorer · Future Network Administrator",
  bio: "I'm a passionate technologist who thrives at the intersection of web development, AI, and network engineering. I build systems that feel alive — responsive, performant, and beautifully designed. My mission is to turn bold ideas into reliable production-grade software that serves real people.",
  email: "hello@muhammedpp.dev",
  location: "Kerala, India · Open to Remote",
  resumeUrl: "#",
  availability: "Open to freelance and full-time opportunities",
  education: [
    { period: "2023 – Present", school: "Self-Directed Study", degree: "Advanced Web Development, AI & Cybersecurity" },
    { period: "2022 – 2024", school: "Higher Secondary Education", degree: "Computer Science" },
    { period: "2024", school: "Industry Certifications", degree: "Networking, Cloud, Ethical Hacking" },
  ],
  interests: ["Open Source","Cybersecurity","AI Research","Neon UI/UX","Network Automation","Hardware Tinkering"],
  careerGoals: ["Lead engineering at an AI-first product company","Contribute to open-source infrastructure","Speak at international tech conferences"],
  skills: [
    { category:"Programming", items:["HTML","CSS","JavaScript"] },
    { category:"Technology", items:["Networking","Cybersecurity","AI Tools","Firebase","Node.js","Computer Hardware"] },
    { category:"Design", items:["Graphic Design","UI/UX Design"] },
    { category:"Infrastructure", items:["Cloud","Security","DevOps"] },
  ],
  social: { github:"#", linkedin:"#", twitter:"#", website:"#" }
};

const seedTimeline: TimelineEntry[] = [
  { id:"t1", year:"2022", title:"First Line of Code", description:"Built my first HTML/CSS website and fell in love with the craft.", category:"milestone" },
  { id:"t2", year:"2023", title:"JavaScript Journey", description:"Dove deep into JS, learned async patterns and built interactive web apps.", category:"milestone" },
  { id:"t3", year:"2024", title:"Cybersecurity Path", description:"Earned first certification in network security and ethical hacking.", category:"achievement" },
  { id:"t4", year:"2025", title:"AI-Powered SaaS", description:"Shipped AI-integrated platforms to real users globally.", category:"work" },
  { id:"t5", year:"2026", title:"Portfolio Platform v2", description:"Launched this very platform — a complete digital presence CMS.", category:"milestone" },
];

const seedVideos: Video[] = [
  { id:"v1", title:"Building a Neon Portfolio — Timelapse", category:"Tutorial", url:"https://www.youtube.com/embed/dQw4w9WgXcQ", source:"youtube", thumb:"https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop", createdAt: new Date().toISOString() },
  { id:"v2", title:"AI Network Monitoring Demo", category:"Demo", url:"https://www.youtube.com/embed/dQw4w9WgXcQ", source:"youtube", thumb:"https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop", createdAt: new Date().toISOString() },
  { id:"v3", title:"Conference Talk — Future of Networks", category:"Talk", url:"https://www.youtube.com/embed/dQw4w9WgXcQ", source:"youtube", thumb:"https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop", createdAt: new Date().toISOString() },
];

interface StoreCtx {
  users: User[]; setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser: User | null; setCurrentUser: (u: User | null) => void;
  items: Item[]; setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  comments: Comment[]; setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  messages: Message[]; setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  ratings: Rating[]; setRatings: React.Dispatch<React.SetStateAction<Rating[]>>;
  testimonials: Testimonial[]; setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  followers: string[]; setFollowers: React.Dispatch<React.SetStateAction<string[]>>;
  following: string[]; setFollowing: React.Dispatch<React.SetStateAction<string[]>>;
  favorites: string[]; setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
  notifs: Notif[]; setNotifs: React.Dispatch<React.SetStateAction<Notif[]>>;
  about: AboutProfile; setAbout: React.Dispatch<React.SetStateAction<AboutProfile>>;
  timeline: TimelineEntry[]; setTimeline: React.Dispatch<React.SetStateAction<TimelineEntry[]>>;
  videos: Video[]; setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  login: (email: string, password: string) => string | null;
  register: (name: string, email: string, password: string, role?: Role) => string | null;
  logout: () => void;
  addItem: (it: Omit<Item,"id">) => void;
  updateItem: (id: string, patch: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  toggleLike: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleFollow: (userId?: string) => void;
  addComment: (c: Omit<Comment,"id"|"createdAt"|"approved"|"pinned"|"userId"|"userName">) => void;
  addMessage: (m: Omit<Message,"id"|"read"|"archived"|"replies"|"createdAt"|"toAdmin">) => void;
  addRating: (stars: number) => void;
  addTestimonial: (t: Omit<Testimonial,"id"|"approved"|"at">) => void;
  addVideo: (v: Omit<Video,"id"|"createdAt">) => void;
  deleteVideo: (id: string) => void;
  addTimelineEntry: (e: Omit<TimelineEntry,"id">) => void;
  deleteTimelineEntry: (id: string) => void;
  incrementDownload: (fileId: string) => void;
  reset: () => void;
}

const Ctx = createContext<StoreCtx | null>(null);

const load = <T,>(k: string, def: T): T => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; }
};
const save = (k: string, v: any) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export function StoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => load("mp_users", seedUsers));
  const [currentUser, setCU] = useState<User | null>(() => load("mp_cu", null));
  const [items, setItems] = useState<Item[]>(() => load("mp_items", [...seedProjects, ...seedAchievements, ...seedEvents, ...seedGallery, ...seedFiles]));
  const [comments, setComments] = useState<Comment[]>(() => load("mp_comments", seedComments));
  const [messages, setMessages] = useState<Message[]>(() => load("mp_messages", seedMessages));
  const [ratings, setRatings] = useState<Rating[]>(() => load("mp_ratings", seedRatings));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => load("mp_testimonials", seedTestimonials));
  const [followers, setFollowers] = useState<string[]>(() => load("mp_followers", ["u1","u2"]));
  const [following, setFollowing] = useState<string[]>(() => load("mp_following", []));
  const [favorites, setFavorites] = useState<string[]>(() => load("mp_favs", []));
  const [notifs, setNotifs] = useState<Notif[]>(() => load("mp_notifs", [
    { id:uid(), kind:"message", text:"New message from Aisha Khan", read:false, at: new Date(Date.now()-86400000*2).toISOString() },
    { id:uid(), kind:"follower", text:"Rahul Das started following you", read:true, at: new Date(Date.now()-86400000*5).toISOString() },
  ]));
  const [about, setAbout] = useState<AboutProfile>(() => load("mp_about", defaultAbout));
  const [timeline, setTimeline] = useState<TimelineEntry[]>(() => load("mp_timeline", seedTimeline));
  const [videos, setVideos] = useState<Video[]>(() => load("mp_videos", seedVideos));

  useEffect(() => save("mp_users", users), [users]);
  useEffect(() => save("mp_cu", currentUser), [currentUser]);
  useEffect(() => save("mp_items", items), [items]);
  useEffect(() => save("mp_comments", comments), [comments]);
  useEffect(() => save("mp_messages", messages), [messages]);
  useEffect(() => save("mp_ratings", ratings), [ratings]);
  useEffect(() => save("mp_testimonials", testimonials), [testimonials]);
  useEffect(() => save("mp_followers", followers), [followers]);
  useEffect(() => save("mp_following", following), [following]);
  useEffect(() => save("mp_favs", favorites), [favorites]);
  useEffect(() => save("mp_notifs", notifs), [notifs]);
  useEffect(() => save("mp_about", about), [about]);
  useEffect(() => save("mp_timeline", timeline), [timeline]);
  useEffect(() => save("mp_videos", videos), [videos]);

  const setCurrentUser = (u: User | null) => setCU(u);

  const login: StoreCtx["login"] = (email, password) => {
    const u = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!u) return "Invalid email or password";
    setCU(u); return null;
  };
  const register: StoreCtx["register"] = (name, email, password, role="user") => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) return "Email already registered";
    const u: User = { id: uid(), name, email, password, role, createdAt: new Date().toISOString(), avatar: name.slice(0,2).toUpperCase() };
    setUsers(prev => [...prev, u]); setCU(u); return null;
  };
  const logout = () => setCU(null);

  const addItem: StoreCtx["addItem"] = (it) => setItems(prev => [{ id: uid(), views:0, likes:[], ...it }, ...prev]);
  const updateItem: StoreCtx["updateItem"] = (id, patch) => setItems(prev => prev.map(i => i.id===id ? { ...i, ...patch } : i));
  const deleteItem: StoreCtx["deleteItem"] = (id) => setItems(prev => prev.filter(i => i.id!==id));

  const pushNotif = (n: Omit<Notif,"id"|"read"|"at">) => setNotifs(prev => [{ id:uid(), read:false, at:new Date().toISOString(), ...n }, ...prev]);

  const toggleLike = (id: string) => {
    if (!currentUser) return;
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const likes = i.likes || [];
      return { ...i, likes: likes.includes(currentUser.id) ? likes.filter(x=>x!==currentUser.id) : [...likes, currentUser.id] };
    }));
  };
  const toggleFavorite = (id: string) => {
    if (!currentUser) return;
    setFavorites(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  };
  const toggleFollow = (userId?: string) => {
    if (!currentUser) return;
    const target = userId || "u0";
    if (followers.includes(currentUser.id)) {
      setFollowers(prev => prev.filter(x=>x!==currentUser.id));
    } else {
      setFollowers(prev => [...prev, currentUser.id]);
      if (target === "u0") pushNotif({ kind:"follower", text:`${currentUser.name} started following you` });
    }
  };

  const addComment: StoreCtx["addComment"] = (c) => {
    if (!currentUser) return;
    const nc: Comment = { id: uid(), userId: currentUser.id, userName: currentUser.name, approved: currentUser.role === "superadmin" || currentUser.role === "admin" ? true : false, pinned:false, createdAt: new Date().toISOString(), ...c };
    setComments(prev => [nc, ...prev]);
    if (!nc.approved) pushNotif({ kind:"comment", text:"New comment pending approval" });
  };
  const addMessage: StoreCtx["addMessage"] = (m) => {
    const nm: Message = { id: uid(), read:false, archived:false, replies:[], toAdmin:true, createdAt: new Date().toISOString(), ...m };
    setMessages(prev => [nm, ...prev]);
    pushNotif({ kind:"message", text:`New message: ${m.subject}` });
    // Try Firebase sync (fire-and-forget, won't break if Firebase is offline)
    import("./firebase").then(({ addDocument }) => {
      addDocument("messages", { fromName: nm.fromName, fromEmail: nm.fromEmail, subject: nm.subject, body: nm.body, read: false, archived: false, replies: [] }).catch(() => {});
    }).catch(() => {});
  };
  const addRating = (stars: number) => {
    const r: Rating = { id: uid(), stars, user: currentUser?.name, at: new Date().toISOString() };
    setRatings(prev => [r, ...prev]);
    pushNotif({ kind:"rating", text:`New ${stars}-star rating` });
  };
  const addTestimonial: StoreCtx["addTestimonial"] = (t) => {
    const nt: Testimonial = { id: uid(), approved:false, at: new Date().toISOString(), ...t };
    setTestimonials(prev => [nt, ...prev]);
  };
  const addVideo: StoreCtx["addVideo"] = (v) => setVideos(prev => [{ id: uid(), createdAt: new Date().toISOString(), ...v }, ...prev]);
  const deleteVideo: StoreCtx["deleteVideo"] = (id) => setVideos(prev => prev.filter(v => v.id !== id));
  const addTimelineEntry: StoreCtx["addTimelineEntry"] = (e) => setTimeline(prev => [{ id: uid(), ...e }, ...prev]);
  const deleteTimelineEntry: StoreCtx["deleteTimelineEntry"] = (id) => setTimeline(prev => prev.filter(t => t.id !== id));
  const incrementDownload: StoreCtx["incrementDownload"] = (fileId) => {
    setItems(prev => prev.map(i => i.id === fileId ? { ...i, views: (i.views||0) + 1 } : i));
  };

  const reset = () => {
    localStorage.clear();
    setUsers(seedUsers); setCU(null);
    setItems([...seedProjects,...seedAchievements,...seedEvents,...seedGallery,...seedFiles]);
    setComments(seedComments); setMessages(seedMessages); setRatings(seedRatings);
    setTestimonials(seedTestimonials); setFollowers(["u1","u2"]); setFollowing([]); setFavorites([]);
    setNotifs([{ id:uid(), kind:"message", text:"New message from Aisha Khan", read:false, at: new Date(Date.now()-86400000*2).toISOString() }]);
    setAbout(defaultAbout); setTimeline(seedTimeline); setVideos(seedVideos);
  };

  const value = useMemo<StoreCtx>(() => ({
    users,setUsers,currentUser,setCurrentUser,items,setItems,comments,setComments,messages,setMessages,
    ratings,setRatings,testimonials,setTestimonials,followers,setFollowers,following,setFollowing,
    favorites,setFavorites,notifs,setNotifs,about,setAbout,timeline,setTimeline,videos,setVideos,
    login,register,logout,addItem,updateItem,deleteItem,
    toggleLike,toggleFavorite,toggleFollow,addComment,addMessage,addRating,addTestimonial,
    addVideo,deleteVideo,addTimelineEntry,deleteTimelineEntry,incrementDownload,reset
  }), [users,currentUser,items,comments,messages,ratings,testimonials,followers,favorites,notifs,about,timeline,videos]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("StoreProvider missing");
  return v;
};
