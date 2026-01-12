"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Lang } from "@/lib/data";

interface TopNavProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any; currentLang: Lang; setCurrentLang: (l: Lang) => void; resumeUrl?: string; 
}

export default function SakuraNav({ t, currentLang, setCurrentLang, resumeUrl }: TopNavProps) {
  const navItems = ['home', 'about', 'profile', 'certificates', 'career', 'achievements', 'skills', 'experience', 'projects', 'blog', 'gallery', 'contact'];
  const row1 = navItems.slice(0, 6);
  const row2 = navItems.slice(6, 12);

  const NavLink = ({ item }: { item: string }) => {
    let label = t[`nav_${item}`] || item.toUpperCase();
    if(item === 'cert') label = t.nav_cert; if(item === 'exp') label = t.nav_exp; if(item === 'proj') label = t.nav_proj;
    const href = item === 'home' ? '/' : (item === 'blog' ? '/blog' : `#${item}`);
    return <Link href={href} className="nav-link">{label}</Link>;
  };

  return (
    <nav className="navbar">
      {/* TRÁI: Logo */}
      <div className="nav-left">
        <div className="nav-logo-img">
           {/* Dùng thẻ img thường để tránh lỗi Next/Image nếu config sai */}
           <img src="/pictures/VuTriDung.jpg" alt="Avatar" style={{width:'100%', height:'100%', objectFit:'cover'}} />
        </div>
        <div className="nav-logo-text">
            <h1>Vu Tri Dung</h1>
            <span>🌸 Portfolio</span>
        </div>
      </div>

      {/* GIỮA: Menu 2 tầng */}
      <div className="nav-center">
          <div className="nav-row">{row1.map(i => <NavLink key={i} item={i} />)}</div>
          <div className="nav-row" style={{borderTop: '1px dashed #ffc1e3', paddingTop: '2px'}}>{row2.map(i => <NavLink key={i} item={i} />)}</div>
      </div>

      {/* PHẢI: Ngôn ngữ & CV */}
      <div className="nav-right">
        {(['en', 'vi', 'jp'] as const).map(l => (
            <button key={l} onClick={() => setCurrentLang(l)} className={`btn-lang ${currentLang===l ? 'active' : ''}`}>
                {l.toUpperCase()}
            </button>
        ))}
        <a href={resumeUrl || "#"} target="_blank" className="btn-cv">CV ⇩</a>
      </div>
    </nav>
  );
}