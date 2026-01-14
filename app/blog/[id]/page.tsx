"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, use } from "react";
import Link from "next/link"; 

import SakuraFalling from "@/components/SakuraFalling"; 
import SakuraNav from "@/components/SakuraNav";
import { translations, Lang } from "@/lib/data"; 
import { getPostById, getSectionContent } from "@/lib/actions"; 

// Types
type Post = { id: string; title: string; images: string; content?: string; createdAt: Date | string; tag?: string; language?: string; };

export default function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  // Giải nén params (Next.js 15)
  const { id } = use(params);

  const [currentLang, setCurrentLang] = useState<Lang>("en");
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [globalConfig, setGlobalConfig] = useState<any>(null);

  const t = translations[currentLang]; 

  useEffect(() => {
    // 1. Lấy dữ liệu
    Promise.all([
        getPostById(id),
        getSectionContent("global_config")
    ]).then(([postData, configData]) => {
        if (postData) setPost(postData as unknown as Post);
        if (configData) {
            try { setGlobalConfig(JSON.parse(configData.contentEn)); } catch {}
        }
        setTimeout(() => setIsLoading(false), 500);
    });
  }, [id]);

  const handleSetLanguage = (lang: Lang) => {
    setCurrentLang(lang);
    localStorage.setItem("sakura_lang", lang);
  };

  // Hàm lấy danh sách ảnh (Trả về mảng thay vì 1 ảnh)
  const getImageList = (json: string): string[] => { 
      try { 
          const parsed = JSON.parse(json); 
          return Array.isArray(parsed) ? parsed.filter(i => i) : []; 
      } catch { return []; } 
  };

  const images = post ? getImageList(post.images) : [];

  return (
    <main style={{ fontFamily: "'Noto Sans', sans-serif" }}>
        <SakuraFalling />
        <SakuraNav t={t} currentLang={currentLang} setCurrentLang={handleSetLanguage} resumeUrl={globalConfig?.resumeUrl} />

        {isLoading ? (
            <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ff69b4', fontSize: '1.5rem', fontWeight: 'bold'}}>
                <div style={{display: 'inline-block', animation: 'spin-slow 3s infinite', marginRight: '10px'}}>🌸</div> 
                Opening Scroll...
            </div>
        ) : post ? (
            <div className="container" style={{paddingTop: '120px', paddingBottom: '80px', maxWidth: '900px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px'}}>
                
                {/* Nút Quay Lại */}
                <Link href="/blog" style={{
                    display: 'inline-flex', alignItems: 'center', marginBottom: '30px', 
                    padding: '10px 25px', borderRadius: '30px', 
                    background: 'white', color: '#ff69b4', textDecoration: 'none',
                    fontWeight: 'bold', border: '1px solid #ffc1e3',
                    boxShadow: '0 4px 10px rgba(255,105,180,0.1)', transition: '0.3s'
                }}>
                    ← Back to Blog
                </Link>

                {/* Khung Bài Viết */}
                <div className="glass-box" style={{
                    background: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '30px', 
                    padding: '50px 40px', 
                    boxShadow: '0 10px 30px rgba(255,105,180,0.15)',
                    border: '1px solid white'
                }}>
                    
                    {/* 1. HEADER (Tiêu đề & Thông tin) */}
                    <div style={{borderBottom: '2px dashed #ffc1e3', paddingBottom: '30px', marginBottom: '30px', textAlign: 'center'}}>
                        <div style={{display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '15px'}}>
                            <span style={{background: '#fff0f5', color: '#ff69b4', padding: '5px 15px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase'}}>
                                {post.tag || "Story"}
                            </span>
                            <span style={{background: '#eee', color: '#555', padding: '5px 15px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase'}}>
                                {post.language || "VI"}
                            </span>
                        </div>
                        
                        <h1 style={{fontSize: '2.5rem', color: '#5d4037', lineHeight: '1.3', marginBottom: '15px', fontWeight: 'bold'}}>
                            {post.title}
                        </h1>
                        <p style={{color: '#8d6e63', fontSize: '0.9rem', fontStyle: 'italic'}}>
                            Posted on {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    {/* 2. NỘI DUNG BÀI VIẾT (Đưa lên trên) */}
                    <div 
                        className="blog-content"
                        style={{
                            fontSize: '1.15rem', 
                            lineHeight: '1.9', 
                            color: '#4a3b32', 
                            fontFamily: '"Noto Serif", serif', // Đổi font serif đọc cho sướng mắt
                            marginBottom: '50px',
                            whiteSpace: 'pre-wrap'
                        }}
                    >
                        {post.content}
                    </div>

                    {/* 3. ALBUM ẢNH (Đưa xuống dưới & Hiển thị tất cả) */}
                    {images.length > 0 && (
                        <div style={{marginTop: '40px', borderTop: '2px dashed #ffc1e3', paddingTop: '40px'}}>
                            <h3 style={{color: '#ff69b4', marginBottom: '20px', textAlign: 'center', fontSize: '1.5rem'}}>📸 Gallery</h3>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
                                {images.map((imgUrl, index) => (
                                    <div key={index} style={{
                                        width: '100%', 
                                        borderRadius: '20px', 
                                        overflow: 'hidden', 
                                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                        border: '5px solid white'
                                    }}>
                                        <img 
                                            src={imgUrl} 
                                            alt={`${post.title} - ${index + 1}`} 
                                            style={{width: '100%', height: 'auto', display: 'block'}} 
                                        />
                                        {/* Đánh số ảnh nếu có nhiều hơn 1 */}
                                        {images.length > 1 && (
                                            <div style={{padding: '10px', textAlign: 'center', background: '#fff0f5', color: '#8d6e63', fontSize: '0.9rem', fontStyle: 'italic'}}>
                                                Image {index + 1} / {images.length}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        ) : (
            <div style={{textAlign: 'center', paddingTop: '150px'}}>
                <h1 style={{color: '#8d6e63', fontSize: '2rem'}}>Post not found 🍃</h1>
                <Link href="/blog" style={{color: '#ff69b4', fontWeight: 'bold', textDecoration: 'underline'}}>Return Home</Link>
            </div>
        )}
    </main>
  );
}