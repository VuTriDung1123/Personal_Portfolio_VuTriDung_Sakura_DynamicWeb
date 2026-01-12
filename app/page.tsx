"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import Link from "next/link"; 

import SakuraFalling from "@/components/SakuraFalling"; 
import SakuraNav from "@/components/SakuraNav";
import { translations, Lang } from "@/lib/data"; 
import { getAllPosts, getPostsByTag, getSectionContent } from "@/lib/actions"; 

// --- TYPES (Giữ nguyên) ---
type Post = { id: string; title: string; images: string; createdAt: Date | string; tag?: string; language?: string; content?: string; };
type SectionData = { contentEn: string; contentVi: string; contentJp: string; };
type SectionBox = { id: string; title: string; items: { label: string; value: string }[]; };
type HeroData = { fullName: string; nickName1: string; nickName2: string; avatarUrl: string; greeting: string; description: string; typewriter: string; };
interface ExpItem { id: string; time: string; role: string; details: string[]; }
interface ExpGroup { id: string; title: string; items: ExpItem[]; }

export default function SakuraHome() {
  const [currentLang, setCurrentLang] = useState<Lang>("en");
  const [isLoading, setIsLoading] = useState(true);

  // Data States
  const [dbUniProjects, setDbUniProjects] = useState<Post[]>([]);
  const [dbPersonalProjects, setDbPersonalProjects] = useState<Post[]>([]);
  const [dbItEvents, setDbItEvents] = useState<Post[]>([]);
  const [dbLangCerts, setDbLangCerts] = useState<Post[]>([]);
  const [dbTechCerts, setDbTechCerts] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [dbAchievements, setDbAchievements] = useState<Post[]>([]);
  const [dynamicSections, setDynamicSections] = useState<Record<string, SectionData>>({});
  const [globalConfig, setGlobalConfig] = useState<{ resumeUrl: string; isOpenForWork: boolean } | null>(null);

  const t = translations[currentLang]; 

  useEffect(() => {
    Promise.all([
        getPostsByTag("uni_projects").then(d => setDbUniProjects(d as unknown as Post[])),
        getPostsByTag("personal_projects").then(d => setDbPersonalProjects(d as unknown as Post[])),
        getPostsByTag("it_events").then(d => setDbItEvents(d as unknown as Post[])),
        getPostsByTag("lang_certs").then(d => setDbLangCerts(d as unknown as Post[])),
        getPostsByTag("tech_certs").then(d => setDbTechCerts(d as unknown as Post[])),
        getPostsByTag("achievements").then(d => setDbAchievements(d as unknown as Post[])),
        getAllPosts().then(d => d && setLatestPosts(d.slice(0, 3) as unknown as Post[])),
        
        Promise.all(["about", "career", "skills", "profile", "experience", "contact", "hero", "global_config"].map(key => getSectionContent(key)))
        .then(results => {
            const secs: Record<string, SectionData> = {};
            ["about", "career", "skills", "profile", "experience", "contact", "hero", "global_config"].forEach((key, i) => {
                if (results[i]) secs[key] = results[i] as unknown as SectionData;
            });
            setDynamicSections(secs);
            if (secs.global_config) try { setGlobalConfig(JSON.parse(secs.global_config.contentEn)); } catch {}
        })
    ]).finally(() => setTimeout(() => setIsLoading(false), 500));
  }, []);

  // Helpers
  const getTxt = (key: string) => { const d = dynamicSections[key]; if(!d) return null; return (currentLang==='en'?d.contentEn:(currentLang==='vi'?d.contentVi:d.contentJp)) || null; };
  const getJson = <T,>(key: string): T | null => { const d = dynamicSections[key]; if(!d) return null; try { return JSON.parse((currentLang==='en'?d.contentEn:(currentLang==='vi'?d.contentVi:d.contentJp))); } catch { return null; } };
  
  const hero = (() => {
      const d = getJson<HeroData>('hero');
      return d || { fullName: "Vu Tri Dung", nickName1: "David Miller", nickName2: "Akina Aoi", avatarUrl: "/pictures/VuTriDung.jpg", greeting: "Hi, I am", description: "Loading...", typewriter: "[]" };
  })();
  
  // Logic lấy ảnh avatar an toàn
  const avatarSrc = (hero.avatarUrl && hero.avatarUrl.trim() !== "") ? hero.avatarUrl : "/pictures/VuTriDung.jpg";

  const getCover = (json: string) => { 
      try { const arr = JSON.parse(json); return (arr.length > 0 && arr[0]) ? arr[0] : "https://placehold.co/600x400/ffc0cb/ffffff?text=Sakura"; } catch { return "https://placehold.co/600x400/ffc0cb/ffffff?text=Sakura"; } 
  };

  const profileBoxes = getJson<SectionBox[]>('profile');
  const contactBoxes = getJson<SectionBox[]>('contact');
  const experienceData = getJson<ExpGroup[]>('experience');

  return (
    <main>
        <SakuraFalling />
        <SakuraNav t={t} currentLang={currentLang} setCurrentLang={setCurrentLang} resumeUrl={globalConfig?.resumeUrl} />

        {isLoading ? (
            <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ff69b4', fontWeight: 'bold', fontSize: '1.5rem'}}>
                🌸 LOADING...
            </div>
        ) : (
            <div>
                {/* HERO SECTION */}
                <section id="home" className="hero-section">
                    <div className="hero-text">
                        <span className="hero-greeting">{hero.greeting}</span>
                        <h1 className="hero-name">{hero.fullName}</h1>
                        <div className="hero-names-box">
                            <span className="hero-badge">🇬🇧 {hero.nickName1}</span>
                            <span className="hero-badge">🇯🇵 {hero.nickName2}</span>
                        </div>
                        {globalConfig?.isOpenForWork && (
                            <div style={{color: '#2e7d32', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px'}}>
                                <span style={{width: '8px', height: '8px', background: '#2e7d32', borderRadius: '50%'}}></span>
                                {currentLang==='vi'?'Đang tìm việc':'Open for Work'}
                            </div>
                        )}
                        <p className="hero-desc">{hero.description}</p>
                        <div className="hero-btns">
                            <a href="#projects" className="btn-big btn-pink">{t.btn_view_project}</a>
                            <a href="#contact" className="btn-big btn-white">{t.btn_contact}</a>
                        </div>
                    </div>
                    
                    <div className="hero-image-container">
                        <div className="blob-bg"></div>
                        <div className="avatar-frame">
                            {/* Dùng thẻ img thường để chắc chắn hiện */}
                            <img src={avatarSrc} alt="Hero Avatar" className="avatar-img" />
                        </div>
                    </div>
                </section>

                {/* Các section khác tôi giữ đơn giản để code không quá dài, style đã có trong globals.css */}
                <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px'}}>
                    
                    {/* ABOUT */}
                    <section id="about" style={{padding: '80px 0', textAlign: 'center'}}>
                        <h2 style={{fontSize: '2.5rem', color: '#ff69b4', marginBottom: '30px'}}>✿ {t.sec_about} ✿</h2>
                        <div style={{background: 'rgba(255,255,255,0.7)', padding: '40px', borderRadius: '30px', border: '1px solid white'}}>
                            <p style={{whiteSpace: 'pre-line', lineHeight: '1.8'}}>{getTxt("about")}</p>
                        </div>
                    </section>

                    {/* PROFILE */}
                    <section id="profile" style={{padding: '80px 0'}}>
                        <h2 style={{textAlign: 'center', fontSize: '2.5rem', color: '#ff69b4', marginBottom: '40px'}}>✿ {t.sec_profile} ✿</h2>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px'}}>
                            {profileBoxes?.map(box => (
                                <div key={box.id} style={{background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 5px 15px rgba(255,105,180,0.1)'}}>
                                    <h3 style={{color: '#ff69b4', borderBottom: '1px dashed #ffc1e3', paddingBottom: '10px', marginBottom: '15px'}}>{box.title}</h3>
                                    {box.items.map((it, i) => (
                                        <div key={i} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                                            <span style={{fontWeight: 'bold', color: '#aaa', fontSize: '0.85rem'}}>{it.label}</span>
                                            <span style={{fontWeight: 'bold', color: '#5d4037'}}>{it.value}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* PROJECTS */}
                    <section id="projects" style={{padding: '80px 0'}}>
                        <h2 style={{textAlign: 'center', fontSize: '2.5rem', color: '#ff69b4', marginBottom: '40px'}}>✿ {t.sec_proj} ✿</h2>
                        {[
                            { title: t.cat_uni_proj, data: dbUniProjects },
                            { title: t.cat_personal_proj, data: dbPersonalProjects }
                        ].map((cat, idx) => (
                            <div key={idx} style={{marginBottom: '60px'}}>
                                <h3 style={{fontSize: '1.5rem', color: '#8d6e63', marginBottom: '20px', borderLeft: '5px solid #ff69b4', paddingLeft: '15px'}}>{cat.title}</h3>
                                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px'}}>
                                    {cat.data.map(p => (
                                        <Link key={p.id} href={`/blog/${p.id}`} style={{background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', display: 'block', transition: '0.3s'}}>
                                            <div style={{height: '200px', overflow: 'hidden'}}>
                                                <img src={getCover(p.images)} alt={p.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                            </div>
                                            <div style={{padding: '20px'}}>
                                                <h4 style={{fontWeight: 'bold', color: '#5d4037', marginBottom: '5px'}}>{p.title}</h4>
                                                <span style={{fontSize: '0.8rem', color: '#ff69b4', fontWeight: 'bold', textTransform: 'uppercase'}}>View Details →</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* CONTACT */}
                    <section id="contact" style={{padding: '80px 0', marginBottom: '50px'}}>
                        <div style={{background: 'rgba(255,255,255,0.8)', padding: '50px', borderRadius: '30px', textAlign: 'center'}}>
                            <h2 style={{fontSize: '2.5rem', color: '#ff69b4', marginBottom: '20px'}}>{t.sec_contact || "Contact"}</h2>
                            <p style={{fontSize: '1.2rem', color: '#8d6e63', marginBottom: '30px'}}>Let&apos;s create something beautiful together! ✨</p>
                            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px'}}>
                                {contactBoxes?.map(box => box.items.map((it, i) => (
                                    <div key={i} style={{background: 'white', padding: '15px 30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(255,105,180,0.15)'}}>
                                        <span style={{display: 'block', fontSize: '0.75rem', color: '#aaa', fontWeight: 'bold', textTransform: 'uppercase'}}>{it.label}</span>
                                        <span style={{fontWeight: 'bold', color: '#5d4037'}}>{it.value}</span>
                                    </div>
                                )))}
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        )}
    </main>
  );
}