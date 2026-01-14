"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import Link from "next/link"; 
import SakuraCursorTrail from "@/components/SakuraCursorTrail";

import SakuraFalling from "@/components/SakuraFalling"; 
import SakuraNav from "@/components/SakuraNav";
import { translations, Lang } from "@/lib/data"; 
import { getAllPosts, getPostsByTag, getSectionContent } from "@/lib/actions"; 

// --- DỮ LIỆU TÊN ---
const MY_NAMES = {
    vi: "Vũ Trí Dũng",
    en: "David Miller",
    jp: "明菜青い" 
};

// --- DỮ LIỆU THƠ LOADING ---
const LOADING_POEMS = {
    en: [
        "Crafting digital dreams...",
        "The cherry blossoms fall, code stands tall...",
        "Patience is the companion of wisdom..."
    ],
    vi: [
        "Dệt mộng kỹ thuật số...",
        "Cánh hoa tàn, nhưng hồn hoa vẫn nở...",
        "Đợi một chút, mùa xuân đang về..."
    ],
    jp: [
        "デジタルな夢を紡ぐ...",
        "桜散る、コードに残る、夢の跡...",
        "待てば海路の日和あり..."
    ]
};

// --- TYPES ---
type Post = { id: string; title: string; images: string; createdAt: Date | string; tag?: string; language?: string; content?: string; };
type SectionData = { contentEn: string; contentVi: string; contentJp: string; };
type SectionBox = { id: string; title: string; items: { label: string; value: string }[]; };
type HeroData = { fullName: string; nickName1: string; nickName2: string; avatarUrl: string; greeting: string; description: string; typewriter: string; };
interface ExpItem { id: string; time: string; role: string; details: string[]; }
interface ExpGroup { id: string; title: string; items: ExpItem[]; }

// Component EmptyState
const EmptyState = ({ message, lang }: { message?: string, lang?: Lang }) => (
    <div className="glass-box" style={{textAlign: 'center', padding: '40px', color: '#8d6e63', fontStyle: 'italic', background: 'rgba(255,255,255,0.6)'}}>
        <div style={{fontSize: '2rem', marginBottom: '10px'}}>🍃</div>
        <p>{message || (lang === 'vi' ? "Đang cập nhật dữ liệu..." : (lang === 'jp' ? "データ更新中..." : "Updating data..."))}</p>
    </div>
);

export default function SakuraHome() {
  const [currentLang, setCurrentLang] = useState<Lang>("en");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingQuotes, setLoadingQuotes] = useState({ en: "", vi: "", jp: "" });

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

  // --- [MỚI] STATE CHO BỘ LỌC DỰ ÁN ---
  const [projLang, setProjLang] = useState<string>("ALL");
  const [projSort, setProjSort] = useState<"newest" | "oldest">("newest");

  const t = translations[currentLang]; 

  const handleSetLanguage = (lang: Lang) => {
      setCurrentLang(lang);
      localStorage.setItem("sakura_lang", lang);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("sakura_lang") as Lang;
    if (savedLang && ['en', 'vi', 'jp'].includes(savedLang)) {
        setCurrentLang(savedLang);
    }

    setLoadingQuotes({
        en: LOADING_POEMS.en[Math.floor(Math.random() * LOADING_POEMS.en.length)],
        vi: LOADING_POEMS.vi[Math.floor(Math.random() * LOADING_POEMS.vi.length)],
        jp: LOADING_POEMS.jp[Math.floor(Math.random() * LOADING_POEMS.jp.length)]
    });

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
    ]).finally(() => {
        setTimeout(() => setIsLoading(false), 2000);
    });
  }, []);

  // Helpers
  const getTxt = (key: string) => { const d = dynamicSections[key]; if(!d) return null; return (currentLang==='en'?d.contentEn:(currentLang==='vi'?d.contentVi:d.contentJp)) || null; };
  const getJson = <T,>(key: string): T | null => { const d = dynamicSections[key]; if(!d) return null; try { return JSON.parse((currentLang==='en'?d.contentEn:(currentLang==='vi'?d.contentVi:d.contentJp))); } catch { return null; } };
  
  const hero = (() => {
      const d = getJson<HeroData>('hero');
      return d || { fullName: "Vu Tri Dung", nickName1: "David Miller", nickName2: "Akina Aoi", avatarUrl: "/pictures/VuTriDung.jpg", greeting: "Hi, I am", description: "Loading...", typewriter: "[]" };
  })();
  
  const currentMainName = MY_NAMES[currentLang]; 
  const subNames = [
      { lang: 'vi', label: 'VN', val: MY_NAMES.vi },
      { lang: 'en', label: 'GB', val: MY_NAMES.en },
      { lang: 'jp', label: 'JP', val: MY_NAMES.jp }
  ].filter(n => n.val !== currentMainName);

  const getCover = (json: string) => { 
      try { const arr = JSON.parse(json); return (arr.length > 0 && arr[0]) ? arr[0] : "https://placehold.co/600x400/ffc0cb/ffffff?text=Sakura"; } catch { return "https://placehold.co/600x400/ffc0cb/ffffff?text=Sakura"; } 
  };

  const profileBoxes = getJson<SectionBox[]>('profile');
  const contactBoxes = getJson<SectionBox[]>('contact');
  const experienceData = getJson<ExpGroup[]>('experience');

  const getFontFamily = (lang: string) => {
      if (lang === 'vi') return "'Noto Serif', serif";
      if (lang === 'jp') return "'Noto Serif JP', serif";
      return "'Noto Sans', sans-serif";
  };

  // --- [MỚI] HÀM LỌC & SẮP XẾP DỰ ÁN ---
  const filterProjects = (projects: Post[]) => {
      let res = [...projects];
      // 1. Lọc ngôn ngữ
      if (projLang !== "ALL") {
          res = res.filter(p => p.language?.toLowerCase() === projLang.toLowerCase());
      }
      // 2. Sắp xếp thời gian
      res.sort((a, b) => {
          const tA = new Date(a.createdAt).getTime();
          const tB = new Date(b.createdAt).getTime();
          return projSort === "newest" ? tB - tA : tA - tB;
      });
      return res;
  };

  return (
    <main style={{ fontFamily: getFontFamily(currentLang) }}>
        <SakuraFalling />
        <SakuraCursorTrail />
        <SakuraNav t={t} currentLang={currentLang} setCurrentLang={handleSetLanguage} resumeUrl={globalConfig?.resumeUrl} />
        
        {isLoading ? (
            <div style={{
                position: 'fixed', inset: 0, zIndex: 9999, background: '#fff0f5',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                textAlign: 'center', padding: '20px'
            }}>
                <div style={{fontSize: '4rem', animation: 'spin-slow 3s linear infinite', marginBottom: '30px'}}>🌸</div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    <h2 style={{fontSize: '1.2rem', color: '#5d4037', fontFamily: "'Noto Sans', sans-serif", fontStyle: 'italic'}}>&quot;{loadingQuotes.en}&quot;</h2>
                    <h2 style={{fontSize: '1.2rem', color: '#ff69b4', fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontWeight: 'bold'}}>&quot;{loadingQuotes.vi}&quot;</h2>
                    <h2 style={{fontSize: '1.4rem', color: '#8d6e63', fontFamily: "'Noto Serif JP', serif"}}>{loadingQuotes.jp}</h2>
                </div>
                <p style={{marginTop: '40px', color: '#ff69b4', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '3px', animation: 'pulse 1s infinite'}}>INITIALIZING...</p>
            </div>
        ) : (
            <div>
                {/* 00. HERO SECTION */}
                <section id="home" className="hero-section">
                    <div className="hero-text">
                        <span className="hero-greeting">{hero.greeting}</span>
                        <h1 className="hero-name" style={{fontFamily: getFontFamily(currentLang)}}>{currentMainName}</h1>
                        <div className="hero-names-box">
                            {subNames.map((sub, idx) => (
                                <span key={idx} className="hero-badge"><strong style={{color: '#ff69b4', marginRight: '5px'}}>{sub.label}</strong>{sub.val}</span>
                            ))}
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
                        <img src="/pictures/VuTriDung.jpg" alt="Real Face" className="avatar-real" />
                        <img src="/pictures/sakura_avatar.png" alt="Frame" className="avatar-frame-overlay" />
                    </div>
                </section>

                <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px'}}>
                    
                    {/* 01. ABOUT ME */}
                    <section id="about" style={{padding: '80px 0', textAlign: 'center', scrollMarginTop: '100px'}}>
                        <h2 className="section-title"><span>✿ {t.sec_about} ✿</span></h2>
                        {getTxt("about") ? (
                            <div className="glass-box">
                                <p style={{whiteSpace: 'pre-line', lineHeight: '1.8'}}>{getTxt("about")}</p>
                            </div>
                        ) : <EmptyState lang={currentLang} />}
                    </section>

                    {/* 02. PROFILE */}
                    <section id="profile" style={{padding: '80px 0', scrollMarginTop: '100px'}}>
                        <h2 className="section-title"><span>✿ {t.sec_profile} ✿</span></h2>
                        {profileBoxes && profileBoxes.length > 0 ? (
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px'}}>
                                {profileBoxes.map(box => (
                                    <div key={box.id} className="glass-box" style={{padding: '30px', background: 'rgba(255,255,255,0.9)'}}>
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
                        ) : <EmptyState lang={currentLang} />}
                    </section>

                    {/* 03. CERTIFICATES */}
                    <section id="certificates" style={{padding: '80px 0', scrollMarginTop: '100px'}}>
                        <h2 className="section-title"><span>✿ {t.sec_cert} ✿</span></h2>
                        <h3 style={{fontSize: '1.5rem', marginBottom: '20px', color: '#4a3b32', textAlign: 'center', fontWeight: 'bold'}}>❖ {t.cat_lang}</h3>
                        <div className="grid-3" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px', marginBottom: '50px'}}>
                            {dbLangCerts.length > 0 ? dbLangCerts.map(p => (
                                <Link key={p.id} href={`/blog/${p.id}`} className="glass-box" style={{padding: 0, overflow: 'hidden', display: 'block', transition: '0.3s'}}>
                                    <div style={{height: 180, position: 'relative'}}><img src={getCover(p.images)} alt={p.title} style={{width:'100%', height:'100%', objectFit:'cover'}} /></div>
                                    <div style={{padding: '20px'}}><h4 style={{fontWeight: 'bold', color: '#5d4037'}}>{p.title}</h4></div>
                                </Link>
                            )) : <EmptyState lang={currentLang} message={currentLang === 'vi' ? "Chưa có chứng chỉ 🍃" : (currentLang === 'jp' ? "証明書が見つかりません 🍃" : "No certificates found 🍃")} />}
                        </div>
                        
                        <h3 style={{fontSize: '1.5rem', marginBottom: '20px', color: '#4a3b32', textAlign: 'center', fontWeight: 'bold'}}>❖ {t.cat_tech}</h3>
                        <div className="grid-3" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px'}}>
                            {dbTechCerts.length > 0 ? dbTechCerts.map(p => (
                                <Link key={p.id} href={`/blog/${p.id}`} className="glass-box" style={{padding: 0, overflow: 'hidden', display: 'block', transition: '0.3s'}}>
                                    <div style={{height: 180, position: 'relative'}}><img src={getCover(p.images)} alt={p.title} style={{width:'100%', height:'100%', objectFit:'cover'}} /></div>
                                    <div style={{padding: '20px'}}><h4 style={{fontWeight: 'bold', color: '#5d4037'}}>{p.title}</h4></div>
                                </Link>
                            )) : <EmptyState lang={currentLang} message={currentLang === 'vi' ? "Chưa có chứng chỉ 🍃" : (currentLang === 'jp' ? "証明書が見つかりません 🍃" : "No certificates found 🍃")} />}
                        </div>
                    </section>

                    {/* 04. CAREER */}
                    <section id="career" style={{padding: '80px 0', scrollMarginTop: '100px'}}>
                        <h2 className="section-title"><span>✿ {t.sec_career} ✿</span></h2>
                        {getTxt("career") ? (
                            <div className="glass-box" style={{borderLeft: '10px solid #ff69b4'}}>
                                <p style={{whiteSpace: 'pre-line', fontStyle: 'italic', fontSize: '1.2rem', lineHeight: '1.8', color: '#5d4037'}}>&quot;{getTxt("career")}&quot;</p>
                            </div>
                        ) : <EmptyState lang={currentLang} />}
                    </section>

                    {/* 05. ACHIEVEMENTS */}
                    <section id="achievements" style={{padding: '80px 0', scrollMarginTop: '100px'}}>
                        <h2 className="section-title"><span>✿ {t.sec_achievements} ✿</span></h2>
                        <p style={{textAlign: 'center', marginBottom: 30, color: '#4a3b32', fontWeight: 'bold'}}>{t.achievements_desc}</p>
                        {dbAchievements.length > 0 ? (
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px'}}>
                                {dbAchievements.map(p => (
                                    <Link key={p.id} href={`/blog/${p.id}`} className="glass-box" style={{padding: 0, overflow: 'hidden', display: 'block'}}>
                                        <div style={{height: 200, position: 'relative'}}><img src={getCover(p.images)} alt={p.title} style={{width:'100%', height:'100%', objectFit:'cover'}} /></div>
                                        <div style={{padding: '20px'}}><h4 style={{fontWeight: 'bold', color: '#5d4037'}}>{p.title}</h4></div>
                                    </Link>
                                ))}
                            </div>
                        ) : <EmptyState lang={currentLang} />}
                    </section>

                    {/* 06. SKILLS */}
                    <section id="skills" style={{padding: '80px 0', scrollMarginTop: '100px'}}>
                        <h2 className="section-title"><span>✿ {t.sec_skills} ✿</span></h2>
                        {getTxt("skills") ? (
                            <div className="glass-box" style={{textAlign: 'center'}}>
                                <p style={{whiteSpace: 'pre-line', fontSize: '1.2rem', lineHeight: '2'}}>{getTxt("skills")}</p>
                            </div>
                        ) : <EmptyState lang={currentLang} />}
                    </section>

                    {/* 07. EXPERIENCE */}
                    <section id="experience" style={{padding: '80px 0', scrollMarginTop: '100px'}}>
                        <h2 className="section-title"><span>✿ {t.sec_exp} ✿</span></h2>
                        {experienceData && experienceData.length > 0 ? (
                            <div style={{borderLeft: '2px solid #ffb7b2', paddingLeft: '30px'}}>
                                {experienceData.map((group) => (
                                    <div key={group.id} style={{marginBottom: 50}}>
                                        <h3 style={{color: '#ff69b4', marginBottom: 20, fontSize: '1.5rem', background: 'rgba(255,255,255,0.8)', display: 'inline-block', padding: '5px 15px', borderRadius: '10px'}}>{group.title}</h3>
                                        {group.items.map(item => (
                                            <div key={item.id} style={{marginBottom: '40px', position: 'relative'}}>
                                                <div style={{position: 'absolute', left: '-36px', top: '0', width: '14px', height: '14px', background: '#ff69b4', borderRadius: '50%', border: '3px solid white', boxShadow: '0 0 0 2px #ffb7b2'}}></div>
                                                <div className="glass-box" style={{padding: '25px', background: 'rgba(255,255,255,0.95)'}}>
                                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap'}}>
                                                        <span style={{fontSize: '1.2rem', fontWeight: 'bold', color: '#5d4037'}}>{item.role}</span>
                                                        <span style={{background: '#fff0f5', color: '#ff69b4', padding: '5px 15px', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.9rem'}}>{item.time}</span>
                                                    </div>
                                                    <ul style={{paddingLeft: 20}}>
                                                        {item.details.map((l, i) => <li key={i} style={{listStyle: 'disc', fontSize: '0.95rem', marginBottom: '5px', color: '#666'}}>{l}</li>)}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : <EmptyState lang={currentLang} />}
                    </section>

                    {/* 08. PROJECTS (ĐÃ NÂNG CẤP BỘ LỌC) */}
                    <section id="projects" style={{padding: '80px 0', scrollMarginTop: '100px'}}>
                        <h2 className="section-title"><span>✿ {t.sec_proj} ✿</span></h2>
                        
                        {/* --- [MỚI] BỘ ĐIỀU KHIỂN LỌC & SẮP XẾP --- */}
                        <div className="glass-box" style={{
                            marginBottom: '40px', padding: '15px 25px', 
                            background: 'rgba(255,255,255,0.9)', borderRadius: '50px',
                            display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'center',
                            boxShadow: '0 4px 15px rgba(255, 105, 180, 0.15)'
                        }}>
                            {/* Nút Lọc Ngôn ngữ (Pills) */}
                            <div style={{display: 'flex', gap: '10px'}}>
                                {[
                                    {v: "ALL", l: "✨ All"},
                                    {v: "vi", l: "🇻🇳 VI"},
                                    {v: "en", l: "🇬🇧 EN"},
                                    {v: "jp", l: "🇯🇵 JP"}
                                ].map(langOpt => (
                                    <button
                                        key={langOpt.v}
                                        onClick={() => setProjLang(langOpt.v)}
                                        style={{
                                            padding: '8px 16px', borderRadius: '20px', border: 'none',
                                            cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold',
                                            transition: 'all 0.3s',
                                            background: projLang === langOpt.v ? '#ff69b4' : '#ffe4e1',
                                            color: projLang === langOpt.v ? 'white' : '#8d6e63',
                                            boxShadow: projLang === langOpt.v ? '0 2px 8px rgba(255,105,180,0.4)' : 'none',
                                            transform: projLang === langOpt.v ? 'scale(1.05)' : 'scale(1)'
                                        }}
                                    >
                                        {langOpt.l}
                                    </button>
                                ))}
                            </div>

                            {/* Nút Sắp xếp */}
                            <button 
                                onClick={() => setProjSort(prev => prev === "newest" ? "oldest" : "newest")}
                                style={{
                                    padding: '8px 16px', borderRadius: '20px',
                                    background: 'white', border: '2px solid #ffb7b2',
                                    color: '#ff69b4', fontWeight: 'bold', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem'
                                }}
                            >
                                {projSort === "newest" ? "⌚ Newest First" : "⌛ Oldest First"}
                            </button>
                        </div>

                        {/* HIỂN THỊ DANH SÁCH DỰ ÁN */}
                        {[
                            { title: t.cat_uni_proj, data: dbUniProjects },
                            { title: t.cat_personal_proj, data: dbPersonalProjects }
                        ].map((cat, idx) => {
                            // Áp dụng bộ lọc cho từng danh mục
                            const filteredData = filterProjects(cat.data);
                            
                            return (
                                <div key={idx} style={{marginBottom: '60px'}}>
                                    <h3 style={{fontSize: '1.5rem', color: '#4a3b32', marginBottom: '20px', borderLeft: '5px solid #ff69b4', paddingLeft: '15px', fontWeight: 'bold'}}>
                                        {cat.title} <span style={{fontSize: '0.9rem', color: '#aaa', fontWeight: 'normal'}}>({filteredData.length})</span>
                                    </h3>
                                    
                                    {filteredData.length > 0 ? (
                                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px'}}>
                                            {filteredData.map(p => (
                                                <Link key={p.id} href={`/blog/${p.id}`} className="glass-box" style={{padding: 0, overflow: 'hidden', display: 'block', transition: '0.3s'}}>
                                                    <div style={{height: '200px', overflow: 'hidden', position: 'relative'}}>
                                                        <img src={getCover(p.images)} alt={p.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                                        {/* Nhãn ngôn ngữ trên ảnh */}
                                                        {p.language && (
                                                            <div style={{position: 'absolute', top: 10, right: 10, background: 'rgba(255, 105, 180, 0.9)', color: 'white', padding: '4px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold'}}>
                                                                {p.language.toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{padding: '20px'}}>
                                                        <h4 style={{fontWeight: 'bold', color: '#5d4037', marginBottom: '5px'}}>{p.title}</h4>
                                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                            <span style={{fontSize: '0.75rem', color: '#aaa'}}>
                                                                {new Date(p.createdAt).toLocaleDateString()}
                                                            </span>
                                                            <span style={{fontSize: '0.8rem', color: '#ff69b4', fontWeight: 'bold', textTransform: 'uppercase'}}>Details →</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{textAlign: 'center', padding: '30px', background: 'rgba(255,255,255,0.5)', borderRadius: '20px', border: '2px dashed #ffc1e3', color: '#8d6e63'}}>
                                            🍃 Không có dự án nào (Bộ lọc: {projLang})
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </section>

                    {/* 09. BLOG */}
                    <section id="blog" style={{padding: '80px 0', scrollMarginTop: '100px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40}}>
                            <h2 className="section-title" style={{marginBottom: 0, width: 'auto'}}>
                                <span>✿ 09. {currentLang === 'vi' ? 'BLOG & CÂU CHUYỆN' : (currentLang === 'jp' ? 'ブログ・物語' : 'BLOG & STORIES')} ✿</span>
                            </h2>
                            <Link href="/blog" style={{background: 'white', border: '2px solid #ffb7b2', padding: '10px 20px', borderRadius: '30px', color: '#ff69b4', fontWeight: 'bold'}}>
                                {currentLang === 'vi' ? 'Xem tất cả →' : (currentLang === 'jp' ? 'すべて見る →' : 'View All →')}
                            </Link>
                        </div>
                        {latestPosts.length > 0 ? (
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px'}}>
                                {latestPosts.map(p => (
                                    <Link key={p.id} href={`/blog/${p.id}`} className="glass-box" style={{padding: 0, overflow: 'hidden', display: 'block'}}>
                                        <div style={{height: 180, position: 'relative'}}><img src={getCover(p.images)} alt={p.title} style={{width:'100%', height:'100%', objectFit:'cover'}} /></div>
                                        <div style={{padding: '20px'}}>
                                            <h4 style={{fontWeight: 'bold', color: '#5d4037', marginBottom: '5px'}}>{p.title}</h4>
                                            <span style={{fontSize: '0.8rem', color: '#aaa'}}>{new Date(p.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : <EmptyState lang={currentLang} />}
                    </section>

                    {/* 10. GALLERY */}
                    <section id="gallery" style={{padding: '80px 0', scrollMarginTop: '100px'}}>
                        <h2 className="section-title">
                            <span>✿ 10. {currentLang === 'vi' ? 'THƯ VIỆN ẢNH' : (currentLang === 'jp' ? 'ギャラリー' : 'GALLERY')} ✿</span>
                        </h2>
                        <h3 style={{fontSize: '1.2rem', marginBottom: 20, color: '#4a3b32', fontWeight: 'bold'}}>✿ {t.cat_it_event}</h3>
                        {dbItEvents.length > 0 ? (
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px'}}>
                                {dbItEvents.map(p => (
                                    <Link key={p.id} href={`/blog/${p.id}`} className="glass-box" style={{padding: 0, overflow: 'hidden', display: 'block'}}>
                                        <div style={{height: 200, position: 'relative'}}><img src={getCover(p.images)} alt={p.title} style={{width:'100%', height:'100%', objectFit:'cover'}} /></div>
                                        <div style={{padding: '20px'}}><h4 style={{fontWeight: 'bold', color: '#5d4037'}}>{p.title}</h4></div>
                                    </Link>
                                ))}
                            </div>
                        ) : <EmptyState lang={currentLang} />}
                    </section>

                    {/* 11. CONTACT */}
                    <section id="contact" style={{padding: '80px 0', marginBottom: '50px', scrollMarginTop: '100px'}}>
                        <div style={{textAlign: 'center', maxWidth: '1000px', margin: '0 auto'}}>
                            <h2 className="section-title" style={{marginBottom: '20px'}}>
                                <span>✿ 11. {currentLang === 'vi' ? 'LIÊN HỆ' : (currentLang === 'jp' ? 'お問い合わせ' : 'CONTACT')} ✿</span>
                            </h2>
                            <p style={{fontSize: '1.2rem', color: '#4a3b32', marginBottom: '40px'}}>
                                {currentLang === 'vi' ? 'Hãy cùng tạo ra những điều tuyệt vời! ✨' : (currentLang === 'jp' ? '一緒に素晴らしいものを作りましょう！✨' : 'Let\'s create something beautiful together! ✨')}
                            </p>

                            {/* LOGIC HIỂN THỊ BOXES */}
                            {contactBoxes && contactBoxes.length > 0 ? (
                                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', textAlign: 'left'}}>
                                    {contactBoxes.map((box) => (
                                        <div key={box.id} className="glass-box" style={{padding: '30px', background: 'rgba(255,255,255,0.95)', height: '100%'}}>
                                            {/* Tiêu đề Box (Ví dụ: Main Contact) */}
                                            <h3 style={{
                                                color: '#ff69b4', 
                                                borderBottom: '2px dashed #ffc1e3', 
                                                paddingBottom: '10px', 
                                                marginBottom: '20px',
                                                fontSize: '1.3rem',
                                                fontWeight: 'bold'
                                            }}>
                                                ✿ {box.title}
                                            </h3>

                                            {/* Danh sách items trong Box */}
                                            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                                                {box.items.map((item, idx) => {
                                                    // XỬ LÝ LINK THÔNG MINH
                                                    let content;
                                                    const val = item.value;

                                                    if (val.includes('@')) {
                                                        // 1. Xử lý Email -> Bấm là gửi mail
                                                        content = (
                                                            <a href={`mailto:${val}`} style={{color: '#5d4037', fontWeight: 'bold', textDecoration: 'none', transition: '0.3s'}} className="hover:text-[#ff69b4]">
                                                                {val} ✉
                                                            </a>
                                                        );
                                                    } else if (val.startsWith('http')) {
                                                        // 2. Xử lý Link Web -> Bấm là mở tab mới
                                                        content = (
                                                            <a href={val} target="_blank" rel="noopener noreferrer" style={{color: '#007bff', fontWeight: 'bold', textDecoration: 'none', wordBreak: 'break-all'}} className="hover:underline">
                                                                {val} ↗
                                                            </a>
                                                        );
                                                    } else if (val.match(/^[0-9+ ]+$/) && val.length > 8) {
                                                        // 3. Xử lý Số điện thoại -> Bấm là gọi
                                                        content = (
                                                            <a href={`tel:${val.replace(/\s/g, '')}`} style={{color: '#28a745', fontWeight: 'bold', textDecoration: 'none'}}>
                                                                {val} 📞
                                                            </a>
                                                        );
                                                    } else {
                                                        // 4. Text thường
                                                        content = <span style={{color: '#5d4037', fontWeight: 'bold'}}>{val}</span>;
                                                    }

                                                    return (
                                                        <div key={idx} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #fff0f5', paddingBottom: '8px'}}>
                                                            <span style={{fontSize: '0.85rem', color: '#aaa', fontWeight: 'bold', textTransform: 'uppercase', marginRight: '10px'}}>
                                                                {item.label}
                                                            </span>
                                                            <div style={{textAlign: 'right'}}>
                                                                {content}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : <EmptyState lang={currentLang} />}
                        </div>
                    </section>

                </div>
            </div>
        )}
    </main>
  );
}