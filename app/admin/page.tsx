"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import SakuraFalling from "@/components/SakuraFalling"; 
import { checkAdmin, createPost, deletePost, getAllPosts, updatePost, getSectionContent, saveSectionContent } from "@/lib/actions";

// --- TYPES ---
interface Post { id: string; title: string; tag: string; language: string; content: string; images: string; }
interface BoxItem { label: string; value: string; }
interface SectionBox { id: string; title: string; items: BoxItem[]; }
interface SectionData { contentEn: string; contentVi: string; contentJp: string; }
interface HeroData { fullName: string; nickName1: string; nickName2: string; avatarUrl: string; greeting: string; description: string; typewriter: string; }
interface ConfigData { resumeUrl: string; isOpenForWork: boolean; }
interface ExpItem { id: string; time: string; role: string; details: string[]; }
interface ExpGroup { id: string; title: string; items: ExpItem[]; }
// [MỚI] Type cho FAQ
interface FaqItem { q: string; a: string; }

// --- CONSTANTS ---
const DEFAULT_HERO: HeroData = { fullName: "Vũ Trí Dũng", nickName1: "David Miller", nickName2: "Akina Aoi", avatarUrl: "", greeting: "Hi, I am", description: "", typewriter: '["Developer", "Student"]' };

// --- STYLES (CSS INLINE CHO ADMIN - SAKURA STYLE) ---
const s = {
    container: { minHeight: '100vh', padding: '40px 20px', fontFamily: '"Nunito", sans-serif' },
    card: { background: 'rgba(255, 255, 255, 0.95)', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(255,105,180,0.15)', marginBottom: '30px', border: '1px solid white' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #ffe4e1', paddingBottom: '15px' },
    title: { fontSize: '1.8rem', color: '#ff69b4', fontWeight: 'bold', margin: 0 },
    subTitle: { fontSize: '1.2rem', color: '#5d4037', fontWeight: 'bold', marginBottom: '15px', borderLeft: '5px solid #ff69b4', paddingLeft: '10px' },
    input: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ffc1e3', outline: 'none', marginBottom: '10px', fontSize: '0.95rem', color: '#5d4037' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#8d6e63', fontSize: '0.85rem', textTransform: 'uppercase' as const },
    btnPrimary: { background: '#ff69b4', color: 'white', padding: '10px 25px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(255,105,180,0.3)', transition: '0.3s' },
    btnSecondary: { background: 'white', color: '#ff69b4', border: '1px solid #ff69b4', padding: '8px 20px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' },
    btnDelete: { background: '#fff0f5', color: '#ff69b4', border: '1px solid #ffc1e3', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
    itemBox: { background: '#fff0f5', padding: '15px', borderRadius: '15px', marginBottom: '15px', border: '1px dashed #ffc1e3' }
};

// --- SUB-COMPONENT: BOX EDITOR ---
const BoxEditor = ({ lang, data, onUpdate }: { lang: string, data: SectionBox[], onUpdate: (d: SectionBox[]) => void }) => {
    const addBox = () => onUpdate([...data, { id: Date.now().toString(), title: "New Group", items: [] }]);
    const updateTitle = (idx: number, v: string) => { const n = [...data]; n[idx].title = v; onUpdate(n); };
    const addItem = (idx: number) => { const n = [...data]; n[idx].items.push({ label: "", value: "" }); onUpdate(n); };
    const updateItem = (bIdx: number, iIdx: number, f: 'label'|'value', v: string) => { const n = [...data]; n[bIdx].items[iIdx][f] = v; onUpdate(n); };
    const remove = (idx: number) => { const n = [...data]; n.splice(idx, 1); onUpdate(n); };
    const removeItem = (bIdx: number, iIdx: number) => { const n = [...data]; n[bIdx].items.splice(iIdx, 1); onUpdate(n); };

    return (
        <div style={s.card}>
            <h3 style={s.subTitle}>PROFILE / CONTACT ({lang.toUpperCase()})</h3>
            {data.map((box, bIdx) => (
                <div key={box.id} style={s.itemBox}>
                    <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
                        <input value={box.title} onChange={e=>updateTitle(bIdx, e.target.value)} style={{...s.input, fontWeight:'bold', color:'#ff69b4'}} placeholder="Group Title" />
                        <button type="button" onClick={()=>remove(bIdx)} style={s.btnDelete}>X</button>
                    </div>
                    {box.items.map((it, iIdx) => (
                        <div key={iIdx} style={{display:'flex', gap:'10px'}}>
                            <input value={it.label} onChange={e=>updateItem(bIdx,iIdx,'label',e.target.value)} style={{...s.input, flex:1}} placeholder="Label" />
                            <input value={it.value} onChange={e=>updateItem(bIdx,iIdx,'value',e.target.value)} style={{...s.input, flex:2}} placeholder="Value" />
                            <button type="button" onClick={()=>removeItem(bIdx,iIdx)} style={{...s.btnDelete, height:'42px'}}>×</button>
                        </div>
                    ))}
                    <button type="button" onClick={()=>addItem(bIdx)} style={{fontSize:'0.8rem', color:'#ff69b4', background:'none', border:'none', cursor:'pointer', fontWeight:'bold'}}>+ Add Item</button>
                </div>
            ))}
            <button type="button" onClick={addBox} style={{width:'100%', padding:'10px', border:'2px dashed #ffc1e3', background:'none', color:'#ff69b4', borderRadius:'10px', cursor:'pointer', fontWeight:'bold'}}>+ ADD NEW GROUP</button>
        </div>
    );
};

// --- SUB-COMPONENT: EXPERIENCE EDITOR ---
const ExpEditor = ({ lang, data, onUpdate }: { lang: string, data: ExpGroup[], onUpdate: (d: ExpGroup[]) => void }) => {
    const addGroup = () => onUpdate([...data, { id: Date.now().toString(), title: "New Category", items: [] }]);
    const updateTitle = (idx: number, v: string) => { const n = [...data]; n[idx].title = v; onUpdate(n); };
    const addItem = (gIdx: number) => { const n = [...data]; n[gIdx].items.push({ id: Date.now().toString(), time: "", role: "", details: [] }); onUpdate(n); };
    const updateItem = (gIdx: number, iIdx: number, f: keyof ExpItem, v: string) => { const n = [...data]; (n[gIdx].items[iIdx] as any)[f] = v; onUpdate(n); };
    const updateDetails = (gIdx: number, iIdx: number, txt: string) => { const n = [...data]; n[gIdx].items[iIdx].details = txt.split('\n'); onUpdate(n); };
    const remove = (idx: number) => { const n = [...data]; n.splice(idx, 1); onUpdate(n); };
    const removeItem = (gIdx: number, iIdx: number) => { const n = [...data]; n[gIdx].items.splice(iIdx, 1); onUpdate(n); };

    return (
        <div style={s.card}>
            <h3 style={s.subTitle}>EXPERIENCE ({lang.toUpperCase()})</h3>
            {data.map((group, gIdx) => (
                <div key={group.id} style={{marginBottom:'20px', borderLeft:'4px solid #ff69b4', paddingLeft:'15px'}}>
                    <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
                        <input value={group.title} onChange={e=>updateTitle(gIdx, e.target.value)} style={{...s.input, fontSize:'1.1rem', fontWeight:'bold', color:'#5d4037'}} placeholder="Category Name" />
                        <button type="button" onClick={()=>remove(gIdx)} style={s.btnDelete}>DEL CAT</button>
                    </div>
                    {group.items.map((item, iIdx) => (
                        <div key={item.id} style={{background:'white', padding:'15px', borderRadius:'10px', marginBottom:'10px', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>
                            <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:'10px'}}>
                                <input value={item.time} onChange={e=>updateItem(gIdx,iIdx,'time',e.target.value)} style={s.input} placeholder="Time (e.g 2023-2024)" />
                                <div style={{display:'flex', gap:'5px'}}>
                                    <input value={item.role} onChange={e=>updateItem(gIdx,iIdx,'role',e.target.value)} style={{...s.input, fontWeight:'bold'}} placeholder="Role / Company" />
                                    <button type="button" onClick={()=>removeItem(gIdx,iIdx)} style={s.btnDelete}>×</button>
                                </div>
                            </div>
                            <textarea value={item.details.join('\n')} onChange={e=>updateDetails(gIdx,iIdx,e.target.value)} style={{...s.input, height:'80px', fontFamily:'monospace', fontSize:'0.85rem'}} placeholder="- Detail 1&#10;- Detail 2" />
                        </div>
                    ))}
                    <button type="button" onClick={()=>addItem(gIdx)} style={{fontSize:'0.8rem', color:'#ff69b4', background:'none', border:'none', cursor:'pointer', fontWeight:'bold'}}>+ Add Job</button>
                </div>
            ))}
            <button type="button" onClick={addGroup} style={{width:'100%', padding:'10px', border:'2px dashed #ffc1e3', background:'none', color:'#ff69b4', borderRadius:'10px', cursor:'pointer', fontWeight:'bold'}}>+ ADD CATEGORY</button>
        </div>
    );
};

// --- [MỚI] SUB-COMPONENT: FAQ EDITOR ---
const FaqEditor = ({ lang, data, onUpdate }: { lang: string, data: FaqItem[], onUpdate: (d: FaqItem[]) => void }) => {
    const addItem = () => onUpdate([...data, { q: "", a: "" }]);
    const updateItem = (idx: number, f: keyof FaqItem, v: string) => { const n = [...data]; n[idx][f] = v; onUpdate(n); };
    const removeItem = (idx: number) => { const n = [...data]; n.splice(idx, 1); onUpdate(n); };

    return (
        <div style={s.card}>
            <h3 style={s.subTitle}>FAQ / HELP ({lang.toUpperCase()})</h3>
            {data.map((item, idx) => (
                <div key={idx} style={s.itemBox}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                        <label style={s.label}>QUESTION</label>
                        <button type="button" onClick={()=>removeItem(idx)} style={s.btnDelete}>×</button>
                    </div>
                    <input value={item.q} onChange={e=>updateItem(idx, 'q', e.target.value)} style={{...s.input, fontWeight:'bold', color:'#ff69b4'}} placeholder="Câu hỏi..." />
                    
                    <label style={s.label}>ANSWER</label>
                    <textarea value={item.a} onChange={e=>updateItem(idx, 'a', e.target.value)} style={{...s.input, height:'80px'}} placeholder="Trả lời..." />
                </div>
            ))}
            <button type="button" onClick={addItem} style={{width:'100%', padding:'10px', border:'2px dashed #ffc1e3', background:'none', color:'#ff69b4', borderRadius:'10px', cursor:'pointer', fontWeight:'bold'}}>+ ADD QUESTION</button>
        </div>
    );
};

// --- SUB-COMPONENT: HERO EDITOR ---
const HeroEditor = ({ lang, data, onUpdate }: { lang: string, data: HeroData, onUpdate: (f: keyof HeroData, v: string) => void }) => (
    <div style={s.card}>
        <h3 style={s.subTitle}>HERO INFO ({lang.toUpperCase()})</h3>
        <div><label style={s.label}>Greeting</label><input value={data.greeting} onChange={e=>onUpdate('greeting', e.target.value)} style={s.input} /></div>
        <div><label style={s.label}>Full Name</label><input value={data.fullName} onChange={e=>onUpdate('fullName', e.target.value)} style={s.input} /></div>
        <div style={{display:'flex', gap:'10px'}}>
            <div style={{flex:1}}><label style={s.label}>Nick 1</label><input value={data.nickName1} onChange={e=>onUpdate('nickName1', e.target.value)} style={s.input} /></div>
            <div style={{flex:1}}><label style={s.label}>Nick 2</label><input value={data.nickName2} onChange={e=>onUpdate('nickName2', e.target.value)} style={s.input} /></div>
        </div>
        <div><label style={s.label}>Typewriter (JSON)</label><input value={data.typewriter} onChange={e=>onUpdate('typewriter', e.target.value)} style={s.input} /></div>
        <div><label style={s.label}>Description</label><textarea value={data.description} onChange={e=>onUpdate('description', e.target.value)} style={{...s.input, height:'80px'}} /></div>
        <div><label style={s.label}>Avatar URL</label><input value={data.avatarUrl} onChange={e=>onUpdate('avatarUrl', e.target.value)} style={s.input} /></div>
    </div>
);

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<'blog' | 'content'>('blog');

  // BLOG STATES
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [tag, setTag] = useState("my_confessions");
  const [images, setImages] = useState<string[]>([]);

  // SECTION STATES
  const [sectionKey, setSectionKey] = useState("about");
  const [msg, setMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const [secEn, setSecEn] = useState("");
  const [secVi, setSecVi] = useState("");
  const [secJp, setSecJp] = useState("");

  const [boxesEn, setBoxesEn] = useState<SectionBox[]>([]);
  const [boxesVi, setBoxesVi] = useState<SectionBox[]>([]);
  const [boxesJp, setBoxesJp] = useState<SectionBox[]>([]);

  const [heroEn, setHeroEn] = useState<HeroData>(DEFAULT_HERO);
  const [heroVi, setHeroVi] = useState<HeroData>(DEFAULT_HERO);
  const [heroJp, setHeroJp] = useState<HeroData>(DEFAULT_HERO);

  const [config, setConfig] = useState<ConfigData>({ resumeUrl: "", isOpenForWork: true });

  const [expEn, setExpEn] = useState<ExpGroup[]>([]);
  const [expVi, setExpVi] = useState<ExpGroup[]>([]);
  const [expJp, setExpJp] = useState<ExpGroup[]>([]);

  // [MỚI] FAQ States
  const [faqEn, setFaqEn] = useState<FaqItem[]>([]);
  const [faqVi, setFaqVi] = useState<FaqItem[]>([]);
  const [faqJp, setFaqJp] = useState<FaqItem[]>([]);

  const isBoxSection = ['profile', 'contact'].includes(sectionKey);
  const isExpSection = sectionKey === 'experience'; 
  const isHeroSection = sectionKey === 'hero';
  const isConfigSection = sectionKey === 'global_config';
  const isFaqSection = sectionKey === 'faq_data'; // [MỚI]

  useEffect(() => { getAllPosts().then((data) => setPosts(data as unknown as Post[])); }, []);

  // LOAD DATA
  useEffect(() => {
    if (activeTab === 'content') {
        const fetchSection = async () => {
            setMsg("🌸 Loading data...");
            try {
                const data = await getSectionContent(sectionKey);
                if (data) {
                    const typedData = data as unknown as SectionData;
                    if (isExpSection) {
                        try { setExpEn(JSON.parse(typedData.contentEn)); } catch { setExpEn([]); }
                        try { setExpVi(JSON.parse(typedData.contentVi)); } catch { setExpVi([]); }
                        try { setExpJp(JSON.parse(typedData.contentJp)); } catch { setExpJp([]); }
                    } else if (isBoxSection) {
                        try { setBoxesEn(JSON.parse(typedData.contentEn)); } catch { setBoxesEn([]); }
                        try { setBoxesVi(JSON.parse(typedData.contentVi)); } catch { setBoxesVi([]); }
                        try { setBoxesJp(JSON.parse(typedData.contentJp)); } catch { setBoxesJp([]); }
                    } else if (isHeroSection) {
                        try { setHeroEn({ ...DEFAULT_HERO, ...JSON.parse(typedData.contentEn) }); } catch { setHeroEn(DEFAULT_HERO); }
                        try { setHeroVi({ ...DEFAULT_HERO, ...JSON.parse(typedData.contentVi) }); } catch { setHeroVi(DEFAULT_HERO); }
                        try { setHeroJp({ ...DEFAULT_HERO, ...JSON.parse(typedData.contentJp) }); } catch { setHeroJp(DEFAULT_HERO); }
                    } else if (isConfigSection) {
                        try { const p = JSON.parse(typedData.contentEn); setConfig({ resumeUrl: p.resumeUrl || "", isOpenForWork: p.isOpenForWork ?? true }); } catch { setConfig({ resumeUrl: "", isOpenForWork: true }); }
                    } else if (isFaqSection) { // [MỚI] Load FAQ
                        try { setFaqEn(JSON.parse(typedData.contentEn)); } catch { setFaqEn([]); }
                        try { setFaqVi(JSON.parse(typedData.contentVi)); } catch { setFaqVi([]); }
                        try { setFaqJp(JSON.parse(typedData.contentJp)); } catch { setFaqJp([]); }
                    } else { 
                        setSecEn(typedData.contentEn || ""); setSecVi(typedData.contentVi || ""); setSecJp(typedData.contentJp || "");
                    }
                } else {
                    setSecEn(""); setSecVi(""); setSecJp("");
                    setBoxesEn([]); setBoxesVi([]); setBoxesJp([]);
                    setExpEn([]); setExpVi([]); setExpJp([]);
                    setFaqEn([]); setFaqVi([]); setFaqJp([]); // [MỚI]
                    setHeroEn(DEFAULT_HERO); setHeroVi(DEFAULT_HERO); setHeroJp(DEFAULT_HERO);
                    setConfig({ resumeUrl: "", isOpenForWork: true });
                }
                setMsg("");
            } catch (error) { console.error(error); setMsg("Error loading!"); }
        };
        fetchSection();
    }
  }, [sectionKey, activeTab, isBoxSection, isHeroSection, isConfigSection, isExpSection, isFaqSection]);

  async function handleLogin(formData: FormData) { const res = await checkAdmin(formData); if (res.success) setIsAuth(true); else alert("Wrong Password! 🌸"); }
  const addLinkField = () => setImages([...images, ""]);
  const removeLinkField = (index: number) => { const newImg = [...images]; newImg.splice(index, 1); setImages(newImg); };
  const updateLinkField = (index: number, val: string) => { const newImg = [...images]; newImg[index] = val; setImages(newImg); };
  async function handleBlogSubmit(formData: FormData) { 
      const jsonImages = JSON.stringify(images.filter(img => img.trim() !== "")); formData.set("images", jsonImages);
      if (editingPost) await updatePost(formData); else await createPost(formData);
      setEditingPost(null); setImages([]); setPosts(await getAllPosts() as unknown as Post[]); alert("Saved! 🌸");
  }
  function startEdit(post: Post) { setEditingPost(post); setTag(post.tag); try { setImages(JSON.parse(post.images)); } catch { setImages([]); } window.scrollTo({ top: 0, behavior: 'smooth' }); }
  async function handleDelete(id: string) { if(!confirm("Delete this?")) return; await deletePost(id); setPosts(await getAllPosts() as unknown as Post[]); }

  const updateHero = (lang: 'en'|'vi'|'jp', field: keyof HeroData, val: string) => {
      const setter = lang === 'en' ? setHeroEn : (lang === 'vi' ? setHeroVi : setHeroJp);
      setter(prev => ({ ...prev, [field]: val }));
  };

  async function handleSectionSubmit(formData: FormData) {
    if (isSaving) return; setIsSaving(true); setMsg("Saving...");
    if (isExpSection) { formData.set("contentEn", JSON.stringify(expEn)); formData.set("contentVi", JSON.stringify(expVi)); formData.set("contentJp", JSON.stringify(expJp)); } 
    else if (isBoxSection) { formData.set("contentEn", JSON.stringify(boxesEn)); formData.set("contentVi", JSON.stringify(boxesVi)); formData.set("contentJp", JSON.stringify(boxesJp)); } 
    else if (isHeroSection) { formData.set("contentEn", JSON.stringify(heroEn)); formData.set("contentVi", JSON.stringify(heroVi)); formData.set("contentJp", JSON.stringify(heroJp)); } 
    else if (isConfigSection) { formData.set("contentEn", JSON.stringify(config)); formData.set("contentVi", ""); formData.set("contentJp", ""); } 
    else if (isFaqSection) { formData.set("contentEn", JSON.stringify(faqEn)); formData.set("contentVi", JSON.stringify(faqVi)); formData.set("contentJp", JSON.stringify(faqJp)); } // [MỚI]
    else { formData.set("contentEn", secEn); formData.set("contentVi", secVi); formData.set("contentJp", secJp); }
    const res = await saveSectionContent(formData);
    setIsSaving(false); if (res.success) { setMsg("Saved! 🌸"); setTimeout(() => setMsg(""), 3000); } else setMsg("Failed!");
  }

  if (!isAuth) return ( <div style={{display:'flex', height:'100vh', justifyContent:'center', alignItems:'center'}}><form action={handleLogin} style={{...s.card, width:'400px', textAlign:'center'}}><h1 style={{...s.title, marginBottom:'20px'}}>🌸 ADMIN LOGIN</h1><input name="username" placeholder="Username" style={s.input} /><input name="password" type="password" placeholder="Password" style={s.input} /><button style={{...s.btnPrimary, width:'100%', marginTop:'10px'}}>LOGIN</button></form></div> );

  return (
    <div style={s.container}>
      <SakuraFalling />
      
      {/* HEADER */}
      <div style={{...s.header, background:'rgba(255,255,255,0.9)', padding:'20px', borderRadius:'20px', position:'sticky', top:'10px', zIndex:100, backdropFilter:'blur(10px)'}}>
        <h1 style={s.title}>🌸 DASHBOARD</h1>
        <div style={{display:'flex', gap:'10px'}}>
            <button onClick={() => setActiveTab('blog')} style={activeTab==='blog'?s.btnPrimary:s.btnSecondary}>BLOG</button>
            <button onClick={() => setActiveTab('content')} style={activeTab==='content'?s.btnPrimary:s.btnSecondary}>SECTIONS</button>
        </div>
      </div>

      {activeTab === 'blog' && (
        <div style={s.grid2}>
             <div style={{...s.card, height:'fit-content', position:'sticky', top:'100px'}}>
                <h2 style={s.subTitle}>{editingPost ? "EDIT POST" : "NEW POST"}</h2>
                <form action={handleBlogSubmit}>
                    {editingPost && <input type="hidden" name="id" value={editingPost.id} />}
                    <label style={s.label}>TITLE</label><input name="title" defaultValue={editingPost?.title} required style={s.input} />
                    <div style={s.grid2}>
                        <div><label style={s.label}>TAG</label><select name="tag" value={tag} onChange={e=>setTag(e.target.value)} style={s.input}><option value="my_confessions">My Confessions</option><option value="uni_projects">University Projects</option><option value="personal_projects">Personal Projects</option><option value="achievements">Achievements</option><option value="it_events">IT Events</option><option value="lang_certs">Language Certs</option><option value="tech_certs">Tech Certs</option></select></div>
                        <div><label style={s.label}>LANG</label><select name="language" defaultValue={editingPost?.language||"vi"} style={s.input}><option value="vi">Vietnamese</option><option value="en">English</option><option value="jp">Japanese</option></select></div>
                    </div>
                    <label style={s.label}>CONTENT</label><textarea name="content" defaultValue={editingPost?.content} rows={10} required style={{...s.input, fontFamily:'monospace'}} />
                    <div style={s.itemBox}><label style={s.label}>IMAGES</label>{images.map((l,i)=>(<div key={i} style={{display:'flex', gap:'5px', marginBottom:'5px'}}><input value={l} onChange={e=>updateLinkField(i,e.target.value)} style={{...s.input, marginBottom:0}} /><button type="button" onClick={()=>removeLinkField(i)} style={s.btnDelete}>X</button></div>))}<button type="button" onClick={addLinkField} style={{fontSize:'0.8rem', color:'#ff69b4', border:'none', background:'none', cursor:'pointer'}}>+ Add Image</button></div>
                    <div style={{display:'flex', gap:'10px', marginTop:'10px'}}><button style={{...s.btnPrimary, flex:1}}>SAVE</button>{editingPost && <button type="button" onClick={()=>{setEditingPost(null);setImages([])}} style={s.btnSecondary}>CANCEL</button>}</div>
                </form>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                {posts.map(post => (
                    <div key={post.id} style={{background:'white', padding:'20px', borderRadius:'15px', border:'1px solid #ffc1e3', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <div>
                            <h3 style={{margin:'0 0 5px 0', color:'#5d4037'}}>{post.title}</h3>
                            <span style={{fontSize:'0.8rem', background:'#fff0f5', padding:'3px 8px', borderRadius:'8px', color:'#ff69b4'}}>{post.tag} | {post.language}</span>
                        </div>
                        <div style={{display:'flex', gap:'5px'}}>
                            <button onClick={()=>startEdit(post)} style={{...s.btnSecondary, padding:'5px 15px', fontSize:'0.8rem'}}>EDIT</button>
                            <button onClick={()=>handleDelete(post.id)} style={{...s.btnDelete, background:'#fff', border:'1px solid red', color:'red'}}>DEL</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div style={{maxWidth:'1200px', margin:'0 auto'}}>
            <div style={s.card}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <h2 style={s.subTitle}>EDIT SECTIONS</h2>
                    {msg && <span style={{color:'#2e7d32', fontWeight:'bold'}}>{msg}</span>}
                </div>
                <form action={handleSectionSubmit}>
                    <div style={{marginBottom:'20px'}}>
                        <label style={s.label}>SELECT SECTION</label>
                        <select name="sectionKey" value={sectionKey} onChange={(e) => setSectionKey(e.target.value)} style={{...s.input, fontSize:'1.1rem', padding:'15px'}}>
                            <option value="global_config">★ GLOBAL CONFIG (Resume, Status)</option>
                            <option value="hero">★ HERO SECTION (Main Info)</option>
                            <option value="about">01. ABOUT ME (Text)</option>
                            <option value="profile">02. PROFILE (Boxes)</option>
                            <option value="career">04. CAREER GOALS (Text)</option>
                            <option value="skills">06. SKILLS (Text)</option>
                            <option value="experience">07. EXPERIENCE (CV Style)</option>
                            <option value="contact">11. CONTACT (Boxes)</option>
                            <option value="faq_data">12. FAQ (Q&A)</option>
                        </select>
                    </div>

                    {isHeroSection ? (
                        <div style={s.grid3}>
                            <HeroEditor lang="en" data={heroEn} onUpdate={(f,v) => updateHero('en', f, v)} />
                            <HeroEditor lang="vi" data={heroVi} onUpdate={(f,v) => updateHero('vi', f, v)} />
                            <HeroEditor lang="jp" data={heroJp} onUpdate={(f,v) => updateHero('jp', f, v)} />
                        </div>
                    ) : isConfigSection ? (
                        <div style={s.card}>
                            <h3 style={s.subTitle}>GLOBAL CONFIG</h3>
                            <div><label style={s.label}>Resume URL</label><input value={config.resumeUrl || ""} onChange={e => setConfig({...config, resumeUrl: e.target.value})} style={s.input} /></div>
                            <div style={{display:'flex', alignItems:'center', gap:'10px', marginTop:'10px'}}>
                                <label style={s.label}>Open For Work?</label>
                                <input type="checkbox" checked={!!config.isOpenForWork} onChange={e => setConfig({...config, isOpenForWork: e.target.checked})} style={{width:'20px', height:'20px'}} />
                            </div>
                        </div>
                    ) : isExpSection ? (
                        <div style={s.grid3}>
                            <ExpEditor lang="en" data={expEn} onUpdate={setExpEn} />
                            <ExpEditor lang="vi" data={expVi} onUpdate={setExpVi} />
                            <ExpEditor lang="jp" data={expJp} onUpdate={setExpJp} />
                        </div>
                    ) : isBoxSection ? (
                        <div style={s.grid3}>
                            <BoxEditor lang="en" data={boxesEn} onUpdate={setBoxesEn} />
                            <BoxEditor lang="vi" data={boxesVi} onUpdate={setBoxesVi} />
                            <BoxEditor lang="jp" data={boxesJp} onUpdate={setBoxesJp} />
                        </div>
                    ) : isFaqSection ? ( /* [MỚI] Hiển thị FaqEditor */
                        <div style={s.grid3}>
                            <FaqEditor lang="en" data={faqEn} onUpdate={setFaqEn} />
                            <FaqEditor lang="vi" data={faqVi} onUpdate={setFaqVi} />
                            <FaqEditor lang="jp" data={faqJp} onUpdate={setFaqJp} />
                        </div>
                    ) : (
                        <div style={s.grid3}>
                            <div style={s.card}><label style={s.label}>ENGLISH</label><textarea name="contentEn" value={secEn} onChange={e=>setSecEn(e.target.value)} style={{...s.input, height:'300px'}} /></div>
                            <div style={s.card}><label style={s.label}>VIETNAMESE</label><textarea name="contentVi" value={secVi} onChange={e=>setSecVi(e.target.value)} style={{...s.input, height:'300px'}} /></div>
                            <div style={s.card}><label style={s.label}>JAPANESE</label><textarea name="contentJp" value={secJp} onChange={e=>setSecJp(e.target.value)} style={{...s.input, height:'300px'}} /></div>
                        </div>
                    )}

                    <button type="submit" disabled={isSaving} style={{...s.btnPrimary, width:'100%', fontSize:'1.2rem', marginTop:'20px'}}>{isSaving ? "SAVING..." : "SAVE CHANGES"}</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}