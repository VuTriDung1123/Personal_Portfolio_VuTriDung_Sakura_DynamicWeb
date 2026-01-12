"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useMemo } from "react";
import Link from "next/link"; 

// --- IMPORT COMPONENT SAKURA ---
import SakuraFalling from "@/components/SakuraFalling"; 
import SakuraNav from "@/components/SakuraNav";

import { translations, Lang } from "@/lib/data"; 
import { getAllPosts } from "@/lib/actions"; 

// Types
type Post = { id: string; title: string; images: string; createdAt: Date | string; tag?: string; language?: string; content?: string; };

export default function BlogPage() {
  const [currentLang, setCurrentLang] = useState<Lang>("en");
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const t = translations[currentLang]; 

  useEffect(() => {
    getAllPosts().then((data) => {
        if (data) setPosts(data as unknown as Post[]);
        setTimeout(() => setIsLoading(false), 500);
    });
  }, []);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
  }, [posts, search]);

  const getCover = (json: string) => { 
      try { const arr = JSON.parse(json); return (arr.length > 0 && arr[0]) ? arr[0] : "https://placehold.co/600x400/ffc0cb/ffffff?text=Sakura+Blog"; } catch { return "https://placehold.co/600x400/ffc0cb/ffffff?text=Sakura+Blog"; } 
  };

  return (
    <main>
        <SakuraFalling />
        <SakuraNav t={t} currentLang={currentLang} setCurrentLang={setCurrentLang} />

        <div className="container" style={{paddingTop: '120px', minHeight: '100vh', paddingBottom: '50px'}}>
            
            {/* Header */}
            <div style={{textAlign: 'center', marginBottom: '50px'}}>
                <h1 className="section-title"><span>🌸 My Blog & Stories 🌸</span></h1>
                <p style={{color: '#8d6e63', fontSize: '1.1rem'}}>Sharing knowledge, projects, and little moments of life.</p>
            </div>

            {/* Search Bar */}
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: '40px'}}>
                <input 
                    type="text" 
                    placeholder="Search posts..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: '15px 25px', 
                        width: '100%', 
                        maxWidth: '500px', 
                        borderRadius: '50px', 
                        border: '2px solid #ffc1e3', 
                        outline: 'none',
                        fontSize: '1rem',
                        boxShadow: '0 4px 10px rgba(255, 105, 180, 0.1)'
                    }}
                />
            </div>

            {/* Loading / Content */}
            {isLoading ? (
                <div style={{textAlign: 'center', color: '#ff69b4', fontSize: '1.5rem', fontWeight: 'bold'}}>
                    🌸 Loading Stories...
                </div>
            ) : (
                <div className="grid-3">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                            <Link key={post.id} href={`/blog/${post.id}`} style={{display: 'block', textDecoration: 'none'}}>
                                <div className="project-card" style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                                    <div style={{height: '200px', overflow: 'hidden', position: 'relative', borderBottom: '1px solid #fff0f5'}}>
                                        <img 
                                            src={getCover(post.images)} 
                                            alt={post.title} 
                                            style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s'}} 
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                    </div>
                                    <div style={{padding: '25px', flex: 1, display: 'flex', flexDirection: 'column'}}>
                                        <span style={{fontSize: '0.8rem', color: '#ff69b4', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px'}}>
                                            {post.tag || "General"}
                                        </span>
                                        <h3 style={{fontSize: '1.2rem', color: '#5d4037', marginBottom: '10px', lineHeight: '1.4'}}>
                                            {post.title}
                                        </h3>
                                        <div style={{marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#aaa'}}>
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                            <span style={{color: '#ff69b4', fontWeight: 'bold'}}>Read More →</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div style={{textAlign: 'center', gridColumn: '1 / -1', padding: '50px', background: 'rgba(255,255,255,0.5)', borderRadius: '20px'}}>
                            <p style={{fontSize: '1.2rem', color: '#8d6e63'}}>No posts found matching "{search}" 🍃</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    </main>
  );
}