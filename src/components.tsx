import { useEffect, useRef, useState } from "react";
import { useStore } from "./store";
import { motion, AnimatePresence } from "framer-motion";

/* ============== CUSTOM CURSOR ============== */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 1024) return;
    let rx = 0, ry = 0, x = 0, y = 0;
    const onMove = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x-3}px,${y-3}px,0)`;
    };
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a,button,[data-cursor='hover']")) setHover(true); else setHover(false);
    };
    const onDown = () => setClicked(true);
    const onUp = () => setClicked(false);
    const raf = () => {
      rx += (x - rx) * 0.15; ry += (y - ry) * 0.15;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx-19}px,${ry-19}px,0) scale(${clicked?1.3:1})`;
      requestAnimationFrame(raf);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    raf();
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseover", onOver); window.removeEventListener("mousedown", onDown); window.removeEventListener("mouseup", onUp); };
  }, [clicked]);

  return (<>
    <div ref={ringRef} className={`cursor-ring ${hover ? "hover" : ""}`} />
    <div ref={dotRef} className="cursor-dot" />
  </>);
}

/* ============== PARTICLE BG ============== */
export function ParticleField() {
  const cRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cRef.current!; const ctx = c.getContext("2d")!;
    let w = c.width = window.innerWidth; let h = c.height = window.innerHeight;
    const N = Math.min(90, Math.floor((w*h)/25000));
    type P = { x:number; y:number; vx:number; vy:number; r:number; c:string };
    const palette = ["#22d3ee","#a855f7","#3b82f6","#ec4899"];
    const pts: P[] = Array.from({length:N}, () => ({ x:Math.random()*w, y:Math.random()*h, vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4, r:Math.random()*1.8+0.6, c: palette[Math.floor(Math.random()*palette.length)] }));
    let mouse = { x: -9999, y: -9999 };
    const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMouse);
    const resize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    let raf = 0;
    const loop = () => {
      ctx.clearRect(0,0,w,h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x<0||p.x>w) p.vx*=-1; if (p.y<0||p.y>h) p.vy*=-1;
        const dx = p.x-mouse.x, dy = p.y-mouse.y; const d2 = dx*dx+dy*dy;
        if (d2 < 14000) { p.x += dx*0.0015; p.y += dy*0.0015; }
        ctx.beginPath(); ctx.fillStyle = p.c; ctx.globalAlpha = .85; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
        ctx.shadowColor = p.c; ctx.shadowBlur = 14;
      }
      ctx.shadowBlur = 0;
      // links
      for (let i=0;i<pts.length;i++){
        for (let j=i+1;j<pts.length;j++){
          const a = pts[i], b = pts[j]; const dx=a.x-b.x, dy=a.y-b.y; const d2 = dx*dx+dy*dy;
          if (d2 < 120*120) {
            ctx.strokeStyle = `rgba(120,180,255,${1 - Math.sqrt(d2)/120})`; ctx.lineWidth = .5;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMouse); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={cRef} className="fixed inset-0 -z-10 pointer-events-none" />;
}

/* ============== NAV ============== */
const NAV = [
  { key:"home", label:"Home" },
  { key:"about", label:"About" },
  { key:"skills", label:"Skills" },
  { key:"timeline", label:"Timeline" },
  { key:"projects", label:"Projects" },
  { key:"achievements", label:"Achievements" },
  { key:"events", label:"Events" },
  { key:"gallery", label:"Gallery" },
  { key:"videos", label:"Videos" },
  { key:"files", label:"Files" },
  { key:"contact", label:"Contact" },
];
import { Menu, X, LayoutDashboard, LogIn, Search, Bell, UserCircle2, LogOut, Sparkles } from "lucide-react";

export function Nav({ page, setPage }: { page: string; setPage: (p:string)=>void }) {
  const { currentUser, logout, notifs } = useStore();
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<"notif"|"profile"|null>(null);
  const { setNotifs } = useStore();
  const unreadNotifs = notifs.filter(n => !n.read).length;
  return (<>
    <motion.header initial={{ y:-30, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:.6 }} className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 mt-3">
        <div className="glass px-4 md:px-6 py-3 flex items-center justify-between">
          <button onClick={()=>setPage("home")} className="flex items-center gap-2 font-display text-lg">
            <span className="relative inline-flex w-9 h-9 rounded-xl items-center justify-center bg-gradient-to-br from-cyan-400/30 to-purple-500/30 border border-cyan-400/40">
              <Sparkles className="w-5 h-5 text-cyan-300" />
            </span>
            <span className="gradient-text">MUHAMMED<span className="text-white/90"> PP</span></span>
          </button>
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map(n => (
              <button key={n.key} onClick={()=>setPage(n.key)} className={`px-3 py-2 rounded-lg text-sm transition ${page===n.key ? "text-cyan-300 bg-cyan-400/10" : "text-white/70 hover:text-white"}`}>{n.label}</button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={()=>setPage("search")} className="p-2 rounded-lg hover:bg-white/5" aria-label="Search"><Search className="w-5 h-5" /></button>
            {currentUser ? <>
              <div className="relative">
                <button onClick={()=>{ setNotifs(notifs.map(n=>({...n, read:true}))); setPanel(panel==="notif"?null:"notif"); }} className="relative p-2 rounded-lg hover:bg-white/5" aria-label="Notifications">
                  <Bell className="w-5 h-5" />
                  {unreadNotifs>0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_10px_rgba(236,72,153,.8)]" />}
                </button>
                <AnimatePresence>
                  {panel==="notif" && <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} className="absolute right-0 mt-2 w-80 glass p-3 max-h-96 overflow-auto">
                    <div className="text-xs uppercase tracking-widest text-cyan-300 mb-2">Notifications</div>
                    {notifs.length===0 && <div className="text-sm text-white/60">No notifications yet.</div>}
                    {notifs.map(n => (
                      <div key={n.id} className="text-sm py-2 border-b border-white/10 last:border-0">
                        <div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${n.kind==="message"?"bg-cyan-400":n.kind==="follower"?"bg-purple-400":n.kind==="comment"?"bg-pink-400":"bg-amber-400"}`} /><span>{n.text}</span></div>
                        <div className="text-[11px] text-white/40 mt-1">{new Date(n.at).toLocaleString()}</div>
                      </div>
                    ))}
                  </motion.div>}
                </AnimatePresence>
              </div>
              {(currentUser.role==="admin"||currentUser.role==="superadmin") && <button onClick={()=>setPage("admin")} className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-purple-500/20 border border-purple-400/40 text-purple-200 text-sm" data-cursor="hover"><LayoutDashboard className="w-4 h-4"/>Admin</button>}
              <div className="relative">
                <button onClick={()=>setPanel(panel==="profile"?null:"profile")} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-white/10 hover:border-cyan-400/40" data-cursor="hover">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 grid place-items-center text-xs font-bold text-black">{currentUser.name.slice(0,1)}</span>
                  <span className="text-sm hidden md:inline">{currentUser.name.split(" ")[0]}</span>
                </button>
                <AnimatePresence>
                  {panel==="profile" && <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} className="absolute right-0 mt-2 w-56 glass p-2">
                    <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-sm flex items-center gap-2" onClick={()=>setPage("profile")}><UserCircle2 className="w-4 h-4"/>My Profile</button>
                    {(currentUser.role==="admin"||currentUser.role==="superadmin") && <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-sm flex items-center gap-2" onClick={()=>setPage("admin")}><LayoutDashboard className="w-4 h-4"/>Admin Dashboard</button>}
                    <div className="divider my-1"/>
                    <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-sm flex items-center gap-2 text-rose-300" onClick={()=>{ logout(); setPanel(null); setPage("home"); }}><LogOut className="w-4 h-4"/>Sign out</button>
                  </motion.div>}
                </AnimatePresence>
              </div>
            </> : <>
              <button onClick={()=>setPage("login")} className="btn-ghost text-sm !py-2 !px-3" data-cursor="hover"><LogIn className="w-4 h-4"/>Sign in</button>
            </>}
            <button className="lg:hidden p-2" onClick={()=>setOpen(o=>!o)} aria-label="Menu">{open?<X/>:<Menu/>}</button>
          </div>
        </div>
        <AnimatePresence>
          {open && <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="glass mt-2 overflow-hidden lg:hidden">
            <div className="p-3 grid grid-cols-2 gap-1">
              {NAV.map(n=><button key={n.key} onClick={()=>{ setPage(n.key); setOpen(false); }} className={`text-left px-3 py-2 rounded-lg text-sm ${page===n.key?"bg-cyan-400/10 text-cyan-300":"hover:bg-white/5"}`}>{n.label}</button>)}
              {currentUser && (currentUser.role==="admin"||currentUser.role==="superadmin") && <button onClick={()=>{ setPage("admin"); setOpen(false); }} className="text-left px-3 py-2 rounded-lg text-sm bg-purple-500/10 text-purple-200">Admin Panel</button>}
            </div>
          </motion.div>}
        </AnimatePresence>
      </div>
    </motion.header>
    <div className="h-24" />
  </>);
}
