import { useEffect, useState } from "react";
import { StoreProvider, useStore } from "./store";
import { ParticleField, Nav } from "./components";
import { HomePage } from "./pages";
import { ProjectsPage, AchievementsPage, EventsPage, GalleryPage, FilesPage, ContactPage, AuthPage, ProfilePage, SearchPage, MessagesPage } from "./more";
import { AdminPage } from "./admin";
import { VideosPage, TimelinePage, LoadingScreen, NotifToasts } from "./extras";
import { AnimatePresence, motion } from "framer-motion";
import { Code2, Briefcase, AtSign, Heart, Sparkles, ArrowUp, Globe } from "lucide-react";
import { Analytics } from "./api";
import { FirebaseProvider } from "./firebase-provider";

const pageVariants = { initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, exit:{opacity:0,y:-10} };

function Footer({ setPage }:{setPage:(p:string)=>void}) {
  return (
    <footer className="mt-20 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-display text-lg"><span className="w-9 h-9 rounded-xl grid place-items-center bg-gradient-to-br from-cyan-400/30 to-purple-500/30 border border-cyan-400/40"><Sparkles className="w-5 h-5 text-cyan-300"/></span>MUHAMMED PP</div>
          <p className="text-white/60 text-sm mt-3 max-w-xs">Technology Enthusiast · Web Developer · AI Explorer · Future Network Administrator.</p>
          <div className="flex gap-2 mt-4">
            <a href="#" className="w-9 h-9 rounded-lg glass grid place-items-center hover:text-cyan-300" data-cursor="hover" aria-label="GitHub"><Code2 className="w-4 h-4"/></a>
            <a href="#" className="w-9 h-9 rounded-lg glass grid place-items-center hover:text-cyan-300" data-cursor="hover" aria-label="LinkedIn"><Briefcase className="w-4 h-4"/></a>
            <a href="#" className="w-9 h-9 rounded-lg glass grid place-items-center hover:text-cyan-300" data-cursor="hover" aria-label="Twitter/X"><AtSign className="w-4 h-4"/></a>
            <a href="#" className="w-9 h-9 rounded-lg glass grid place-items-center hover:text-cyan-300" data-cursor="hover" aria-label="Website"><Globe className="w-4 h-4"/></a>
          </div>
        </div>
        <div>
          <div className="font-display mb-3 text-sm uppercase tracking-wider text-cyan-300">Navigate</div>
          <ul className="space-y-1.5 text-sm">
            {["home","about","skills","projects","achievements","events","gallery","files","contact"].map(k=><li key={k}><button onClick={()=>setPage(k)} className="text-white/70 hover:text-white">{k.charAt(0).toUpperCase()+k.slice(1)}</button></li>)}
          </ul>
        </div>
        <div>
          <div className="font-display mb-3 text-sm uppercase tracking-wider text-cyan-300">Platform</div>
          <ul className="space-y-1.5 text-sm">
            <li><button onClick={()=>setPage("login")} className="text-white/70 hover:text-white">Sign in</button></li>
            <li><button onClick={()=>setPage("admin")} className="text-white/70 hover:text-white">Admin</button></li>
            <li><button onClick={()=>setPage("search")} className="text-white/70 hover:text-white">Search</button></li>
          </ul>
        </div>
        <div>
          <div className="font-display mb-3 text-sm uppercase tracking-wider text-cyan-300">Stay in touch</div>
          <p className="text-white/60 text-sm">Available for freelance and full-time work globally.</p>
          <button onClick={()=>setPage("contact")} className="btn-neon mt-4" data-cursor="hover">Contact <ArrowUp className="w-4 h-4 rotate-45"/></button>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <div>© {new Date().getFullYear()} Muhammed PP. All rights reserved.</div>
          <div className="flex items-center gap-1">Built with <Heart className="w-3 h-3 text-pink-400 fill-pink-400"/> using React, Tailwind & Framer Motion.</div>
        </div>
      </div>
    </footer>
  );
}

function Shell() {
  const [page, setPage] = useState<string>(() => window.location.hash.replace("#","") || "login");
  const [authMode, setAuthMode] = useState<"login"|"register">("login");
  const { currentUser } = useStore();
  const isAuth = page === "login" || page === "register";

  useEffect(() => { window.location.hash = page; }, [page]);
  useEffect(() => {
    if (page === "about" || page === "skills") {
      setPage("home");
      setTimeout(() => {
        const el = document.getElementById(page);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    Analytics.track("page_view", page);
  }, [page]);

  const go = (p: string) => setPage(p);

  const pageMap: Record<string, React.ReactElement> = {
    home: <HomePage setPage={go}/>,
    about: <HomePage setPage={go}/>,
    skills: <HomePage setPage={go}/>,
    timeline: <TimelinePage/>,
    projects: <ProjectsPage/>,
    achievements: <AchievementsPage/>,
    events: <EventsPage/>,
    gallery: <GalleryPage/>,
    videos: <VideosPage/>,
    files: <FilesPage/>,
    contact: <ContactPage/>,
    login: <AuthPage mode={authMode} setMode={setAuthMode} setPage={setPage}/>,
    register: <AuthPage mode={authMode} setMode={setAuthMode} setPage={setPage}/>,
    profile: <ProfilePage setPage={setPage}/>,
    admin: <AdminPage/>,
    search: <SearchPage setPage={setPage}/>,
    messages: <MessagesPage/>,
  };

  return (
    <div className="relative min-h-screen z-10">
      <ParticleField/>
      <LoadingScreen/>
      {!isAuth && <Nav page={page} setPage={setPage}/>}
      <NotifToasts/>
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div key={page} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{duration:.35}}>
            {pageMap[page] || pageMap.home}
          </motion.div>
        </AnimatePresence>
      </main>
      {!isAuth && <Footer setPage={setPage}/>}
      {!currentUser && page!=="login" && page!=="register" && (
        <motion.button initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} onClick={()=>setPage("login")} className="fixed bottom-5 right-5 z-40 btn-neon" data-cursor="hover">Sign in</motion.button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <FirebaseProvider>
      <StoreProvider>
        <Shell />
      </StoreProvider>
    </FirebaseProvider>
  );
}
