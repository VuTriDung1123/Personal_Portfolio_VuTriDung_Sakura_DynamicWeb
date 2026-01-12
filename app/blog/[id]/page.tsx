"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import Link from "next/link"; 

// --- IMPORT SAKURA COMPONENTS ---
import SakuraFalling from "@/components/SakuraFalling"; 
import SakuraNav from "@/components/SakuraNav";
import { translations, Lang } from "@/lib/data"; 
import { getPostById } from "@/lib/actions"; 

// Types
type Post = { id: string; title: string; images: string; content?: string; createdAt: Date | string; tag?: string; language?: string; };

export default function BlogPost({ params }: { params: { id: string } }) {
  const [currentLang, setCurrentLang] = useState<Lang>("en");
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const t = translations[currentLang]; 

  useEffect(() => {
    // Lấy ID từ URL và gọi API
    getPostById(params.id).then((data) => {
        if (data) setPost(data as unknown as Post);
        setTimeout(() => setIsLoading(false), 500);
    });
  }, [params.id]);

  const getCover = (json: string) => { 
      try { const arr = JSON.parse(json); return (arr.length > 0 && arr[0]) ? arr[0] : null; } catch { return null; } 
  };

  return (
    <main>
        <SakuraFalling />
        <SakuraNav t={t} currentLang={currentLang} setCurrentLang={setCurrentLang} />

        {isLoading ? (
            <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ff69b4', fontSize: '1.5rem', fontWeight: 'bold'}}>
                🌸 Opening Scroll...
            </div>
        ) : post ? (
            <div className="container" style={{paddingTop: '120px', paddingBottom: '80px', maxWidth: '900px'}}>
                
                {/* Nút Quay Lại */}
                <Link href="/blog" style={{
                    display: 'inline-block', marginBottom: '30px', 
                    padding: '10px 20px', borderRadius: '30px', 
                    background: 'white', color: '#ff69b4', 
                    fontWeight: 'bold', border: '1px solid #ffc1e3',
                    boxShadow: '0 4px 10px rgba(255,105,180,0.1)'
                }}>
                    ← Back to Blog
                </Link>

                {/* Khung Bài Viết */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '30px', 
                    padding: '40px', 
                    boxShadow: '0 10px 30px rgba(255,105,180,0.15)',
                    border: '1px solid white'
                }}>
                    {/* Header Bài Viết */}
                    <div style={{borderBottom: '2px dashed #ffc1e3', paddingBottom: '30px', marginBottom: '30px', textAlign: 'center'}}>
                        <span style={{
                            display: 'inline-block', background: '#fff0f5', color: '#ff69b4', 
                            padding: '5px 15px', borderRadius: '15px', 
                            fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '15px'
                        }}>
                            {post.tag || "Life & Code"}
                        </span>
                        <h1 style={{fontSize: '2.5rem', color: '#5d4037', lineHeight: '1.3', marginBottom: '15px'}}>
                            {post.title}
                        </h1>
                        <p style={{color: '#8d6e63', fontSize: '0.9rem', fontStyle: 'italic'}}>
                            Posted on {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Ảnh Bìa (Nếu có) */}
                    {getCover(post.images) && (
                        <div style={{width: '100%', height: '400px', borderRadius: '20px', overflow: 'hidden', marginBottom: '40px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'}}>
                            <img 
                                src={getCover(post.images)!} 
                                alt={post.title} 
                                style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                            />
                        </div>
                    )}

                    {/* Nội Dung Chính */}
                    <div style={{
                        fontSize: '1.1rem', 
                        lineHeight: '1.8', 
                        color: '#5d4037', 
                        whiteSpace: 'pre-wrap', // Giữ định dạng xuống dòng từ Database
                        fontFamily: '"Nunito", sans-serif'
                    }}>
                        {post.content}
                    </div>

                </div>
            </div>
        ) : (
            <div style={{textAlign: 'center', paddingTop: '150px'}}>
                <h1 style={{color: '#8d6e63'}}>Post not found 🍃</h1>
                <Link href="/blog" style={{color: '#ff69b4', fontWeight: 'bold', textDecoration: 'underline'}}>Return Home</Link>
            </div>
        )}
    </main>
  );
}