"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, use } from "react";
import Link from "next/link"; 
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import SakuraFalling from "@/components/SakuraFalling"; 
import SakuraNav from "@/components/SakuraNav";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { translations, Lang } from "@/lib/data"; 
import { getPostById, getSectionContent } from "@/lib/actions"; 

// Types
type Post = { 
    id: string; 
    titleVi: string; 
    titleEn: string; 
    titleJp: string; 
    contentVi: string; 
    contentEn: string; 
    contentJp: string; 
    images: string; 
    createdAt: Date | string; 
    tag?: string; 
};

export default function BlogPost({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [currentLang, setCurrentLang] = useState<Lang>("en");
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [globalConfig, setGlobalConfig] = useState<any>(null);

    const t = translations[currentLang]; 

    useEffect(() => {
        const savedLang = localStorage.getItem("sakura_lang") as Lang;
        if (savedLang) setCurrentLang(savedLang);

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

    const displayTitle = post ? (currentLang === 'vi' ? post.titleVi : currentLang === 'jp' ? post.titleJp : post.titleEn) : "";
    const displayContent = post ? (currentLang === 'vi' ? post.contentVi : currentLang === 'jp' ? post.contentJp : post.contentEn) : "";

    const getImageList = (json: string): string[] => { 
        try { 
            const parsed = JSON.parse(json); 
            return Array.isArray(parsed) ? parsed.filter(i => i) : []; 
        } catch { return []; } 
    };

    const images = post ? getImageList(post.images) : [];

    return (
        <>
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
                        
                        <Link href="/blog" style={{
                            display: 'inline-flex', alignItems: 'center', marginBottom: '30px', 
                            padding: '10px 25px', borderRadius: '30px', 
                            background: 'white', color: '#ff69b4', textDecoration: 'none',
                            fontWeight: 'bold', border: '1px solid #ffc1e3',
                            boxShadow: '0 4px 10px rgba(255,105,180,0.1)', transition: '0.3s'
                        }}>
                            {currentLang === 'vi' ? '← Quay lại' : (currentLang === 'jp' ? '← 戻る' : '← Back to Blog')}
                        </Link>

                        <div className="glass-box" style={{
                            background: 'rgba(255, 255, 255, 0.95)', 
                            borderRadius: '30px', 
                            padding: '50px 40px', 
                            boxShadow: '0 10px 30px rgba(255,105,180,0.15)',
                            border: '1px solid white'
                        }}>
                            
                            <div style={{borderBottom: '2px dashed #ffc1e3', paddingBottom: '30px', marginBottom: '30px', textAlign: 'center'}}>
                                <div style={{display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '15px'}}>
                                    <span style={{background: '#fff0f5', color: '#ff69b4', padding: '5px 15px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase'}}>
                                        {post.tag || "Story"}
                                    </span>
                                    <span style={{background: '#eee', color: '#555', padding: '5px 15px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase'}}>
                                        {currentLang.toUpperCase()}
                                    </span>
                                </div>
                                
                                <h1 style={{fontSize: '2.5rem', color: '#5d4037', lineHeight: '1.3', marginBottom: '15px', fontWeight: 'bold'}}>
                                    {displayTitle}
                                </h1>
                                <p style={{color: '#8d6e63', fontSize: '0.9rem', fontStyle: 'italic'}}>
                                    Posted on {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            {/* NỘI DUNG BÀI VIẾT ĐÃ TÍCH HỢP MARKDOWN */}
                            <div 
                                className="blog-content"
                                style={{
                                    fontSize: '1.15rem', 
                                    lineHeight: '1.9', 
                                    color: '#4a3b32', 
                                    fontFamily: currentLang === 'en' ? '"Noto Sans", sans-serif' : '"Noto Serif", serif',
                                    marginBottom: '50px',
                                }}
                            >
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        // Tùy chỉnh hiển thị các thẻ HTML cho hợp tông Sakura
                                        a: ({node, ...props}) => <a {...props} style={{color: '#ff69b4', textDecoration: 'underline', fontWeight: 'bold'}} target="_blank" rel="noopener noreferrer" />,
                                        p: ({node, ...props}) => <p {...props} style={{marginBottom: '1.2em'}} />,
                                        h1: ({node, ...props}) => <h1 {...props} style={{fontSize: '2rem', color: '#d81b60', marginTop: '1.5em', marginBottom: '0.5em', fontWeight: 'bold'}} />,
                                        h2: ({node, ...props}) => <h2 {...props} style={{fontSize: '1.75rem', color: '#d81b60', marginTop: '1.5em', marginBottom: '0.5em', fontWeight: 'bold'}} />,
                                        h3: ({node, ...props}) => <h3 {...props} style={{fontSize: '1.5rem', color: '#d81b60', marginTop: '1.2em', marginBottom: '0.5em', fontWeight: 'bold'}} />,
                                        ul: ({node, ...props}) => <ul {...props} style={{listStyleType: 'disc', paddingLeft: '2em', marginBottom: '1.2em'}} />,
                                        ol: ({node, ...props}) => <ol {...props} style={{listStyleType: 'decimal', paddingLeft: '2em', marginBottom: '1.2em'}} />,
                                        li: ({node, ...props}) => <li {...props} style={{marginBottom: '0.5em'}} />,
                                        strong: ({node, ...props}) => <strong {...props} style={{color: '#d81b60', fontWeight: 'bold'}} />,
                                        blockquote: ({node, ...props}) => <blockquote {...props} style={{borderLeft: '4px solid #ff69b4', paddingLeft: '1rem', fontStyle: 'italic', color: '#8d6e63', background: '#fff0f5', padding: '10px', borderRadius: '0 10px 10px 0'}} />,
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                        code: ({node, inline, className, children, ...props}: any) => 
                                            inline 
                                                ? <code {...props} style={{background: '#fff0f5', color: '#d81b60', padding: '2px 6px', borderRadius: '6px', fontSize: '0.9em', fontFamily: 'monospace'}}>{children}</code>
                                                : <pre style={{background: '#fafafa', padding: '15px', borderRadius: '15px', overflowX: 'auto', marginBottom: '1.2em', border: '1px solid #ffc1e3'}}><code {...props} style={{color: '#5d4037', fontFamily: 'monospace', fontSize: '0.9em'}}>{children}</code></pre>
                                    }}
                                >
                                    {displayContent}
                                </ReactMarkdown>
                            </div>

                            {/* ALBUM ẢNH */}
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
                                                    alt={`${displayTitle} - ${index + 1}`} 
                                                    style={{width: '100%', height: 'auto', display: 'block'}} 
                                                />
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

            {!isLoading && <LanguageSwitcher currentLang={currentLang} setCurrentLang={handleSetLanguage} />}
        </>
    );
}