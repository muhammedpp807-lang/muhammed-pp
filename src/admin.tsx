import { useState } from "react";
import { useStore, Item } from "./store";
import { motion, AnimatePresence } from "framer-motion";
import { Section as Sec } from "./pages";
import {
  LayoutDashboard, Users, Award as AwardIcon, Calendar, Image as ImageIcon,
  FileText, MessageCircle, Star, FolderKanban, Activity, Trash2, Plus, Edit, Check, X,
  Shield, Search as SearchIcon, Sparkles, Settings, Globe, Clock, Film,
  GraduationCap, Code, Target, Upload
} from "lucide-react";
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid
} from "recharts";

const TABS = [
  { k:"overview", l:"Overview", i:<LayoutDashboard className="w-4 h-4"/> },
  { k:"cms", l:"Site Content", i:<Globe className="w-4 h-4"/> },
  { k:"projects", l:"Projects", i:<FolderKanban className="w-4 h-4"/> },
  { k:"achievements", l:"Achievements", i:<AwardIcon className="w-4 h-4"/> },
  { k:"events", l:"Events", i:<Calendar className="w-4 h-4"/> },
  { k:"gallery", l:"Gallery", i:<ImageIcon className="w-4 h-4"/> },
  { k:"videos", l:"Videos", i:<Film className="w-4 h-4"/> },
  { k:"files", l:"Files", i:<FileText className="w-4 h-4"/> },
  { k:"users", l:"Users", i:<Users className="w-4 h-4"/> },
  { k:"messages", l:"Messages", i:<MessageCircle className="w-4 h-4"/> },
  { k:"comments", l:"Comments", i:<MessageCircle className="w-4 h-4"/> },
  { k:"ratings", l:"Ratings", i:<Star className="w-4 h-4"/> },
  { k:"timeline", l:"Timeline", i:<Clock className="w-4 h-4"/> },
  { k:"settings", l:"Settings", i:<Settings className="w-4 h-4"/> },
];

export function AdminPage() {
  const { currentUser, messages, comments } = useStore();
  const [tab, setTab] = useState("overview");
  const unreadMsgs = messages.filter(m=>!m.read).length;
  const pendingComments = comments.filter(c=>!c.approved).length;
  if (!currentUser || (currentUser.role!=="admin" && currentUser.role!=="superadmin")) {
    return <Sec><div className="glass p-8 text-center"><Shield className="w-12 h-12 mx-auto text-rose-400"/><h2 className="mt-3 font-display text-2xl">Restricted</h2><p className="text-white/60 mt-2">You need admin privileges to access this area.</p></div></Sec>;
  }
  return (<Sec>
    <div className="grid lg:grid-cols-[240px_1fr] gap-5">
      <aside className="glass p-3 h-fit lg:sticky lg:top-28">
        <div className="flex items-center gap-2 px-2 py-3"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 grid place-items-center"><Sparkles className="w-4 h-4 text-black"/></div><div><div className="font-display">Control Center</div><div className="text-[10px] uppercase text-white/50">{currentUser.role}</div></div></div>
        <nav className="mt-2 space-y-0.5">
          {TABS.filter(t => currentUser.role==="superadmin" || !["users"].includes(t.k)).map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${tab===t.k?"bg-cyan-400/20 text-cyan-200":"hover:bg-white/5 text-white/75"}`}>
              <span>{t.i}</span>{t.l}
              {t.k==="messages" && unreadMsgs>0 && <span className="ml-auto w-5 h-5 rounded-full bg-pink-500 text-[10px] grid place-items-center font-bold">{unreadMsgs}</span>}
              {t.k==="comments" && pendingComments>0 && <span className="ml-auto w-5 h-5 rounded-full bg-amber-500 text-[10px] grid place-items-center font-bold">{pendingComments}</span>}
            </button>
          ))}
        </nav>
      </aside>
      <div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>
            {tab==="overview" && <Overview/>}
            {tab==="cms" && <CMSManager/>}
            {tab==="projects" && <ItemManager type="project" title="Projects"/>}
            {tab==="achievements" && <ItemManager type="achievement" title="Achievements"/>}
            {tab==="events" && <ItemManager type="event" title="Events"/>}
            {tab==="gallery" && <ItemManager type="gallery" title="Gallery"/>}
            {tab==="videos" && <VideosAdmin/>}
            {tab==="files" && <ItemManager type="file" title="Files"/>}
            {tab==="users" && <UsersManager/>}
            {tab==="messages" && <MessagesAdmin/>}
            {tab==="comments" && <CommentsAdmin/>}
            {tab==="ratings" && <RatingsAdmin/>}
            {tab==="timeline" && <TimelineAdmin/>}
            {tab==="settings" && <SettingsAdmin/>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </Sec>);
}

function Overview() {
  const { items, users, messages, comments, ratings, followers, currentUser } = useStore();
  const projects = items.filter(i=>i.type==="project").length;
  const achievements = items.filter(i=>i.type==="achievement").length;
  const events = items.filter(i=>i.type==="event").length;
  const unread = messages.filter(m=>!m.read).length;
  const pending = comments.filter(c=>!c.approved).length;
  const avg = ratings.length ? (ratings.reduce((a,b)=>a+b.stars,0)/ratings.length).toFixed(1) : "0";

  // fake timeseries
  const visitors = Array.from({length:14}).map((_,i)=>({ day:`${i+1}`, v: Math.round(200+Math.sin(i/2)*60+i*8+Math.random()*40), f: Math.round(50+Math.cos(i/3)*20+i*4) }));
  const activity = [
    { name:"Projects", v: projects }, { name:"Events", v: events }, { name:"Achievements", v: achievements }, { name:"Files", v: items.filter(i=>i.type==="file").length }
  ];
  const sources = [
    { name:"Direct", value: 40 }, { name:"Social", value: 28 }, { name:"Search", value: 22 }, { name:"Referral", value: 10 },
  ];
  const colors = ["#22d3ee","#a855f7","#ec4899","#3b82f6"];

  const widgets = [
    { l:"Total Users", v: users.length, i:<Users className="w-5 h-5"/>, c:"from-cyan-500/30 to-cyan-800/10" },
    { l:"Total Followers", v: followers.length, i:<Users className="w-5 h-5"/>, c:"from-purple-500/30 to-purple-800/10" },
    { l:"Total Projects", v: projects, i:<FolderKanban className="w-5 h-5"/>, c:"from-pink-500/30 to-pink-800/10" },
    { l:"Total Messages", v: messages.length, i:<MessageCircle className="w-5 h-5"/>, c:"from-blue-500/30 to-blue-800/10" },
    { l:"Unread Messages", v: unread, i:<MessageCircle className="w-5 h-5"/>, c:"from-amber-500/30 to-amber-800/10" },
    { l:"Pending Comments", v: pending, i:<MessageCircle className="w-5 h-5"/>, c:"from-rose-500/30 to-rose-800/10" },
    { l:"Avg. Rating", v: `${avg}★`, i:<Star className="w-5 h-5"/>, c:"from-emerald-500/30 to-emerald-800/10" },
    { l:"Achievements", v: achievements, i:<AwardIcon className="w-5 h-5"/>, c:"from-indigo-500/30 to-indigo-800/10" },
  ];

  return (<>
    <div className="flex items-center justify-between mb-4">
      <div><div className="text-xs text-cyan-300 font-mono">// Welcome back</div><h1 className="font-display text-3xl">Hello, {currentUser?.name.split(" ")[0]} 👋</h1></div>
      <div className="chip"><Activity className="w-3 h-3"/>System online</div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      {widgets.map((w,i)=>(
        <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*.04}} className={`glass p-4 relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${w.c} opacity-30`}/>
          <div className="relative"><div className="text-cyan-200">{w.i}</div><div className="font-display text-2xl mt-1">{w.v}</div><div className="text-[11px] uppercase tracking-wider text-white/60">{w.l}</div></div>
        </motion.div>
      ))}
    </div>
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="glass p-5 lg:col-span-2">
        <div className="flex items-center justify-between mb-3"><div className="font-display">Visitors & Followers</div><div className="text-xs text-white/50">Last 14 days</div></div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={visitors}>
            <defs>
              <linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22d3ee" stopOpacity={.6}/><stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/></linearGradient>
              <linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a855f7" stopOpacity={.6}/><stop offset="95%" stopColor="#a855f7" stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/>
            <XAxis dataKey="day" stroke="rgba(255,255,255,.4)" fontSize={11}/>
            <YAxis stroke="rgba(255,255,255,.4)" fontSize={11}/>
            <Tooltip contentStyle={{ background:"#0a0d1f", border:"1px solid rgba(120,160,255,.25)", borderRadius:10 }}/>
            <Area type="monotone" dataKey="v" stroke="#22d3ee" fill="url(#v)"/>
            <Area type="monotone" dataKey="f" stroke="#a855f7" fill="url(#f)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="glass p-5">
        <div className="font-display mb-3">Content Distribution</div>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={sources} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={4}>
              {sources.map((_,i)=><Cell key={i} fill={colors[i]}/>)}
            </Pie>
            <Tooltip contentStyle={{ background:"#0a0d1f", border:"1px solid rgba(120,160,255,.25)", borderRadius:10 }}/>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-2 justify-center">{sources.map((s,i)=><span key={s.name} className="chip" style={{color:colors[i], borderColor:colors[i]+"66", background:colors[i]+"22"}}>{s.name}</span>)}</div>
      </div>
      <div className="glass p-5 lg:col-span-3">
        <div className="font-display mb-3">Content by Type</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={activity}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/>
            <XAxis dataKey="name" stroke="rgba(255,255,255,.4)" fontSize={11}/>
            <YAxis stroke="rgba(255,255,255,.4)" fontSize={11}/>
            <Tooltip contentStyle={{ background:"#0a0d1f", border:"1px solid rgba(120,160,255,.25)", borderRadius:10 }}/>
            <Bar dataKey="v" fill="#22d3ee" radius={[8,8,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </>);
}

/* ============== Item Manager ============== */
function ItemManager({ type, title }:{type:Item["type"]; title:string}) {
  const { items, addItem, updateItem, deleteItem } = useStore();
  const [q, setQ] = useState(""); const [cat, setCat] = useState(""); const [editing, setEditing] = useState<Item|null>(null); const [creating, setCreating] = useState(false);
  const list = items.filter(i=>i.type===type);
  const cats = Array.from(new Set(list.map(p=>p.category||"")));
  const filtered = list.filter(i=>(!cat||i.category===cat)&&(!q||i.title.toLowerCase().includes(q.toLowerCase())));
  return (<>
    <div className="flex items-center justify-between mb-4">
      <h1 className="font-display text-2xl">{title}</h1>
      <button onClick={()=>setCreating(true)} className="btn-neon !py-2 !px-4" data-cursor="hover"><Plus className="w-4 h-4"/>Add {title.slice(0,-1)}</button>
    </div>
    <div className="glass p-3 flex flex-wrap gap-2 mb-4">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 flex-1 min-w-[200px]"><SearchIcon className="w-4 h-4 text-white/60"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder={`Search ${title.toLowerCase()}...`} className="bg-transparent flex-1 text-sm placeholder:text-white/40"/></div>
      <select value={cat} onChange={e=>setCat(e.target.value)} className="input !py-2 !w-auto">
        <option value="">All categories</option>{cats.map(c=><option key={c} value={c}>{c}</option>)}
      </select>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map(i=>(
        <div key={i.id} className="glass overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-cyan-500/20 to-purple-500/20 relative">
            {i.image && <img src={i.image} className="w-full h-full object-cover" alt=""/>}
            <div className="absolute top-2 left-2 chip">{i.category}</div>
          </div>
          <div className="p-4">
            <div className="font-medium line-clamp-1">{i.title}</div>
            <p className="text-xs text-white/60 line-clamp-2 mt-1">{i.description}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={()=>setEditing(i)} className="btn-ghost !py-1.5 !px-3 text-xs" data-cursor="hover"><Edit className="w-3.5 h-3.5"/>Edit</button>
              <button onClick={()=>{ if(confirm("Delete?")) deleteItem(i.id); }} className="btn-ghost !py-1.5 !px-3 text-xs !text-rose-300" data-cursor="hover"><Trash2 className="w-3.5 h-3.5"/>Delete</button>
            </div>
          </div>
        </div>
      ))}
      {filtered.length===0 && <div className="col-span-full text-center text-white/50 py-16">No entries.</div>}
    </div>
    {(editing||creating) && <ItemForm item={editing} type={type} onClose={()=>{setEditing(null); setCreating(false);}} onSave={(data)=>{
      if (editing) updateItem(editing.id, data); else addItem({ type, ...data } as any);
      setEditing(null); setCreating(false);
    }}/>}
  </>);
}

function ItemForm({ item, type, onClose, onSave }:{item:Item|null; type:Item["type"]; onClose:()=>void; onSave:(d:any)=>void}) {
  const atts = item?.attachments || [];
  const [f, setF] = useState<any>({
    title: item?.title || "",
    description: item?.description || "",
    category: item?.category || (type==="project"?"Web App":type==="achievement"?"Certification":type==="event"?"Conference":type==="gallery"?"General":"Document"),
    image: item?.image || "",
    images: item?.images || [],
    video: item?.video || "",
    tags: item?.tags?.join(",") || "",
    date: item?.date || "",
    location: item?.location || "",
    demo: item?.demo || "",
    source: item?.source || "",
    featured: !!item?.featured,
    attachments: atts.map(a=>({name:a.name, url:a.url, type:a.type})),
  });
  const [newAtt, setNewAtt] = useState({ name:"", url:"", type:"pdf" });
  const addAtt = () => { if(newAtt.name&&newAtt.url) { setF({...f,attachments:[...f.attachments,{...newAtt}]}); setNewAtt({name:"",url:"",type:"pdf"}); } };
  const delAtt = (i:number) => setF({...f,attachments:f.attachments.filter((_:any, j:number)=>j!==i)});

  // File upload handler — converts to data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, kind: "image" | "video" | "attachment") => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (kind === "image") {
        setF({ ...f, image: dataUrl });
      } else if (kind === "video") {
        setF({ ...f, video: dataUrl });
      } else {
        setF({ ...f, attachments: [...f.attachments, { name: file.name, url: dataUrl, type: file.name.split(".").pop() || "file" }] });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMultipleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setF((prev:any) => ({ ...prev, images: [...(prev.images||[]), reader.result as string] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const delImage = (i:number) => setF({...f, images: f.images.filter((_:any,j:number)=>j!==i)});

  const deleteImage = () => setF({...f, image: ""});
  const deleteVideo = () => setF({...f, video: ""});

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <motion.div initial={{scale:.9}} animate={{scale:1}} className="glass w-full max-w-2xl p-6 max-h-[90vh] overflow-auto" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl">{item?"Edit":"New"} {type}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5"><X className="w-5 h-5"/></button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="input sm:col-span-2" placeholder="Title" value={f.title} onChange={e=>setF({...f,title:e.target.value})}/>
          <textarea className="input sm:col-span-2" rows={3} placeholder="Description" value={f.description} onChange={e=>setF({...f,description:e.target.value})}/>
          <input className="input" placeholder="Category" value={f.category} onChange={e=>setF({...f,category:e.target.value})}/>
          <input className="input" placeholder="Tags (comma separated)" value={f.tags} onChange={e=>setF({...f,tags:e.target.value})}/>

          {/* COVER IMAGE — upload OR url */}
          <div className="sm:col-span-2 border border-white/10 rounded-xl p-3 space-y-2">
            <div className="font-display text-sm text-cyan-300">Cover Image</div>
            {f.image ? (
              <div className="relative inline-block">
                <img src={f.image} className="w-48 h-28 object-cover rounded-lg border border-white/10"/>
                <button onClick={deleteImage} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 grid place-items-center text-white"><X className="w-3.5 h-3.5"/></button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 items-center">
                <label className="btn-ghost cursor-pointer !py-2 !px-4">
                  <Upload className="w-4 h-4"/> Upload image
                  <input type="file" accept="image/*" className="hidden" onChange={e=>handleFileUpload(e,"image")}/>
                </label>
                <span className="text-xs text-white/40">or paste URL:</span>
                <input className="input flex-1 min-w-[200px]" placeholder="https://..." value={f.image} onChange={e=>setF({...f,image:e.target.value})}/>
              </div>
            )}
          </div>

          {/* VIDEO — upload OR url */}
          {(type === "project" || type === "event" || type === "gallery") && (
            <div className="sm:col-span-2 border border-white/10 rounded-xl p-3 space-y-2">
              <div className="font-display text-sm text-cyan-300">Video <span className="text-xs text-white/40">(optional)</span></div>
              {f.video ? (
                <div className="relative inline-block">
                  <video src={f.video} className="w-48 h-28 object-cover rounded-lg border border-white/10" controls/>
                  <button onClick={deleteVideo} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 grid place-items-center text-white"><X className="w-3.5 h-3.5"/></button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3 items-center">
                  <label className="btn-ghost cursor-pointer !py-2 !px-4">
                    <Film className="w-4 h-4"/> Upload video
                    <input type="file" accept="video/*" className="hidden" onChange={e=>handleFileUpload(e,"video")}/>
                  </label>
                  <span className="text-xs text-white/40">or paste URL:</span>
                  <input className="input flex-1 min-w-[200px]" placeholder="https://..." value={f.video} onChange={e=>setF({...f,video:e.target.value})}/>
                </div>
              )}
            </div>
          )}

          {/* EXTRA IMAGES for gallery/projects */}
          {(type === "gallery" || type === "project" || type === "event") && (
            <div className="sm:col-span-2 border border-white/10 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between"><div className="font-display text-sm text-cyan-300">Extra Images <span className="text-xs text-white/40">(optional)</span></div>
                <label className="btn-ghost cursor-pointer !py-1.5 !px-3 !text-xs">
                  <Plus className="w-3.5 h-3.5"/> Add images
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleMultipleImages}/>
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {f.images.map((img:string, i:number)=>(
                  <div key={i} className="relative"><img src={img} className="w-24 h-16 object-cover rounded-lg border border-white/10"/>
                    <button onClick={()=>delImage(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 grid place-items-center text-white"><X className="w-3 h-3"/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {type==="event" && <><input className="input" type="date" placeholder="Date" value={f.date} onChange={e=>setF({...f,date:e.target.value})}/><input className="input" placeholder="Location" value={f.location} onChange={e=>setF({...f,location:e.target.value})}/></>}
          {type==="project" && <><input className="input" placeholder="Live demo URL" value={f.demo} onChange={e=>setF({...f,demo:e.target.value})}/><input className="input" placeholder="Source/GitHub URL" value={f.source} onChange={e=>setF({...f,source:e.target.value})}/></>}
          {type==="achievement" && <input className="input" placeholder="Date (e.g. 2025-06-10)" value={f.date} onChange={e=>setF({...f,date:e.target.value})}/>}
          <label className="flex items-center gap-2 sm:col-span-2 text-sm"><input type="checkbox" checked={f.featured} onChange={e=>setF({...f,featured:e.target.checked})}/>Featured / Pinned</label>

          {/* Attachments */}
          <div className="sm:col-span-2 border-t border-white/10 pt-3">
            <div className="font-display text-sm mb-2 text-cyan-300">Attachments (certificates, PDFs, docs)</div>
            {f.attachments.map((att:any, i:number)=>(
              <div key={i} className="flex items-center gap-2 mb-2"><span className="chip text-xs">{att.type}</span><span className="text-xs text-white/70 truncate flex-1">{att.name}</span><button onClick={()=>delAtt(i)} className="p-1 rounded hover:bg-white/5 text-rose-300"><X className="w-3.5 h-3.5"/></button></div>
            ))}
            <div className="flex flex-wrap gap-2 mt-2 items-center">
              <label className="btn-ghost cursor-pointer !py-1.5 !px-3 !text-xs">
                <Upload className="w-3.5 h-3.5"/> Upload file
                <input type="file" accept=".pdf,.docx,.pptx,.xlsx,.zip,.txt" className="hidden" onChange={e=>handleFileUpload(e,"attachment")}/>
              </label>
              <span className="text-xs text-white/40">or add link:</span>
              <input className="input !py-1.5 flex-1 min-w-[140px] text-xs" placeholder="File name" value={newAtt.name} onChange={e=>setNewAtt({...newAtt,name:e.target.value})}/>
              <input className="input !py-1.5 flex-1 min-w-[200px] text-xs" placeholder="URL" value={newAtt.url} onChange={e=>setNewAtt({...newAtt,url:e.target.value})}/>
              <select className="input !py-1.5 !w-20 text-xs" value={newAtt.type} onChange={e=>setNewAtt({...newAtt,type:e.target.value})}>
                <option value="pdf">PDF</option><option value="docx">DOCX</option><option value="pptx">PPTX</option><option value="zip">ZIP</option><option value="link">Link</option>
              </select>
              <button type="button" onClick={addAtt} className="btn-neon !py-1.5 !px-3 !text-xs"><Plus className="w-3 h-3"/></button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={()=>onSave({ ...f, tags: f.tags ? f.tags.split(",").map((t:string)=>t.trim()).filter(Boolean) : [], image: f.image || undefined })} className="btn-neon"><Check className="w-4 h-4"/>Save</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============== USERS ============== */
function UsersManager() {
  const { users, setUsers, currentUser } = useStore();
  return (<>
    <h1 className="font-display text-2xl mb-4">Users</h1>
    <div className="glass overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-white/10 text-left text-white/60"><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Created</th><th className="p-3"></th></tr></thead>
        <tbody>
          {users.map(u=>(
            <tr key={u.id} className="border-b border-white/5">
              <td className="p-3 flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 grid place-items-center text-xs text-black font-bold">{u.name.slice(0,1)}</div>{u.name}</td>
              <td className="p-3 text-white/70">{u.email}</td>
              <td className="p-3"><select disabled={u.id===currentUser?.id} value={u.role} onChange={e=>setUsers(users.map(x=>x.id===u.id?{...x,role:e.target.value as any}:x))} className="input !py-1 !px-2 text-xs !w-auto">
                <option value="superadmin">Super Admin</option><option value="admin">Admin</option><option value="user">User</option>
              </select></td>
              <td className="p-3 text-white/50 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
              <td className="p-3 text-right">
                {u.id!==currentUser?.id && <button onClick={()=>{ if(confirm("Delete user?")) setUsers(users.filter(x=>x.id!==u.id)); }} className="p-2 rounded-lg hover:bg-white/5 text-rose-300"><Trash2 className="w-4 h-4"/></button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>);
}

/* ============== MESSAGES ============== */
function MessagesAdmin() {
  const { messages, setMessages } = useStore();
  const [sel, setSel] = useState<string|null>(null);
  const [reply, setReply] = useState("");
  const cur = messages.find(m=>m.id===sel);
  return (<>
    <h1 className="font-display text-2xl mb-4">Message Center</h1>
    <div className="grid md:grid-cols-3 gap-4">
      <div className="glass overflow-hidden">
        <div className="max-h-[60vh] overflow-auto">
          {messages.map(m=>(
            <button key={m.id} onClick={()=>{setSel(m.id); setMessages(messages.map(x=>x.id===m.id?{...x,read:true}:x));}} className={`w-full text-left p-3 border-b border-white/5 hover:bg-white/5 ${sel===m.id?"bg-white/5":""}`}>
              <div className="flex items-start gap-2">
                {!m.read && <span className="mt-1.5 w-2 h-2 rounded-full bg-cyan-400"/>}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{m.fromName}</div>
                  <div className="text-xs text-cyan-300 truncate">{m.subject}</div>
                </div>
              </div>
            </button>
          ))}
          {messages.length===0 && <div className="p-6 text-center text-white/40 text-sm">No messages</div>}
        </div>
      </div>
      <div className="md:col-span-2 glass p-5">
        {cur ? (<>
          <div className="flex justify-between">
            <div><div className="font-display text-xl">{cur.subject}</div><div className="text-xs text-white/60">{cur.fromName} · {cur.fromEmail}</div></div>
            <button onClick={()=>{ setMessages(messages.filter(m=>m.id!==cur.id)); setSel(null); }} className="btn-ghost !py-2 !px-3 text-xs !text-rose-300" data-cursor="hover"><Trash2 className="w-3.5 h-3.5"/></button>
          </div>
          <div className="divider my-4"/>
          <div className="text-white/85 whitespace-pre-wrap">{cur.body}</div>
          <div className="divider my-4"/>
          {cur.replies.map(r=>(
            <div key={r.id} className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/20 mb-2 ml-8">
              <div className="text-xs text-cyan-300 mb-1">{r.from} · {new Date(r.at).toLocaleString()}</div>
              <div className="text-sm">{r.body}</div>
            </div>
          ))}
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <textarea rows={2} className="input" placeholder="Reply..." value={reply} onChange={e=>setReply(e.target.value)}/>
            <button onClick={()=>{ if(!reply.trim()) return; setMessages(messages.map(m=>m.id===cur.id?{...m,replies:[...m.replies,{id:Math.random().toString(36).slice(2),from:"Admin",body:reply,at:new Date().toISOString(),admin:true}]}:m)); setReply(""); }} className="btn-neon" data-cursor="hover">Send</button>
          </div>
        </>) : <div className="text-center text-white/50 py-20">Select a message</div>}
      </div>
    </div>
  </>);
}

/* ============== COMMENTS ============== */
function CommentsAdmin() {
  const { comments, setComments } = useStore();
  return (<>
    <h1 className="font-display text-2xl mb-4">Comments</h1>
    <div className="space-y-3">
      {comments.map(c=>(
        <div key={c.id} className="glass p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1"><div className="text-sm"><span className="font-medium">{c.userName}</span> on <span className="text-cyan-300 text-xs">{c.targetType}:{c.targetId}</span></div>
            <p className="text-white/80 text-sm mt-1">{c.text}</p>
            <div className="text-xs text-white/40 mt-1">{new Date(c.createdAt).toLocaleString()}{c.pinned && <span className="chip ml-2">Pinned</span>}{!c.approved && <span className="chip ml-2 !bg-amber-500/20 !border-amber-400/30 !text-amber-200">Pending</span>}</div></div>
            <div className="flex flex-col gap-2">
              {!c.approved && <button onClick={()=>setComments(comments.map(x=>x.id===c.id?{...x,approved:true}:x))} className="btn-ghost !py-1.5 !px-3 text-xs" data-cursor="hover"><Check className="w-3.5 h-3.5"/>Approve</button>}
              <button onClick={()=>setComments(comments.map(x=>x.id===c.id?{...x,pinned:!x.pinned}:x))} className="btn-ghost !py-1.5 !px-3 text-xs" data-cursor="hover"><Star className="w-3.5 h-3.5"/>Pin</button>
              <button onClick={()=>setComments(comments.filter(x=>x.id!==c.id))} className="btn-ghost !py-1.5 !px-3 text-xs !text-rose-300" data-cursor="hover"><Trash2 className="w-3.5 h-3.5"/></button>
            </div>
          </div>
        </div>
      ))}
      {comments.length===0 && <div className="text-center text-white/50 py-16">No comments yet.</div>}
    </div>
  </>);
}

function RatingsAdmin() {
  const { ratings } = useStore();
  const avg = ratings.length ? (ratings.reduce((a,b)=>a+b.stars,0)/ratings.length).toFixed(2) : "0";
  const dist = [5,4,3,2,1].map(n=>({star:n, count: ratings.filter(r=>r.stars===n).length}));
  return (<>
    <h1 className="font-display text-2xl mb-4">Ratings & Analytics</h1>
    <div className="grid md:grid-cols-3 gap-4 mb-4">
      <div className="glass p-6 text-center"><div className="text-5xl font-display gradient-text">{avg}</div><div className="text-sm text-white/60">Average Rating</div></div>
      <div className="glass p-6 text-center"><div className="text-5xl font-display">{ratings.length}</div><div className="text-sm text-white/60">Total Ratings</div></div>
      <div className="glass p-6 text-center"><div className="text-5xl font-display text-amber-300">★★★★★</div><div className="text-sm text-white/60">Top Rating</div></div>
    </div>
    <div className="glass p-5">
      <div className="font-display mb-4">Distribution</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={dist}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/><XAxis dataKey="star" stroke="rgba(255,255,255,.4)"/><YAxis stroke="rgba(255,255,255,.4)"/><Tooltip contentStyle={{background:"#0a0d1f",border:"1px solid rgba(120,160,255,.25)",borderRadius:10}}/><Bar dataKey="count" fill="#a855f7" radius={[8,8,0,0]}/></BarChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2 max-h-60 overflow-auto">
        {ratings.map(r=>(
          <div key={r.id} className="flex items-center justify-between py-2 border-b border-white/5">
            <div className="text-sm">{r.user||"Anonymous"}</div>
            <div className="text-amber-300 text-sm">{"★".repeat(r.stars)}<span className="text-white/20">{"★".repeat(5-r.stars)}</span></div>
            <div className="text-xs text-white/40">{new Date(r.at).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  </>);
}

function SettingsAdmin() {
  const { reset } = useStore();
  return (<>
    <h1 className="font-display text-2xl mb-4">Website Settings</h1>
    <div className="glass p-6 space-y-4">
      <div><div className="font-display">Site Name</div><input className="input mt-2" defaultValue="Muhammed PP — Official Portfolio"/></div>
      <div><div className="font-display">Tagline</div><input className="input mt-2" defaultValue="Technology Enthusiast · Web Developer · AI Explorer"/></div>
      <div><div className="font-display">Contact Email</div><input className="input mt-2" defaultValue="hello@muhammedpp.dev"/></div>
      <div className="divider"/>
      <div><div className="font-display text-rose-300">Danger Zone</div>
        <button onClick={()=>{ if(confirm("Reset all demo data?")) reset(); }} className="btn-ghost mt-2 !text-rose-300" data-cursor="hover">Reset all demo data</button>
      </div>
    </div>
  </>);
}

/* ========== CMS Manager ========== */
function CMSManager() {
  const { about, setAbout } = useStore();
  const [a, setA] = useState(about);
  return (<>
    <h1 className="font-display text-2xl mb-4">Site Content (CMS)</h1>
    <div className="space-y-4">
      {/* Profile */}
      <div className="glass p-6 space-y-3">
        <div className="flex items-center gap-2 font-display text-sm text-cyan-300"><Sparkles className="w-4 h-4"/>Profile</div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><div className="text-xs text-cyan-300 font-mono mb-1">Name</div><input className="input" value={a.name} onChange={e=>setA({...a,name:e.target.value})}/></div>
          <div><div className="text-xs text-cyan-300 font-mono mb-1">Location</div><input className="input" value={a.location} onChange={e=>setA({...a,location:e.target.value})}/></div>
        </div>
        <div><div className="text-xs text-cyan-300 font-mono mb-1">Tagline</div><input className="input" value={a.tagline} onChange={e=>setA({...a,tagline:e.target.value})}/></div>
        <div><div className="text-xs text-cyan-300 font-mono mb-1">Bio</div><textarea rows={4} className="input" value={a.bio} onChange={e=>setA({...a,bio:e.target.value})}/></div>
        <div><div className="text-xs text-cyan-300 font-mono mb-1">Availability</div><input className="input" value={a.availability} onChange={e=>setA({...a,availability:e.target.value})}/></div>
        <div><div className="text-xs text-cyan-300 font-mono mb-1">Interests (comma separated)</div><input className="input" value={a.interests.join(", ")} onChange={e=>setA({...a,interests:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})}/></div>
      </div>

      {/* Education */}
      <div className="glass p-6 space-y-3">
        <div className="flex items-center justify-between"><div className="flex items-center gap-2 font-display text-sm text-cyan-300"><GraduationCap className="w-4 h-4"/>Education</div>
          <button onClick={()=>setA({...a,education:[...a.education,{period:"",school:"",degree:""}]})} className="btn-ghost !py-1.5 !px-3 text-xs" data-cursor="hover"><Plus className="w-3 h-3"/>Add</button>
        </div>
        {a.education.map((e,i)=>(
          <div key={i} className="grid grid-cols-12 gap-2">
            <input className="input col-span-3" placeholder="Period" value={e.period} onChange={ev=>{const n=[...a.education];n[i]={...n[i],period:ev.target.value};setA({...a,education:n})}}/>
            <input className="input col-span-3" placeholder="School" value={e.school} onChange={ev=>{const n=[...a.education];n[i]={...n[i],school:ev.target.value};setA({...a,education:n})}}/>
            <input className="input col-span-5" placeholder="Degree" value={e.degree} onChange={ev=>{const n=[...a.education];n[i]={...n[i],degree:ev.target.value};setA({...a,education:n})}}/>
            <button onClick={()=>setA({...a,education:a.education.filter((_,j)=>j!==i)})} className="col-span-1 p-2 rounded-lg hover:bg-white/5 text-rose-300"><Trash2 className="w-4 h-4"/></button>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="glass p-6 space-y-3">
        <div className="flex items-center justify-between"><div className="flex items-center gap-2 font-display text-sm text-cyan-300"><Code className="w-4 h-4"/>Skills</div>
          <button onClick={()=>setA({...a,skills:[...a.skills,{category:"New Category",items:[]}]})} className="btn-ghost !py-1.5 !px-3 text-xs" data-cursor="hover"><Plus className="w-3 h-3"/>Add skill group</button>
        </div>
        {a.skills.map((s,i)=>(
          <div key={i} className="border border-white/10 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2">
              <input className="input !py-1.5" placeholder="Category name" value={s.category} onChange={ev=>{const n=[...a.skills];n[i]={...n[i],category:ev.target.value};setA({...a,skills:n})}}/>
              <button onClick={()=>setA({...a,skills:a.skills.filter((_,j)=>j!==i)})} className="p-2 rounded-lg hover:bg-white/5 text-rose-300"><Trash2 className="w-4 h-4"/></button>
            </div>
            <div className="flex flex-wrap gap-1 items-center">
              {s.items.map((it,j)=>(
                <span key={j} className="chip !pr-1">{it} <button onClick={()=>{const n=[...a.skills];n[i]={...n[i],items:s.items.filter((_,x)=>x!==j)};setA({...a,skills:n})}} className="ml-1 text-rose-300 hover:text-rose-200"><X className="w-3 h-3"/></button></span>
              ))}
              <div className="flex items-center gap-1">
                <input className="bg-transparent border border-white/20 rounded-full px-2 py-0.5 text-xs w-24 placeholder:text-white/30" placeholder="+ skill" onKeyDown={ev=>{if(ev.key==="Enter"){const v=(ev.target as HTMLInputElement).value.trim();if(v){const n=[...a.skills];n[i]={...n[i],items:[...n[i].items,v]};setA({...a,skills:n});(ev.target as HTMLInputElement).value=""}}}}/>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Career Goals */}
      <div className="glass p-6 space-y-3">
        <div className="flex items-center justify-between"><div className="flex items-center gap-2 font-display text-sm text-cyan-300"><Target className="w-4 h-4"/>Career Goals</div>
          <button onClick={()=>setA({...a,careerGoals:[...a.careerGoals,""]})} className="btn-ghost !py-1.5 !px-3 text-xs" data-cursor="hover"><Plus className="w-3 h-3"/>Add goal</button>
        </div>
        {a.careerGoals.map((g,i)=>(
          <div key={i} className="flex items-center gap-2">
            <input className="input flex-1" value={g} onChange={ev=>{const n=[...a.careerGoals];n[i]=ev.target.value;setA({...a,careerGoals:n})}}/>
            <button onClick={()=>setA({...a,careerGoals:a.careerGoals.filter((_,j)=>j!==i)})} className="p-2 rounded-lg hover:bg-white/5 text-rose-300"><Trash2 className="w-4 h-4"/></button>
          </div>
        ))}
      </div>

      <div className="flex justify-end"><button onClick={()=>{ setAbout(a); }} className="btn-neon" data-cursor="hover"><Check className="w-4 h-4"/>Save all changes</button></div>
    </div>
  </>);
}

function VideosAdmin() {
  const { videos, addVideo, deleteVideo } = useStore();
  const [f, setF] = useState({ title:"", category:"Demo", url:"", thumb:"", source:"youtube" as const });
  const submit = (e:any) => { e.preventDefault(); if(!f.title||!f.url) return; addVideo(f); setF({ title:"", category:"Demo", url:"", thumb:"", source:"youtube" }); };
  return (<>
    <h1 className="font-display text-2xl mb-4">Videos</h1>
    <form onSubmit={submit} className="glass p-5 mb-4 grid md:grid-cols-5 gap-3">
      <input className="input md:col-span-2" placeholder="Title" value={f.title} onChange={e=>setF({...f,title:e.target.value})}/>
      <input className="input" placeholder="Category" value={f.category} onChange={e=>setF({...f,category:e.target.value})}/>
      <input className="input md:col-span-2" placeholder="YouTube / Vimeo embed URL" value={f.url} onChange={e=>setF({...f,url:e.target.value})}/>
      <input className="input md:col-span-4" placeholder="Thumbnail URL (optional)" value={f.thumb} onChange={e=>setF({...f,thumb:e.target.value})}/>
      <button className="btn-neon md:col-span-1" data-cursor="hover"><Plus className="w-4 h-4"/>Add</button>
    </form>
    <div className="space-y-2">
      {videos.map(v=>(
        <div key={v.id} className="glass p-3 flex items-center gap-3">
          {v.thumb && <img src={v.thumb} className="w-24 h-14 object-cover rounded-md"/>}
          <div className="flex-1 min-w-0"><div className="font-medium truncate">{v.title}</div><div className="text-xs text-white/60">{v.category} · {v.source}</div></div>
          <button onClick={()=>deleteVideo(v.id)} className="p-2 rounded-lg hover:bg-white/5 text-rose-300"><Trash2 className="w-4 h-4"/></button>
        </div>
      ))}
    </div>
  </>);
}

function TimelineAdmin() {
  const { timeline, addTimelineEntry, deleteTimelineEntry } = useStore();
  const [f, setF] = useState({ year: new Date().getFullYear().toString(), title:"", description:"", category:"milestone" as const });
  return (<>
    <h1 className="font-display text-2xl mb-4">Timeline</h1>
    <form onSubmit={e=>{e.preventDefault(); if(!f.title) return; addTimelineEntry(f as any); setF({year:new Date().getFullYear().toString(),title:"",description:"",category:"milestone"});}} className="glass p-5 mb-4 grid md:grid-cols-4 gap-3">
      <input className="input" placeholder="Year" value={f.year} onChange={e=>setF({...f,year:e.target.value})}/>
      <input className="input md:col-span-2" placeholder="Title" value={f.title} onChange={e=>setF({...f,title:e.target.value})}/>
      <select className="input" value={f.category} onChange={e=>setF({...f,category:e.target.value as any})}>
        <option value="milestone">Milestone</option><option value="work">Work</option><option value="education">Education</option><option value="achievement">Achievement</option>
      </select>
      <input className="input md:col-span-3" placeholder="Description" value={f.description} onChange={e=>setF({...f,description:e.target.value})}/>
      <button className="btn-neon md:col-span-1" data-cursor="hover"><Plus className="w-4 h-4"/>Add</button>
    </form>
    <div className="space-y-2">
      {timeline.map(t=>(
        <div key={t.id} className="glass p-3 flex items-center gap-3">
          <div className="font-mono text-cyan-300">{t.year}</div>
          <div className="flex-1"><div className="font-medium">{t.title}</div><div className="text-xs text-white/60">{t.description}</div></div>
          <span className="chip uppercase text-[10px]">{t.category}</span>
          <button onClick={()=>deleteTimelineEntry(t.id)} className="p-2 rounded-lg hover:bg-white/5 text-rose-300"><Trash2 className="w-4 h-4"/></button>
        </div>
      ))}
    </div>
  </>);
}
