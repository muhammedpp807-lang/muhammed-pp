import { useMemo, useState } from "react";
import { useStore, Item } from "./store";
import { motion, AnimatePresence } from "framer-motion";
import { Section as Sec, ProjectCard, Section } from "./pages";
import {
  Calendar, MapPin, Download, Search as SearchIcon, X, Star,
  Send, Award as AwardIcon, Sparkles, Video as VideoIcon, Image as ImageIcon,
  FileText, FileArchive, Presentation, FileSpreadsheet, ChevronRight, LogIn, UserPlus, Mail, KeyRound, User
} from "lucide-react";

const fileIcon = (t?:string) => {
  if (!t) return <FileText className="w-5 h-5"/>;
  if (t==="pdf" || t==="docx") return <FileText className="w-5 h-5"/>;
  if (t==="pptx") return <Presentation className="w-5 h-5"/>;
  if (t==="xlsx") return <FileSpreadsheet className="w-5 h-5"/>;
  if (t==="zip") return <FileArchive className="w-5 h-5"/>;
  if (["jpg","png","jpeg"].includes(t)) return <ImageIcon className="w-5 h-5"/>;
  if (["mp4","mov","webm"].includes(t)) return <VideoIcon className="w-5 h-5"/>;
  return <FileText className="w-5 h-5"/>;
};

function filterBar<T extends Item>(items:T[], opts:{ categories:string[]; search:string; setSearch:(s:string)=>void; category:string; setCategory:(s:string)=>void }) {
  const filtered = items.filter(i => (!opts.category || i.category===opts.category) && (!opts.search || (i.title+i.description).toLowerCase().includes(opts.search.toLowerCase())));
  return { filtered, node: (
    <div className="glass p-3 flex flex-wrap items-center gap-2 mb-6">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 flex-1 min-w-[200px]">
        <SearchIcon className="w-4 h-4 text-white/60"/>
        <input value={opts.search} onChange={e=>opts.setSearch(e.target.value)} placeholder="Search..." className="bg-transparent flex-1 text-sm placeholder:text-white/40"/>
      </div>
      <div className="flex gap-1 overflow-x-auto">
        <button onClick={()=>opts.setCategory("")} className={`px-3 py-2 rounded-lg text-xs ${opts.category===""?"bg-cyan-400/20 text-cyan-300":"hover:bg-white/5 text-white/70"}`}>All</button>
        {opts.categories.map(c=><button key={c} onClick={()=>opts.setCategory(c)} className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap ${opts.category===c?"bg-cyan-400/20 text-cyan-300":"hover:bg-white/5 text-white/70"}`}>{c}</button>)}
      </div>
    </div>
  ) };
}

export function ProjectsPage() {
  const { items } = useStore();
  const [search, setSearch] = useState(""); const [category, setCategory] = useState("");
  const projects = items.filter(i=>i.type==="project");
  const cats = Array.from(new Set(projects.map(p=>p.category||"General")));
  const f = filterBar(projects, { categories:cats, search, setSearch, category, setCategory });
  return <Sec>
    <Header kicker="// Projects" title="Project Portfolio" sub="Every project is a story of problem solving."/>
    {f.node}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {f.filtered.map((p,i)=><ProjectCard key={p.id} item={p} i={i}/>)}
      {f.filtered.length===0 && <div className="col-span-full text-center text-white/50 py-20">No projects found.</div>}
    </div>
  </Sec>;
}

export function AchievementsPage() {
  const { items } = useStore();
  const [search, setSearch] = useState(""); const [category, setCategory] = useState("");
  const list = items.filter(i=>i.type==="achievement");
  const cats = Array.from(new Set(list.map(p=>p.category||"Certification")));
  const f = filterBar(list, { categories:cats, search, setSearch, category, setCategory });
  return <Sec>
    <Header kicker="// Achievements" title="Milestones & Certifications" sub="A record of continuous learning and recognition."/>
    {f.node}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {f.filtered.map((a,i)=>(
        <motion.div key={a.id} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.05}} whileHover={{y:-4}} className="glass glass-hover overflow-hidden">
          <div className="aspect-[16/10] relative">
            {a.image ? <img src={a.image} alt={a.title} className="w-full h-full object-cover"/> : <div className="w-full h-full grid place-items-center bg-gradient-to-br from-purple-500/20 to-cyan-500/20"><AwardIcon className="w-16 h-16 text-cyan-300"/></div>}
            <div className="absolute top-3 left-3 chip"><AwardIcon className="w-3 h-3"/>Achievement</div>
          </div>
          <div className="p-5">
            <h3 className="font-display text-lg">{a.title}</h3>
            <p className="text-white/60 text-sm mt-1">{a.description}</p>
            {a.date && <div className="mt-3 flex items-center gap-2 text-xs text-white/60"><Calendar className="w-3.5 h-3.5"/>{new Date(a.date).toLocaleDateString()}</div>}
            {a.attachments && a.attachments.length>0 && <div className="mt-3 flex flex-wrap gap-2">
              {a.attachments.map((x,ix)=><a key={ix} href={x.url} className="chip"><Download className="w-3 h-3"/>{x.name}</a>)}
            </div>}
          </div>
        </motion.div>
      ))}
      {f.filtered.length===0 && <div className="col-span-full text-center text-white/50 py-20">No achievements yet.</div>}
    </div>
  </Sec>;
}

export function EventsPage() {
  const { items } = useStore();
  const [search, setSearch] = useState(""); const [category, setCategory] = useState("");
  const list = items.filter(i=>i.type==="event").sort((a,b)=> (b.date||"").localeCompare(a.date||""));
  const cats = Array.from(new Set(list.map(p=>p.category||"Events")));
  const f = filterBar(list, { categories:cats, search, setSearch, category, setCategory });
  return <Sec>
    <Header kicker="// Events" title="Upcoming & Recent Events" sub="Conferences, workshops, and meetups I'm part of."/>
    {f.node}
    <div className="grid md:grid-cols-2 gap-5">
      {f.filtered.map((e,i)=>(
        <motion.article key={e.id} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.05}} className="glass glass-hover overflow-hidden flex flex-col sm:flex-row">
          <div className="sm:w-48 aspect-video sm:aspect-square relative"><img src={e.image} alt={e.title} className="w-full h-full object-cover"/></div>
          <div className="p-5 flex-1">
            <div className="flex items-center gap-2 text-xs text-cyan-300 mb-2"><Calendar className="w-3 h-3"/>{e.date ? new Date(e.date).toDateString() : "TBA"}</div>
            <h3 className="font-display text-lg">{e.title}</h3>
            <p className="text-white/60 text-sm mt-1">{e.description}</p>
            {e.location && <div className="mt-2 flex items-center gap-2 text-xs text-white/60"><MapPin className="w-3 h-3"/>{e.location}</div>}
          </div>
        </motion.article>
      ))}
    </div>
  </Sec>;
}

export function GalleryPage() {
  const { items } = useStore();
  const [q, setQ] = useState(""); const [cat, setCat] = useState("");
  const [open, setOpen] = useState<Item|null>(null);
  const list = items.filter(i=>i.type==="gallery");
  const cats = Array.from(new Set(list.map(p=>p.category||"General")));
  const filtered = list.filter(i=>(!cat||i.category===cat)&&(!q||i.title.toLowerCase().includes(q.toLowerCase())));
  return <Sec>
    <Header kicker="// Gallery" title="Moments & Media" sub="A curated visual feed."/>
    <div className="glass p-3 flex flex-wrap items-center gap-2 mb-6">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 flex-1 min-w-[200px]"><SearchIcon className="w-4 h-4 text-white/60"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search gallery..." className="bg-transparent flex-1 text-sm placeholder:text-white/40"/></div>
      <div className="flex gap-1 overflow-x-auto">
        <button onClick={()=>setCat("")} className={`px-3 py-2 rounded-lg text-xs ${cat===""?"bg-cyan-400/20 text-cyan-300":"hover:bg-white/5 text-white/70"}`}>All</button>
        {cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap ${cat===c?"bg-cyan-400/20 text-cyan-300":"hover:bg-white/5 text-white/70"}`}>{c}</button>)}
      </div>
    </div>
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
      {filtered.map((g,i)=>(
        <motion.button key={g.id} onClick={()=>setOpen(g)} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i%6*.05}} className="mb-4 w-full break-inside-avoid glass overflow-hidden group text-left">
          <img src={g.image} alt={g.title} className="w-full object-cover group-hover:scale-105 transition-transform duration-500"/>
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm">{g.title}</div>
              <span className="chip">{g.category}</span>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
    <AnimatePresence>
      {open && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(null)} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 grid place-items-center" data-cursor="hover">
        <motion.div initial={{scale:.9}} animate={{scale:1}} className="relative max-w-5xl w-full glass p-2" onClick={e=>e.stopPropagation()}>
          <button onClick={()=>setOpen(null)} className="absolute top-2 right-2 p-2 rounded-full bg-black/50 z-10"><X className="w-5 h-5"/></button>
          <img src={open.image} alt={open.title} className="w-full max-h-[75vh] object-contain rounded-xl"/>
          <div className="p-3"><div className="text-lg">{open.title}</div>{open.category && <div className="text-xs text-cyan-300">{open.category}</div>}</div>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </Sec>;
}

export function FilesPage() {
  const { items } = useStore();
  const [q, setQ] = useState(""); const [cat, setCat] = useState("");
  const list = items.filter(i=>i.type==="file");
  const cats = Array.from(new Set(list.map(p=>p.category||"Other")));
  const filtered = list.filter(i=>(!cat||i.category===cat)&&(!q||i.title.toLowerCase().includes(q.toLowerCase())));
  return <Sec>
    <Header kicker="// File Library" title="Download Resources" sub="PDFs, presentations, archives, and source bundles."/>
    <div className="glass p-3 flex flex-wrap gap-2 mb-6">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 flex-1 min-w-[200px]"><SearchIcon className="w-4 h-4 text-white/60"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search files..." className="bg-transparent flex-1 text-sm placeholder:text-white/40"/></div>
      <div className="flex gap-1 overflow-x-auto">
        <button onClick={()=>setCat("")} className={`px-3 py-2 rounded-lg text-xs ${cat===""?"bg-cyan-400/20 text-cyan-300":"hover:bg-white/5 text-white/70"}`}>All</button>
        {cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap ${cat===c?"bg-cyan-400/20 text-cyan-300":"hover:bg-white/5 text-white/70"}`}>{c}</button>)}
      </div>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map((f,i)=>(
        <motion.div key={f.id} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.05}} className="glass p-4 flex items-center gap-4 glass-hover">
          <div className="w-12 h-12 rounded-xl grid place-items-center bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-cyan-300">{fileIcon(f.attachments?.[0]?.type)}</div>
          <div className="flex-1 min-w-0"><div className="font-medium truncate">{f.title}</div><div className="text-xs text-white/50">{f.category}</div></div>
          {f.attachments?.map((a,ix)=><a key={ix} href={a.url} className="btn-ghost !py-2 !px-3 text-sm" data-cursor="hover"><Download className="w-4 h-4"/></a>)}
        </motion.div>
      ))}
    </div>
  </Sec>;
}

export function ContactPage() {
  const { addMessage } = useStore();
  const [f, setF] = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent] = useState(false);
  return <Sec>
    <Header kicker="// Contact" title="Get in Touch" sub="Have a project in mind? Let's talk."/>
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 glass p-6 space-y-5">
        <div><div className="text-xs text-cyan-300 font-mono mb-1">// Email</div><div className="text-lg break-all">hello@muhammedpp.dev</div></div>
        <div><div className="text-xs text-cyan-300 font-mono mb-1">// Location</div><div className="text-lg">India · Open to Remote</div></div>
        <div><div className="text-xs text-cyan-300 font-mono mb-1">// Response Time</div><div className="text-lg">Usually within 24 hours</div></div>
        <div className="divider my-4"/>
        <div className="flex gap-3">
          <SocialChip>GitHub</SocialChip><SocialChip>LinkedIn</SocialChip><SocialChip>X / Twitter</SocialChip>
        </div>
      </div>
      <form className="lg:col-span-3 glass p-6 space-y-3" onSubmit={e=>{e.preventDefault(); addMessage({ fromName:f.name, fromEmail:f.email, subject:f.subject, body:f.message }); setSent(true); setF({name:"",email:"",subject:"",message:""});}}>
        {sent && <div className="text-emerald-300 text-sm glass !border-emerald-400/30 p-3">Your message has been sent and delivered to the admin inbox.</div>}
        <div className="grid md:grid-cols-2 gap-3">
          <input required className="input" placeholder="Your name" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/>
          <input required type="email" className="input" placeholder="Email" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/>
        </div>
        <input required className="input" placeholder="Subject" value={f.subject} onChange={e=>setF({...f,subject:e.target.value})}/>
        <textarea required rows={6} className="input" placeholder="Your message..." value={f.message} onChange={e=>setF({...f,message:e.target.value})}/>
        <div className="flex justify-end">
          <button className="btn-neon" data-cursor="hover"><Send className="w-4 h-4"/>Send message</button>
        </div>
        <p className="text-xs text-white/40">Prefer email? Messages are delivered instantly to the admin inbox.</p>
      </form>
    </div>
  </Sec>;
}

const SocialChip = ({ children }:{children:any}) => <button className="chip">{children}</button>;

function Header({ kicker, title, sub }:{kicker:string;title:string;sub?:any}) {
  return (
    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="mb-8">
      <div className="text-sm font-mono text-cyan-300">{kicker}</div>
      <h1 className="font-display text-4xl md:text-5xl mt-1">{title}</h1>
      {sub && <p className="text-white/60 mt-2">{sub}</p>}
    </motion.div>
  );
}

/* ============== AUTH ============== */
export function AuthPage({ mode, setMode, setPage }:{mode:"login"|"register"; setMode:(m:"login"|"register")=>void; setPage:(p:string)=>void}) {
  const { login, register } = useStore();
  const [f, setF] = useState({ name:"", email:"", password:"" });
  const [err, setErr] = useState<string|null>(null);
  const submit = (e:any) => {
    e.preventDefault(); setErr(null);
    const r = mode==="login" ? login(f.email, f.password) : register(f.name, f.email, f.password);
    if (r) setErr(r); else setPage("home");
  };
  return (
    <section className="min-h-screen grid place-items-center px-4 py-12">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="max-w-md w-full glass p-6 md:p-8">
        <div className="text-center mb-2">
          <div className="w-16 h-16 mx-auto rounded-2xl grid place-items-center bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-400/40"><Sparkles className="w-7 h-7 text-cyan-300"/></div>
          <div className="font-display text-2xl mt-3 gradient-text">MUHAMMED PP</div>
          <div className="text-xs text-white/50 mt-1">{mode==="login"?"Sign in to access the platform":"Create your account"}</div>
        </div>
        <form onSubmit={submit} className="space-y-3 mt-5">
          {mode==="register" && <Field icon={<User className="w-4 h-4"/>}><input className="input !bg-transparent !border-0 !p-0" placeholder="Full name" value={f.name} onChange={e=>setF({...f,name:e.target.value})} required/></Field>}
          <Field icon={<Mail className="w-4 h-4"/>}><input type="email" className="input !bg-transparent !border-0 !p-0" placeholder="Email address" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required/></Field>
          <Field icon={<KeyRound className="w-4 h-4"/>}><input type="password" className="input !bg-transparent !border-0 !p-0" placeholder="Password" value={f.password} onChange={e=>setF({...f,password:e.target.value})} required/></Field>
          {err && <div className="text-sm text-rose-300">{err}</div>}
          <button className="btn-neon w-full justify-center" data-cursor="hover">{mode==="login"?<><LogIn className="w-4 h-4"/>Sign In</>:<><UserPlus className="w-4 h-4"/>Create Account</>}</button>
        </form>
        <div className="text-center mt-4 text-sm text-white/70">
          {mode==="login"?"Don't have an account?":"Already registered?"} <button className="text-cyan-300 underline" onClick={()=>setMode(mode==="login"?"register":"login")}>{mode==="login"?"Sign up":"Sign in"}</button>
        </div>
        <div className="divider my-4"/>
        <button onClick={()=>setPage("home")} className="btn-ghost w-full justify-center text-sm" data-cursor="hover">Continue as guest</button>
        {mode==="login" && <div className="mt-5 p-3 text-xs glass text-white/70">
          <div className="font-mono text-cyan-300 mb-1">// Demo accounts</div>
          <div className="flex justify-between"><span>Super Admin:</span><span className="font-mono">admin@muhammedpp.dev</span></div>
          <div className="flex justify-between"><span>Password:</span><span className="font-mono">admin123</span></div>
          <div className="mt-2 flex justify-between"><span>User:</span><span className="font-mono">aisha@demo.com</span></div>
          <div className="flex justify-between"><span>Password:</span><span className="font-mono">demo123</span></div>
        </div>}
      </motion.div>
    </section>
  );
}
const Field = ({ icon, children }:{icon:any;children:any}) => (
  <div className="flex items-center gap-2 input !p-0 px-3 py-2">
    <div className="text-white/50">{icon}</div><div className="flex-1">{children}</div>
  </div>
);

/* ============== PROFILE ============== */
export function ProfilePage({ setPage }:{setPage:(p:string)=>void}) {
  const { currentUser, items, favorites, followers, comments, ratings } = useStore();
  if (!currentUser) { setPage("login"); return null; }
  const favProjects = items.filter(i=>favorites.includes(i.id));
  const myComments = comments.filter(c=>c.userId===currentUser.id);
  return <Section>
    <Header kicker="// Profile" title="Your Space" sub="Manage favorites, activity and account."/>
    <div className="grid lg:grid-cols-3 gap-5">
      <div className="glass p-6 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 grid place-items-center font-display text-3xl font-bold text-black">{currentUser.name.slice(0,1)}</div>
        <div className="font-display text-xl mt-3">{currentUser.name}</div>
        <div className="text-xs text-white/50">{currentUser.email}</div>
        <div className="mt-3 chip mx-auto">{currentUser.role.toUpperCase()}</div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div><div className="font-display text-lg">{favProjects.length}</div><div className="text-[10px] uppercase text-white/50">Favorites</div></div>
          <div><div className="font-display text-lg">{followers.length}</div><div className="text-[10px] uppercase text-white/50">Followers</div></div>
          <div><div className="font-display text-lg">{myComments.length}</div><div className="text-[10px] uppercase text-white/50">Comments</div></div>
        </div>
      </div>
      <div className="lg:col-span-2 space-y-5">
        <div className="glass p-5">
          <div className="font-display mb-3">Your favorite projects</div>
          {favProjects.length===0 ? <div className="text-white/50 text-sm">No favorites yet. Browse projects and tap the star.</div> : <div className="grid sm:grid-cols-2 gap-3">
            {favProjects.map(p=>(
              <button key={p.id} onClick={()=>setPage("projects")} className="flex gap-3 items-center text-left glass glass-hover p-3">
                <img src={p.image} className="w-16 h-16 rounded-lg object-cover"/>
                <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{p.title}</div><div className="text-xs text-white/50">{p.category}</div></div>
                <ChevronRight className="w-4 h-4"/>
              </button>
            ))}
          </div>}
        </div>
        <div className="glass p-5">
          <div className="font-display mb-3">Your ratings</div>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(n=><StarButton key={n} n={n}/>)}
          </div>
          <div className="text-xs text-white/50 mt-2">{ratings.length} global ratings</div>
        </div>
      </div>
    </div>
  </Section>;
}

function StarButton({ n }:{n:number}) {
  const [hover, setHover] = useState(0);
  const { addRating, currentUser } = useStore();
  return <button onMouseEnter={()=>setHover(n)} onMouseLeave={()=>setHover(0)} onClick={()=>{ if(currentUser) addRating(n); }} className="p-1" data-cursor="hover"><Star className={`w-6 h-6 ${n<=hover?"fill-amber-300 text-amber-300":"text-white/30"}`}/></button>;
}

/* ============== SEARCH ============== */
export function SearchPage({ setPage }:{setPage:(p:string)=>void}) {
  const { items } = useStore();
  const [q, setQ] = useState("");
  const results = useMemo(()=>{
    if (!q.trim()) return [];
    const s = q.toLowerCase();
    return items.filter(i => (i.title+i.description+(i.tags||[]).join(" ")+(i.category||"")).toLowerCase().includes(s)).slice(0, 30);
  }, [q, items]);
  return <Section>
    <Header kicker="// Search" title="Find anything"/>
    <div className="glass p-3 flex items-center gap-2 mb-6">
      <SearchIcon className="w-4 h-4 text-white/60"/>
      <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search projects, events, achievements, files..." className="bg-transparent flex-1 text-lg placeholder:text-white/40"/>
      {q && <button onClick={()=>setQ("")} className="p-1 text-white/60"><X className="w-4 h-4"/></button>}
    </div>
    {q && results.length===0 && <div className="text-center text-white/50 py-20">No results for "{q}"</div>}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      {results.map(r=>(
        <motion.button key={r.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} onClick={()=>setPage(r.type==="gallery"?"gallery":r.type==="file"?"files":r.type+"s")} className="glass glass-hover p-4 text-left flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 grid place-items-center text-cyan-300 text-xs uppercase">{r.type.slice(0,3)}</div>
          <div><div className="font-medium text-sm">{r.title}</div><div className="text-xs text-white/50">{r.category} · {r.type}</div></div>
        </motion.button>
      ))}
    </div>
  </Section>;
}

/* ============== MESSAGES ============== */
export function MessagesPage() {
  const { messages, setMessages, currentUser } = useStore();
  const [sel, setSel] = useState<string|null>(messages[0]?.id||null);
  const [tab, setTab] = useState<"inbox"|"sent"|"archived">("inbox");
  const [reply, setReply] = useState("");
  const cur = messages.find(m=>m.id===sel);
  const list = messages.filter(m => tab==="archived" ? m.archived : tab==="sent" ? false : !m.archived);

  const open = (id:string) => { setSel(id); setMessages(messages.map(m=>m.id===id?{...m, read:true}:m)); };
  const send = () => {
    if (!cur || !reply.trim()) return;
    setMessages(messages.map(m=>m.id===cur.id?{...m, replies:[...m.replies,{id:Math.random().toString(36).slice(2), from:currentUser?.name||"Admin", body:reply, at:new Date().toISOString(), admin:true}]}:m));
    setReply("");
  };

  return <Section>
    <Header kicker="// Messages" title="Message Center" sub="Admin inbox with conversation history."/>
    <div className="grid md:grid-cols-3 gap-4">
      <div className="glass overflow-hidden">
        <div className="flex gap-1 p-2 border-b border-white/10">
          {(["inbox","sent","archived"] as const).map(t=><button key={t} onClick={()=>setTab(t)} className={`px-3 py-1.5 rounded-md text-xs ${tab===t?"bg-cyan-400/20 text-cyan-300":"text-white/60 hover:bg-white/5"}`}>{t}</button>)}
        </div>
        <div className="max-h-[60vh] overflow-auto">
          {list.map(m=>(
            <button key={m.id} onClick={()=>open(m.id)} className={`w-full text-left p-3 border-b border-white/5 hover:bg-white/5 ${sel===m.id?"bg-white/5":""}`}>
              <div className="flex items-start gap-2">
                {!m.read && <span className="mt-1.5 w-2 h-2 rounded-full bg-cyan-400"/>}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{m.fromName}</div>
                  <div className="text-xs text-cyan-300 truncate">{m.subject}</div>
                  <div className="text-xs text-white/50 truncate">{m.body}</div>
                </div>
              </div>
            </button>
          ))}
          {list.length===0 && <div className="p-6 text-center text-white/40 text-sm">No {tab} messages.</div>}
        </div>
      </div>
      <div className="md:col-span-2 glass p-5">
        {cur ? (<>
          <div className="flex items-start justify-between gap-3">
            <div><div className="text-xs text-cyan-300 font-mono">{new Date(cur.createdAt).toLocaleString()}</div><div className="font-display text-xl">{cur.subject}</div><div className="text-sm text-white/70">From: {cur.fromName} ({cur.fromEmail})</div></div>
            <div className="flex gap-1">
              <button onClick={()=>setMessages(messages.map(m=>m.id===cur.id?{...m,archived:!m.archived}:m))} className="btn-ghost !py-2 !px-3 text-xs">Archive</button>
              <button onClick={()=>{ setMessages(messages.filter(m=>m.id!==cur.id)); setSel(null); }} className="btn-ghost !py-2 !px-3 text-xs">Delete</button>
            </div>
          </div>
          <div className="divider my-4"/>
          <div className="text-white/85 whitespace-pre-wrap leading-relaxed">{cur.body}</div>
          <div className="divider my-4"/>
          <div className="space-y-2">
            {cur.replies.map(r=>(
              <div key={r.id} className={`p-3 rounded-xl ${r.admin?"bg-cyan-500/10 border border-cyan-400/30 ml-8":"bg-white/5"}`}>
                <div className="text-xs text-cyan-300 mb-1">{r.from} · {new Date(r.at).toLocaleString()}</div>
                <div className="text-sm text-white/90">{r.body}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
            <textarea rows={2} className="input" placeholder="Write a reply..." value={reply} onChange={e=>setReply(e.target.value)}/>
            <button onClick={send} className="btn-neon" data-cursor="hover"><Send className="w-4 h-4"/></button>
          </div>
        </>) : <div className="text-center text-white/50 py-20">Select a message to view.</div>}
      </div>
    </div>
  </Section>;
}
