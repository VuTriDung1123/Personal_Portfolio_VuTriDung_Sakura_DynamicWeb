"use client";

import { useState, useEffect } from "react";
import SakuraFalling from "@/components/SakuraFalling"; 
import { checkAdmin, getAllPosts, createPost, updatePost, deletePost, getSectionContent, saveSectionContent } from "@/lib/actions";

// Types
type Post = { id: string; title: string; images: string; content?: string; tag?: string; language?: string; };
type SectionData = { sectionKey: string; contentEn: string; contentVi: string; contentJp: string; };

export default function AdminPage() {
  // --- STATES ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'blog' | 'sections'>('blog');
  const [isLoading, setIsLoading] = useState(false);
  
  // Blog States
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null); // null = mode tạo mới
  const [isEditing, setIsEditing] = useState(false); // Bật/tắt form sửa

  // Section States
  const [selectedSection, setSelectedSection] = useState("about");
  const [sectionData, setSectionData] = useState<SectionData>({ sectionKey: "about", contentEn: "", contentVi: "", contentJp: "" });

  // --- 1. LOGIN LOGIC ---
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await checkAdmin(formData);
    if (res.success) {
        setIsLoggedIn(true);
        loadPosts(); // Load dữ liệu ngay khi đăng nhập
    } else {
        alert("Wrong Password! 🌸");
    }
  };

  // --- 2. BLOG LOGIC ---
  const loadPosts = async () => {
      setIsLoading(true);
      const data = await getAllPosts();
      if (data) setPosts(data as unknown as Post[]);
      setIsLoading(false);
  };

  const handleSavePost = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      
      if (editingPost) {
          await updatePost(formData); // Sửa
          alert("Updated successfully! 🌸");
      } else {
          await createPost(formData); // Tạo mới
          alert("Created successfully! 🌸");
      }
      setIsEditing(false);
      setEditingPost(null);
      loadPosts();
  };

  const handleDelete = async (id: string) => {
      if(confirm("Delete this post? 🍃")) {
          await deletePost(id);
          loadPosts();
      }
  };

  // --- 3. SECTION LOGIC ---
  const sectionKeys = ["hero", "about", "profile", "career", "skills", "experience", "contact", "global_config"];

  useEffect(() => {
      if (isLoggedIn && activeTab === 'sections') {
          loadSection(selectedSection);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSection, activeTab]);

  const loadSection = async (key: string) => {
      setIsLoading(true);
      const data = await getSectionContent(key);
      if (data) {
          setSectionData(data as unknown as SectionData);
      } else {
          setSectionData({ sectionKey: key, contentEn: "", contentVi: "", contentJp: "" });
      }
      setIsLoading(false);
  };

  const handleSaveSection = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      await saveSectionContent(formData);
      alert(`Saved section [${selectedSection}]! 🌸`);
  };

  // --- UI STYLES (Inline cho nhanh gọn trang Admin) ---
  const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #ffc1e3', outline: 'none' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#5d4037' };
  const btnStyle = { padding: '10px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px' };

  // --- RENDER ---
  return (
    <main style={{minHeight: '100vh', paddingTop: '50px', paddingBottom: '50px', fontFamily: 'sans-serif'}}>
        <SakuraFalling />

        {/* --- MÀN HÌNH LOGIN --- */ }
        {!isLoggedIn ? (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
                <form onSubmit={handleLogin} style={{
                    background: 'rgba(255,255,255,0.9)', padding: '40px', borderRadius: '30px', 
                    boxShadow: '0 10px 30px rgba(255,105,180,0.2)', width: '350px', textAlign: 'center'
                }}>
                    <h1 style={{color: '#ff69b4', marginBottom: '30px'}}>🌸 Admin Access</h1>
                    <input type="text" name="username" placeholder="Username" style={inputStyle} required />
                    <input type="password" name="password" placeholder="Password" style={inputStyle} required />
                    <button type="submit" style={{...btnStyle, background: '#ff69b4', color: 'white', width: '100%'}}>Login</button>
                </form>
            </div>
        ) : (
            <div className="container" style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px'}}>
                {/* HEADER */}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
                    <h1 style={{color: '#5d4037'}}>🌸 Dashboard</h1>
                    <button onClick={() => setIsLoggedIn(false)} style={{...btnStyle, background: 'white', border: '1px solid #ff69b4', color: '#ff69b4'}}>Logout</button>
                </div>

                {/* TABS */}
                <div style={{marginBottom: '30px', display: 'flex', gap: '15px'}}>
                    <button onClick={() => setActiveTab('blog')} style={{...btnStyle, background: activeTab==='blog'?'#ff69b4':'white', color: activeTab==='blog'?'white':'#5d4037'}}>📝 Manage Blog</button>
                    <button onClick={() => setActiveTab('sections')} style={{...btnStyle, background: activeTab==='sections'?'#ff69b4':'white', color: activeTab==='sections'?'white':'#5d4037'}}>⚙️ Manage Sections</button>
                </div>

                {/* --- TAB 1: BLOG MANAGER --- */}
                {activeTab === 'blog' && (
                    <div>
                        {!isEditing ? (
                            // List View
                            <div style={{background: 'rgba(255,255,255,0.8)', padding: '30px', borderRadius: '20px'}}>
                                <button onClick={() => { setEditingPost(null); setIsEditing(true); }} style={{...btnStyle, background: '#2e7d32', color: 'white', marginBottom: '20px'}}>+ New Post</button>
                                
                                <div style={{display: 'grid', gap: '15px'}}>
                                    {posts.map(p => (
                                        <div key={p.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
                                            <div>
                                                <h3 style={{margin: 0, color: '#5d4037'}}>{p.title}</h3>
                                                <span style={{fontSize: '0.8rem', color: '#aaa'}}>{p.tag} | {p.language}</span>
                                            </div>
                                            <div>
                                                <button onClick={() => { setEditingPost(p); setIsEditing(true); }} style={{...btnStyle, background: '#ffb74d', color: 'white', padding: '5px 15px', fontSize: '0.8rem'}}>Edit</button>
                                                <button onClick={() => handleDelete(p.id)} style={{...btnStyle, background: '#e57373', color: 'white', padding: '5px 15px', fontSize: '0.8rem'}}>Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Edit/Create Form
                            <div style={{background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'}}>
                                <h2 style={{color: '#ff69b4', marginBottom: '20px'}}>{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
                                <form onSubmit={handleSavePost}>
                                    <input type="hidden" name="id" value={editingPost?.id || ""} />
                                    
                                    <label style={labelStyle}>Title</label>
                                    <input name="title" defaultValue={editingPost?.title} style={inputStyle} required />
                                    
                                    <div style={{display: 'flex', gap: '20px'}}>
                                        <div style={{flex: 1}}>
                                            <label style={labelStyle}>Tag (Category)</label>
                                            <input name="tag" defaultValue={editingPost?.tag} style={inputStyle} placeholder="e.g., Tech, Life" />
                                        </div>
                                        <div style={{flex: 1}}>
                                            <label style={labelStyle}>Language</label>
                                            <select name="language" defaultValue={editingPost?.language || "en"} style={inputStyle}>
                                                <option value="en">English</option>
                                                <option value="vi">Tiếng Việt</option>
                                                <option value="jp">Japanese</option>
                                            </select>
                                        </div>
                                    </div>

                                    <label style={labelStyle}>Cover Image (JSON Array)</label>
                                    <input name="images" defaultValue={editingPost?.images || '["https://placehold.co/600x400"]'} style={inputStyle} placeholder='["https://url-to-image.jpg"]' />

                                    <label style={labelStyle}>Content</label>
                                    <textarea name="content" defaultValue={editingPost?.content} style={{...inputStyle, height: '300px', fontFamily: 'monospace'}} required />

                                    <div style={{marginTop: '20px'}}>
                                        <button type="submit" style={{...btnStyle, background: '#ff69b4', color: 'white'}}>Save Post</button>
                                        <button type="button" onClick={() => setIsEditing(false)} style={{...btnStyle, background: '#ccc', color: '#333'}}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {/* --- TAB 2: SECTIONS MANAGER --- */}
                {activeTab === 'sections' && (
                    <div style={{background: 'rgba(255,255,255,0.9)', padding: '30px', borderRadius: '20px'}}>
                        <div style={{marginBottom: '20px'}}>
                            <label style={labelStyle}>Select Section to Edit:</label>
                            <select 
                                value={selectedSection} 
                                onChange={(e) => setSelectedSection(e.target.value)}
                                style={{...inputStyle, width: 'auto', minWidth: '200px'}}
                            >
                                {sectionKeys.map(key => <option key={key} value={key}>{key.toUpperCase()}</option>)}
                            </select>
                        </div>

                        {isLoading ? <p>Loading data...</p> : (
                            <form onSubmit={handleSaveSection}>
                                <input type="hidden" name="sectionKey" value={selectedSection} />
                                
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px'}}>
                                    <div>
                                        <label style={labelStyle}>Content (English)</label>
                                        <textarea name="contentEn" defaultValue={sectionData.contentEn} style={{...inputStyle, height: '400px', fontSize: '0.9rem'}} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Nội dung (Tiếng Việt)</label>
                                        <textarea name="contentVi" defaultValue={sectionData.contentVi} style={{...inputStyle, height: '400px', fontSize: '0.9rem'}} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>内容 (日本語)</label>
                                        <textarea name="contentJp" defaultValue={sectionData.contentJp} style={{...inputStyle, height: '400px', fontSize: '0.9rem'}} />
                                    </div>
                                </div>

                                <button type="submit" style={{...btnStyle, background: '#ff69b4', color: 'white', marginTop: '20px'}}>Save Section</button>
                            </form>
                        )}
                    </div>
                )}

            </div>
        )}
    </main>
  );
}