import { useEffect, useState } from "react";
import { useStore } from "./store";
import { motion } from "framer-motion";
import { Section } from "./pages";
import { Play, Search as SearchIcon, BookOpen, Award as AwardIcon, Briefcase, Milestone, X } from "lucide-react";

/** ============ VIDEOS PAGE ============ */
export function VideosPage() {
  const { videos } = useStore();
  const [q, setQ] = useState(""); const [cat, setCat] = useState("");
  const [playing, setPlaying] = useState<string|null>(null);
  const cats = Array.from(new Set(videos.map(v=>v.category)));
  const filtered = videos.filter(v=>(!cat||v.category===cat)&&(!q||v.title.toLowerCase().includes(q.toLowerCase())));

  return <Section>
    <Header kicker="// Videos" title="Video Center" sub="Talks, demos and tutorials."/>
    <div className="glass p-3 flex flex-wrap gap-2 mb-5">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 flex-1 min-w-[200px]"><SearchIcon className="w-4 h-4 text-white/60"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search videos..." className="bg-transparent flex-1 text-sm placeholder:text-white/40"/></div>
      <div className="flex gap-1 overflow-x-auto">
        <button onClick={()=>setCat("")} className={`px-3 py-2 rounded-lg text-xs ${cat===""?"bg-cyan-400/20 text-cyan-300":"hover:bg-white/5 text-white/70"}`}>All</button>
        {cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap ${cat===c?"bg-cyan-400/20 text-cyan-300":"hover:bg-white/5 text-white/70"}`}>{c}</button>)}
      </div>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {filtered.map((v,i)=>(
        <motion.div key={v.id} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.05}} className="glass overflow-hidden glass-hover">
          <div className="video-card">
            {playing===v.id ? (
              <iframe src={v.url + "?autoplay=1"} allow="autoplay; encrypted-media" title={v.title}/>
            ) : (<>
              {v.thumb && <img src={v.thumb} alt={v.title} className="absolute inset-0 w-full h-full object-cover"/>}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
              <div className="play"><button onClick={()=>setPlaying(v.id)} data-cursor="hover"><Play className="w-6 h-6 ml-1"/></button></div>
            </>)}
          </div>
          <div className="p-4">
            <div className="chip mb-2 inline-flex">{v.category}</div>
            <div className="font-medium">{v.title}</div>
            {v.description && <div className="text-xs text-white/60 mt-1">{v.description}</div>}
          </div>
        </motion.div>
      ))}
    </div>
  </Section>;
}

/** ============ TIMELINE PAGE ============ */
export function TimelinePage() {
  const { timeline } = useStore();
  const iconFor = (c:string) => c==="education" ? <BookOpen className="w-4 h-4"/> : c==="work" ? <Briefcase className="w-4 h-4"/> : c==="achievement" ? <AwardIcon className="w-4 h-4"/> : <Milestone className="w-4 h-4"/>;
  return <Section>
    <Header kicker="// Journey" title="My Timeline" sub="A visual journey through milestones, education, and work."/>
    <div className="relative pl-16 max-w-3xl">
      <div className="tl-rail"/>
      {timeline.map((e,i)=>(
        <motion.div key={e.id} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.07}} className="relative mb-6">
          <div className="absolute -left-[30px] top-1 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 ring-4 ring-[#05060f] shadow-[0_0_18px_rgba(34,211,238,.5)] grid place-items-center text-black">{iconFor(e.category)}</div>
          <div className="glass p-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="font-mono text-cyan-300 text-sm">{e.year}</div>
              <span className="chip uppercase">{e.category}</span>
            </div>
            <div className="font-display text-xl mt-1">{e.title}</div>
            <p className="text-sm text-white/70 mt-2">{e.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </Section>;
}

/** ============ LOADING SCREEN ============ */
export function LoadingScreen() {
  const [hide, setHide] = useState(false);
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += Math.random() * 15;
      if (v >= 100) { v = 100; clearInterval(id); setTimeout(()=>setHide(true), 400); }
      setPct(Math.floor(v));
    }, 150);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={`loader-wrap ${hide ? "hide" : ""}`}>
      <div className="flex flex-col items-center">
        <div className="loader-ring"/>
        <div className="loader-bar"><span/></div>
        <div className="loader-text">Booting systems · {pct}%</div>
      </div>
    </div>
  );
}

/** ============ NOTIFICATION CENTER TOAST ============ */
export function NotifToasts() {
  const { notifs, setNotifs } = useStore();
  const visible = notifs.filter(n => !n.read).slice(0, 3);
  return (
    <div className="fixed top-24 right-4 z-40 flex flex-col gap-2 pointer-events-none">
      {visible.map(n=>(
        <motion.div key={n.id} initial={{opacity:0, x:80}} animate={{opacity:1,x:0}} exit={{opacity:0,x:80}} className="glass px-4 py-3 min-w-[260px] pointer-events-auto">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm"><span className="text-cyan-300 mr-2">●</span>{n.text}</div>
            <button onClick={()=>setNotifs(notifs.map(x=>x.id===n.id?{...x,read:true}:x))} className="text-white/60 hover:text-white"><X className="w-4 h-4"/></button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/** ============ COMMENT THREAD ============ */
export function CommentsThread({ targetType, targetId, onRequireAuth }:{targetType:"project"|"achievement"|"event"|"gallery"; targetId:string; onRequireAuth?:()=>void}) {
  const { comments, addComment, currentUser, setComments } = useStore();
  const [text, setText] = useState("");
  const list = comments.filter(c=>c.targetType===targetType && c.targetId===targetId && c.approved).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));
  return (
    <div className="glass p-5 mt-6">
      <div className="flex items-center gap-2 font-display mb-4"><MessageIcon/>Comments ({list.length})</div>
      <form onSubmit={e=>{e.preventDefault(); if(!text.trim()) return; if(!currentUser) { onRequireAuth?.(); return; } addComment({ targetType, targetId, text }); setText("");}} className="flex gap-2 mb-5">
        <input className="input flex-1" placeholder={currentUser?"Write a comment...":"Sign in to comment"} value={text} onChange={e=>setText(e.target.value)}/>
        <button className="btn-neon !py-2 !px-4" data-cursor="hover" type="submit">Post</button>
      </form>
      <div className="space-y-3">
        {list.map(c=>(
          <div key={c.id} className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 grid place-items-center text-xs text-black font-bold">{c.userName.slice(0,1)}</div>
                <span className="text-sm font-medium">{c.userName}</span>
                {c.pinned && <span className="chip text-[10px]">Pinned</span>}
              </div>
              <div className="text-xs text-white/40">{new Date(c.createdAt).toLocaleDateString()}</div>
            </div>
            <p className="text-sm text-white/80 mt-2">{c.text}</p>
            {currentUser && (currentUser.role==="admin"||currentUser.role==="superadmin") && (
              <div className="flex gap-2 mt-2">
                <button onClick={()=>setComments(comments.map(x=>x.id===c.id?{...x,pinned:!x.pinned}:x))} className="text-xs text-cyan-300">{c.pinned?"Unpin":"Pin"}</button>
                <button onClick={()=>setComments(comments.filter(x=>x.id!==c.id))} className="text-xs text-rose-300">Delete</button>
              </div>
            )}
          </div>
        ))}
        {list.length===0 && <div className="text-center text-sm text-white/50 py-6">No comments yet. Be the first to share your thoughts!</div>}
      </div>
    </div>
  );
}

function Header({ kicker, title, sub }:{kicker:string;title:string;sub?:string}) {
  return (
    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="mb-8">
      <div className="text-sm font-mono text-cyan-300">{kicker}</div>
      <h1 className="font-display text-4xl md:text-5xl mt-1">{title}</h1>
      {sub && <p className="text-white/60 mt-2">{sub}</p>}
    </motion.div>
  );
}

function MessageIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
