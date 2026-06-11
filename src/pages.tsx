import { useEffect, useRef, useState } from "react";
import { useStore, Item } from "./store";
import { motion, useInView } from "framer-motion";
import {
  GitBranch, ExternalLink, Heart, Star, Trophy, Users, Mail, ArrowRight,
  Rocket, Shield, Cpu, Code, Palette, Wifi, Eye, Download, GraduationCap, Target, Sparkles as SparkleIcon, BookOpen
} from "lucide-react";
import { ThreeHero } from "./three-bg";

export const pageVariants = { initial:{opacity:0,y:24}, animate:{opacity:1,y:0}, exit:{opacity:0,y:-20} };

export const Section = ({ children, id, className=""}:{children:any;id?:string;className?:string}) => (
  <section id={id} className={`relative mx-auto max-w-7xl px-4 md:px-6 py-14 ${className}`}>{children}</section>
);

export const StatPill = ({ n, l, icon }:{n:string|number;l:string;icon?:any}) => (
  <div className="glass glass-hover px-4 py-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-xl grid place-items-center bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-cyan-300">{icon}</div>
    <div><div className="font-display text-lg text-white">{n}</div><div className="text-[11px] uppercase tracking-wider text-white/60">{l}</div></div>
  </div>
);

const ROLES = ["Web Developer", "AI Explorer", "Future Network Administrator", "Technology Enthusiast"];
function useTyping() {
  const [t, setT] = useState(""); const [i, setI] = useState(0); const [del, setDel] = useState(false);
  useEffect(() => {
    const word = ROLES[i % ROLES.length];
    const speed = del ? 40 : 90;
    const h = setTimeout(() => {
      if (!del) {
        setT(word.slice(0, t.length+1));
        if (t.length+1 === word.length) setTimeout(()=>setDel(true), 1200);
      } else {
        setT(word.slice(0, t.length-1));
        if (t.length-1 === 0) { setDel(false); setI(i+1); }
      }
    }, speed);
    return () => clearTimeout(h);
  }, [t, del, i]);
  return t;
}

/* ============ Timeline Section ============ */
function TimelineSection() {
  const { timeline } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className="relative pl-12">
      <div className="tl-rail"/>
      {timeline.map((e, i) => {
        const catColor = e.category==="achievement" ? "from-amber-400 to-rose-400" : e.category==="work" ? "from-cyan-400 to-blue-500" : e.category==="education" ? "from-purple-400 to-pink-400" : "from-cyan-400 to-purple-500";
        return (
          <motion.div key={e.id} initial={{opacity:0, x:-20}} animate={inView?{opacity:1,x:0}:{}} transition={{delay:i*.1}} className="relative mb-6">
            <div className={`absolute -left-[30px] top-1 w-6 h-6 rounded-full bg-gradient-to-br ${catColor} ring-4 ring-[#05060f] shadow-[0_0_18px_rgba(34,211,238,.6)]`}/>
            <div className="glass p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="font-display text-cyan-300 text-sm font-mono">{e.year}</div>
                <span className="chip uppercase">{e.category}</span>
              </div>
              <div className="font-medium text-lg mt-1">{e.title}</div>
              <div className="text-sm text-white/60 mt-1">{e.description}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function HomePage({ setPage }:{setPage:(p:string)=>void}) {
  const typed = useTyping();
  const { items, followers, currentUser, toggleFollow, ratings, about, timeline } = useStore();
  const projects = items.filter(i => i.type==="project");
  const avg = ratings.length ? (ratings.reduce((a,b)=>a+b.stars,0)/ratings.length).toFixed(1) : "0";

  return (<>
    {/* HERO */}
    <Section className="pt-6 !pb-4">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 glass min-h-[640px]">
        <div className="absolute inset-0 grid-bg opacity-40"/>
        <div className="absolute inset-0 noise"/>
        <ThreeHero/>
        <div className="relative grid lg:grid-cols-12 gap-8 items-center p-6 md:p-12">
          <motion.div initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} transition={{duration:.8}} className="lg:col-span-7 z-10">
            <div className="chip mb-6"><span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"/>{about.availability}</div>
            <div className="font-mono text-xs text-cyan-300 mb-2">{"> whoami"}</div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] font-black">
              {about.name.split(" ")[0]} <span className="gradient-text">{about.name.split(" ").slice(1).join(" ")}</span>
            </h1>
            <div className="mt-4 text-xl md:text-2xl text-white/80 font-mono">
              <span className="text-cyan-300">{">"}</span> {typed}<span className="inline-block w-[2px] h-5 align-middle bg-cyan-300 ml-1 animate-pulse"/>
            </div>
            <p className="mt-6 text-white/70 max-w-2xl">{about.bio}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={()=>setPage("projects")} className="btn-neon magnet" data-cursor="hover"><Rocket className="w-4 h-4"/>View Projects <ArrowRight className="w-4 h-4"/></button>
              <button onClick={()=>setPage("contact")} className="btn-ghost magnet" data-cursor="hover"><Mail className="w-4 h-4"/>Contact Me</button>
              <a href="#" onClick={(e)=>{e.preventDefault(); alert("Resume download queued.");}} className="btn-ghost magnet" data-cursor="hover"><Download className="w-4 h-4"/>Resume</a>
              <button onClick={()=>currentUser?toggleFollow():setPage("login")} className="btn-ghost magnet" data-cursor="hover"><Users className="w-4 h-4"/>{currentUser && followers.includes(currentUser.id)?"Following":"Follow Me"}</button>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <StatPill n={projects.length} l="Projects" icon={<Rocket className="w-4 h-4"/>}/>
              <StatPill n={followers.length} l="Followers" icon={<Users className="w-4 h-4"/>}/>
              <StatPill n={`${avg}★`} l="Rating" icon={<Star className="w-4 h-4"/>}/>
              <StatPill n={timeline.length} l="Milestones" icon={<Trophy className="w-4 h-4"/>}/>
            </div>
          </motion.div>
        </div>
        {/* marquee */}
        <div className="relative border-t border-white/5 py-3 overflow-hidden bg-black/40">
          <div className="marquee">
            <div>{Array.from({length:2}).map((_,g)=>(
              <div key={g} className="flex items-center gap-12 font-display text-sm text-white/40">
                {["NEXT.JS","REACT","THREE.JS","NODE.JS","TYPESCRIPT","MONGODB","JWT","CYBERSECURITY","AI/ML","TAILWINDCSS","FIREBASE","DOCKER","VERCEL","GSAP","FRAMER MOTION"].map(x =>
                  <span key={x+g} className="flex items-center gap-3"><SparkleIcon className="w-3 h-3 text-cyan-400"/>{x}</span>
                )}
              </div>
            ))}</div>
          </div>
        </div>
      </div>
    </Section>

    <Section>
      <SectionHeader kicker="// About" title="The Story So Far" sub="A chronicle of curiosity, code, and coffee."/>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 md:p-8">
            <p className="text-white/85 leading-relaxed text-lg">{about.bio}</p>
            <div className="mt-6 grid sm:grid-cols-3 gap-3">
              {[
                { icon:<Code className="w-5 h-5"/>, l:"50k+", s:"Lines of code" },
                { icon:<Rocket className="w-5 h-5"/>, l:"25+", s:"Projects shipped" },
                { icon:<Shield className="w-5 h-5"/>, l:"12+", s:"Certifications" },
              ].map((s,i)=>(
                <div key={i} className="glass p-4 flex items-center gap-3 glass-hover">
                  <div className="text-cyan-300">{s.icon}</div>
                  <div><div className="font-display text-xl">{s.l}</div><div className="text-xs text-white/60">{s.s}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass p-5">
              <div className="flex items-center gap-2 font-display text-cyan-300 text-sm mb-3"><GraduationCap className="w-4 h-4"/>Education</div>
              <ul className="space-y-3">
                {about.education.map((e,i)=>(
                  <li key={i} className="border-l-2 border-cyan-400/40 pl-3">
                    <div className="text-xs font-mono text-cyan-300">{e.period}</div>
                    <div className="font-medium text-sm">{e.school}</div>
                    <div className="text-xs text-white/60">{e.degree}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass p-5">
              <div className="flex items-center gap-2 font-display text-cyan-300 text-sm mb-3"><Target className="w-4 h-4"/>Career Goals</div>
              <ul className="space-y-2">{about.careerGoals.map((g,i)=>(<li key={i} className="flex items-start gap-2 text-sm text-white/80"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-400"/>{g}</li>))}</ul>
              <div className="flex items-center gap-2 font-display text-cyan-300 text-sm mb-3 mt-5"><BookOpen className="w-4 h-4"/>Interests</div>
              <div className="flex flex-wrap gap-2">{about.interests.map(x=><span key={x} className="chip">{x}</span>)}</div>
            </div>
          </div>
        </div>
        <div className="glass p-5"><TimelineSection/></div>
      </div>
    </Section>

    <Section>
      <SectionHeader kicker="// Skills" title="My Tech Stack & Craft" sub="The tools I use to shape digital futures."/>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { t:"Programming", c:"from-cyan-500/30 to-cyan-700/10", icon:<Code/>, s:["HTML","CSS","JavaScript"] },
          { t:"Technology", c:"from-purple-500/30 to-purple-700/10", icon:<Cpu/>, s:["Networking","Cybersecurity","AI Tools","Firebase","Node.js","Computer Hardware"] },
          { t:"Design", c:"from-pink-500/30 to-pink-700/10", icon:<Palette/>, s:["Graphic Design","UI/UX Design"] },
          { t:"Infrastructure", c:"from-blue-500/30 to-blue-700/10", icon:<Wifi/>, s:["Cloud","Security","DevOps"] },
        ].map((g,i)=>(
          <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay:i*.1}} viewport={{once:true}} className="glass glass-hover p-5">
            <div className={`w-12 h-12 rounded-xl grid place-items-center mb-4 bg-gradient-to-br ${g.c} text-cyan-200`}>{g.icon}</div>
            <div className="font-display text-lg mb-3">{g.t}</div>
            <ul className="space-y-2">
              {g.s.map(sk=><li key={sk} className="flex items-center gap-2 text-sm text-white/75"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"/>{sk}</li>)}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>

    <Section>
      <SectionHeader kicker="// Featured Work" title="Selected Projects" sub={<span>Explore all <button onClick={()=>setPage("projects")} className="underline text-cyan-300">projects →</button></span>}/>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.filter(p=>p.featured).slice(0,3).map((p,i)=><ProjectCard key={p.id} item={p} i={i}/>)}
      </div>
    </Section>

    <Testimonials/>

    <Section>
      <div className="glass p-8 md:p-12 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-cyan-500/20 blur-3xl"/>
        <div className="absolute -left-20 -bottom-20 w-60 h-60 rounded-full bg-purple-500/20 blur-3xl"/>
        <div className="relative grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="font-display text-3xl md:text-4xl">Let's build the <span className="gradient-text">future</span> together.</h3>
            <p className="text-white/70 mt-3">Open for freelance, collaborations, and full-time opportunities.</p>
          </div>
          <div className="flex gap-3 md:justify-end flex-wrap">
            <button onClick={()=>setPage("contact")} className="btn-neon" data-cursor="hover">Start a project <ArrowRight className="w-4 h-4"/></button>
            <button onClick={()=>setPage("files")} className="btn-ghost" data-cursor="hover">Resume</button>
          </div>
        </div>
      </div>
    </Section>
  </>);
}

function SectionHeader({ kicker, title, sub }:{kicker:string;title:string;sub?:any}) {
  return <motion.div initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="mb-10 flex items-end justify-between gap-4 flex-wrap">
    <div>
      <div className="text-sm font-mono text-cyan-300">{kicker}</div>
      <h2 className="font-display text-3xl md:text-4xl mt-1">{title}</h2>
    </div>
    {sub && <div className="text-white/60 max-w-md text-sm">{sub}</div>}
  </motion.div>;
}

export function ProjectCard({ item, i=0 }:{item:Item; i?:number}) {
  const { currentUser, toggleLike, toggleFavorite, favorites } = useStore();
  const liked = currentUser ? (item.likes||[]).includes(currentUser.id) : false;
  const fav = favorites.includes(item.id);
  return (
    <motion.article initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay:i*.06}} viewport={{once:true}} whileHover={{y:-6}} className="glass glass-hover overflow-hidden group">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"/>
        <div className="absolute top-3 left-3 chip">{item.category}</div>
        {item.featured && <div className="absolute top-3 right-3 chip !bg-pink-500/20 !border-pink-400/40 !text-pink-200"><Trophy className="w-3 h-3"/>Featured</div>}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg">{item.title}</h3>
        <p className="text-white/60 text-sm mt-1 line-clamp-2">{item.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {(item.tags||[]).map(t=><span key={t} className="text-[10px] font-mono px-2 py-1 rounded-md bg-white/5 border border-white/10">{t}</span>)}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3 text-white/60 text-xs">
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5"/>{item.views||0}</span>
            <span className="flex items-center gap-1"><Heart className={`w-3.5 h-3.5 ${liked?"fill-pink-400 text-pink-400":""}`}/>{(item.likes||[]).length}</span>
          </div>
          <div className="flex gap-1">
            <button onClick={()=>toggleLike(item.id)} className="p-2 rounded-lg hover:bg-white/10" data-cursor="hover" aria-label="Like"><Heart className={`w-4 h-4 ${liked?"fill-pink-400 text-pink-400":""}`}/></button>
            <button onClick={()=>toggleFavorite(item.id)} className="p-2 rounded-lg hover:bg-white/10" data-cursor="hover" aria-label="Favourite"><Star className={`w-4 h-4 ${fav?"fill-amber-300 text-amber-300":""}`}/></button>
            {item.source && <a href={item.source} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-white/10" data-cursor="hover"><GitBranch className="w-4 h-4"/></a>}
            {item.demo && <a href={item.demo} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-white/10" data-cursor="hover"><ExternalLink className="w-4 h-4"/></a>}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function Testimonials() {
  const { testimonials, addTestimonial } = useStore();
  const [f, setF] = useState({ name:"", role:"", text:"" });
  const [done, setDone] = useState(false);
  const approved = testimonials.filter(t=>t.approved);
  return (<Section>
    <SectionHeader kicker="// Testimonials" title="What People Say"/>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {approved.map((t,i)=>(
        <motion.div key={t.id} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08}} className="glass p-5">
          <div className="flex gap-1 text-amber-300">{Array.from({length:5}).map((_,i)=><Star key={i} className="w-4 h-4 fill-current"/>)}</div>
          <p className="text-white/80 mt-3 text-sm leading-relaxed">"{t.text}"</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 grid place-items-center font-bold text-black">{t.name.slice(0,1)}</div>
            <div><div className="text-sm">{t.name}</div><div className="text-xs text-white/50">{t.role}</div></div>
          </div>
        </motion.div>
      ))}
    </div>
    <div className="glass p-5 mt-6">
      <div className="font-display text-lg mb-3">Leave a testimonial</div>
      {done ? <div className="text-emerald-300 text-sm">Thanks! Your testimonial is pending approval.</div>
      : <form onSubmit={e=>{e.preventDefault(); if(!f.name||!f.text) return; addTestimonial(f); setF({name:"",role:"",text:""}); setDone(true);}} className="grid md:grid-cols-3 gap-3">
        <input className="input md:col-span-1" placeholder="Your name" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/>
        <input className="input md:col-span-1" placeholder="Role / Title" value={f.role} onChange={e=>setF({...f,role:e.target.value})}/>
        <input className="input md:col-span-1" placeholder="5 stars" value="★★★★★" disabled/>
        <textarea className="input md:col-span-3" rows={3} placeholder="Share your experience..." value={f.text} onChange={e=>setF({...f,text:e.target.value})}/>
        <button className="btn-neon md:col-span-3" data-cursor="hover">Submit for approval</button>
      </form>}
    </div>
  </Section>);
}
