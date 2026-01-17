"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useMemo } from "react";
import Link from "next/link"; 

import SakuraFalling from "@/components/SakuraFalling"; 
import SakuraNav from "@/components/SakuraNav";
import { translations, Lang } from "@/lib/data"; 
import { getAllPosts, getSectionContent } from "@/lib/actions"; 

// --- TYPES ---
type Post = { 
    id: string; 
    title: string; 
    images: string; 
    createdAt: Date | string; 
    tag?: string; 
    language?: string; 
    content?: string; 
};

// Danh sách Tag (Label để tiếng Anh làm gốc, ta sẽ dịch hiển thị bên dưới)
const ALL_TAGS = [
    { value: "ALL", label: "All Stories" },
    { value: "my_confessions", label: "Confessions" },
    { value: "uni_projects", label: "Uni Projects" },
    { value: "personal_projects", label: "Personal Code" },
    { value: "achievements", label: "Achievements" },
    { value: "it_events", label: "IT Events" },
    { value: "tech_certs", label: "Certificates" },
];

export default function BlogPage() {
  // --- STATE ---
  const [currentLang, setCurrentLang] = useState<Lang>("en");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [globalConfig, setGlobalConfig] = useState<any>(null);

  // State bộ lọc
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const t = translations[currentLang]; 

  // --- INITIAL LOAD ---
  useEffect(() => {
    const savedLang = localStorage.getItem("sakura_lang") as Lang;
    if (savedLang && ['en', 'vi', 'jp'].includes(savedLang)) setCurrentLang(savedLang);

    Promise.all([
        getAllPosts(),
        getSectionContent("global_config")
    ]).then(([data, configData]) => {
        if (data) setPosts(data as unknown as Post[]);
        if (configData) {
            try { setGlobalConfig(JSON.parse(configData.contentEn)); } catch {}
        }
        setTimeout(() => setIsLoading(false), 500);
    });
  }, []);

  const handleSetLanguage = (lang: Lang) => {
    setCurrentLang(lang);
    localStorage.setItem("sakura_lang", lang);
  };

  // --- HELPER: FONT CHỮ THEO NGÔN NGỮ ---
  const getFontFamily = (lang: string) => {
      if (lang === 'vi') return "'Noto Serif', serif"; // Tiếng Việt dùng có chân cho thơ
      if (lang === 'jp') return "'Noto Serif JP', serif"; // Font Nhật chuẩn
      return "'Noto Sans', sans-serif"; // Tiếng Anh hiện đại
  };

  // --- HELPER: DỊCH THUẬT LABEL ---
  const getTrans = (key: string) => {
      if (currentLang === 'vi') {
          if (key === 'search_ph') return "🔍 Tìm kiếm bài viết...";
          if (key === 'sort_new') return "⌚ Mới nhất";
          if (key === 'sort_old') return "⌛ Cũ nhất";
          if (key === 'no_result') return `Không tìm thấy bài viết nào phù hợp với "${search}" 🍃`;
          if (key === 'reset_btn') return "Xóa bộ lọc & Thử lại";
          if (key === 'loading') return "Đang tải bài viết...";
          if (key === 'read_more') return "Đọc tiếp →";
      } else if (currentLang === 'jp') {
          if (key === 'search_ph') return "🔍 記事を検索...";
          if (key === 'sort_new') return "⌚ 最新順";
          if (key === 'sort_old') return "⌛ 古い順";
          if (key === 'no_result') return `「${search}」に一致する記事は見つかりませんでした 🍃`;
          if (key === 'reset_btn') return "フィルターをリセット";
          if (key === 'loading') return "読み込み中...";
          if (key === 'read_more') return "続きを読む →";
      }
      // Default English
      if (key === 'search_ph') return "🔍 Search posts...";
      if (key === 'sort_new') return "⌚ Newest First";
      if (key === 'sort_old') return "⌛ Oldest First";
      if (key === 'no_result') return `No posts found matching "${search}" 🍃`;
      if (key === 'reset_btn') return "Clear Filter & Try Again";
      if (key === 'loading') return "Loading Stories...";
      if (key === 'read_more') return "Read More →";
      return key;
  };

  // --- LOGIC LỌC ---
  const filteredPosts = useMemo(() => {
    let result = [...posts];
    if (search.trim()) result = result.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    if (selectedTag !== "ALL") result = result.filter(p => p.tag === selectedTag);
    result.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [posts, search, selectedTag, sortOrder]);

  const getCover = (json: string) => { 
      try { const arr = JSON.parse(json); return (arr.length > 0 && arr[0]) ? arr[0] : "https://placehold.co/600x400/ffc0cb/ffffff?text=Sakura+Blog"; } catch { return "https://placehold.co/600x400/ffc0cb/ffffff?text=Sakura+Blog"; } 
  };

  return (
    <main style={{ fontFamily: getFontFamily(currentLang), background: '#fff0f5', minHeight: '100vh' }}>
        <SakuraFalling />
        <SakuraNav t={t} currentLang={currentLang} setCurrentLang={handleSetLanguage} resumeUrl={globalConfig?.resumeUrl} />

        <div className="container" style={{maxWidth: '1200px', margin: '0 auto', paddingTop: '120px', paddingBottom: '50px', paddingLeft: '20px', paddingRight: '20px'}}>
            
            {/* Header */}
            <div style={{textAlign: 'center', marginBottom: '40px'}}>
                <h1 className="section-title" style={{marginBottom: '10px', fontSize: '2.5rem', color: '#ff69b4'}}>
                    <span>🌸 {t.nav_blog || "Blog & Stories"} 🌸</span>
                </h1>
                <p style={{color: '#8d6e63', fontSize: '1.1rem', fontStyle: 'italic'}}>
                    {currentLang === 'vi' ? '"Code là thơ, viết bằng logic."' : (currentLang === 'jp' ? '「コードは論理で書かれた詩である。」' : '"Code is poetry, written by logic."')}
                </p>
            </div>

            {/* --- BỘ CÔNG CỤ LỌC --- */}
            <div className="glass-box" style={{
                marginBottom: '40px', padding: '20px', 
                background: 'rgba(255,255,255,0.9)', borderRadius: '25px',
                display: 'flex', flexDirection: 'column', gap: '20px'
            }}>
                {/* Dòng 1: Search & Sort */}
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'space-between', alignItems: 'center'}}>
                    {/* Search Input */}
                    <div style={{flex: 1, minWidth: '250px', position: 'relative'}}>
                        <input 
                            type="text" 
                            placeholder={getTrans('search_ph')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 20px', borderRadius: '50px',
                                border: '2px solid #ffc1e3', outline: 'none', color: '#5d4037',
                                background: 'white', fontSize: '0.95rem', fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    {/* Sort Toggle */}
                    <button 
                        onClick={() => setSortOrder(prev => prev === "newest" ? "oldest" : "newest")}
                        style={{
                            padding: '10px 20px', borderRadius: '50px',
                            background: 'white', border: '2px solid #ffb7b2',
                            color: '#ff69b4', fontWeight: 'bold', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '5px', transition: '0.3s',
                            fontFamily: 'inherit'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#fff0f5'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                    >
                        {sortOrder === "newest" ? getTrans('sort_new') : getTrans('sort_old')}
                    </button>
                </div>

                {/* Dòng 2: Tags Filter */}
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center'}}>
                    {ALL_TAGS.map(tag => (
                        <button
                            key={tag.value}
                            onClick={() => setSelectedTag(tag.value)}
                            style={{
                                padding: '8px 16px', borderRadius: '20px', border: 'none',
                                cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold',
                                transition: 'all 0.3s',
                                background: selectedTag === tag.value ? '#ff69b4' : '#ffe4e1',
                                color: selectedTag === tag.value ? 'white' : '#8d6e63',
                                boxShadow: selectedTag === tag.value ? '0 4px 10px rgba(255,105,180,0.4)' : 'none',
                                transform: selectedTag === tag.value ? 'scale(1.05)' : 'scale(1)',
                                fontFamily: 'inherit'
                            }}
                        >
                            {/* Logic hiển thị Tag Label (Có thể mở rộng dịch thuật nếu cần) */}
                            {tag.label} 
                        </button>
                    ))}
                </div>
            </div>

            {/* --- DANH SÁCH BÀI VIẾT --- */}
            {isLoading ? (
                <div style={{textAlign: 'center', color: '#ff69b4', fontSize: '1.5rem', fontWeight: 'bold', padding: '50px'}}>
                    <div style={{display: 'inline-block', animation: 'spin-slow 3s infinite', marginRight: '10px'}}>🌸</div> 
                    {getTrans('loading')}
                </div>
            ) : (
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px'}}>
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                            <Link key={post.id} href={`/blog/${post.id}`} style={{display: 'block', textDecoration: 'none'}}>
                                <div className="glass-box" style={{height: '100%', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', transition: '0.3s', background: 'white', border: '1px solid white'}}>
                                    
                                    {/* Ảnh Thumbnail */}
                                    <div style={{height: '200px', overflow: 'hidden', position: 'relative', borderBottom: '1px solid #fff0f5'}}>
                                        <img 
                                            src={getCover(post.images)} 
                                            alt={post.title} 
                                            style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s'}} 
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                        <div style={{position: 'absolute', top: 10, right: 10, background: 'rgba(255, 105, 180, 0.9)', color: 'white', padding: '5px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold', backdropFilter: 'blur(5px)'}}>
                                            {post.language?.toUpperCase()}
                                        </div>
                                    </div>

                                    {/* Nội dung tóm tắt */}
                                    <div style={{padding: '25px', flex: 1, display: 'flex', flexDirection: 'column'}}>
                                        <span style={{fontSize: '0.75rem', color: '#ff69b4', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px'}}>
                                            {ALL_TAGS.find(t => t.value === post.tag)?.label || post.tag}
                                        </span>
                                        <h3 style={{fontSize: '1.25rem', color: '#5d4037', marginBottom: '10px', lineHeight: '1.4', fontWeight: 'bold'}}>
                                            {post.title}
                                        </h3>
                                        <div style={{marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#aaa', borderTop:'1px dashed #eee', paddingTop:'15px'}}>
                                            <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                                                📅 {new Date(post.createdAt).toLocaleDateString()}
                                            </span>
                                            <span style={{color: '#ff69b4', fontWeight: 'bold', fontSize: '0.9rem'}}>
                                                {getTrans('read_more')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div style={{textAlign: 'center', gridColumn: '1 / -1', padding: '60px', background: 'rgba(255,255,255,0.6)', borderRadius: '25px', border: '2px dashed #ffc1e3'}}>
                            <div style={{fontSize: '3rem', marginBottom: '10px'}}>🍃</div>
                            <p style={{fontSize: '1.2rem', color: '#8d6e63', fontStyle: 'italic'}}>
                                {getTrans('no_result')}
                            </p>
                            <button onClick={() => {setSearch(""); setSelectedTag("ALL");}} style={{marginTop: '15px', background: 'none', border: 'none', color: '#ff69b4', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit', fontSize: '1.1rem'}}>
                                {getTrans('reset_btn')}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    </main>
  );
}
 // End of File

