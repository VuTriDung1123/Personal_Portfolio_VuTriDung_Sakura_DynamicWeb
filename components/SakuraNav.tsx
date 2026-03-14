"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Lang } from "@/lib/data";
import { usePathname } from "next/navigation"; 
import { useState } from "react";

const NAMES = {
    vi: "Vũ Trí Dũng",
    en: "David Miller",
    jp: "明菜青い"
};

const TAGLINES = {
    vi: "Lập trình viên Đam mê ✨",
    en: "Passionate Dev ✨",
    jp: "情熱的な開発者 ✨"
};

interface TopNavProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  currentLang: Lang;
  setCurrentLang: (lang: Lang) => void;
  resumeUrl?: string; 
}

export default function SakuraNav({ t, currentLang, resumeUrl }: TopNavProps) {
  const pathname = usePathname(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = ['home', 'about', 'profile', 'certificates', 'career', 'achievements', 'skills', 'experience', 'projects', 'blog', 'gallery', 'faq', 'contact'];
  
  const row1 = navItems.slice(0, 7);
  const row2 = navItems.slice(7, 13);

  const NavLink = ({ item }: { item: string }) => {
    let label = t[`nav_${item}`] || item.toUpperCase();
    if(item === 'certificates') label = t.nav_cert || "CERTIFICATES"; 
    if(item === 'experience') label = t.nav_exp || "EXPERIENCE"; 
    if(item === 'projects') label = t.nav_proj || "PROJECTS";
    if(item === 'faq') label = "FAQ / HELP"; 

    let href = "";
    if (item === 'home') href = "/";
    else if (item === 'blog') href = "/blog";
    else if (item === 'faq') href = "/faq";
    else href = pathname === '/' ? `#${item}` : `/#${item}`;

    const isActive = (pathname === href) || (item === 'faq' && pathname === '/faq');

    return (
        <Link 
            href={href} 
            className="nav-link"
            style={isActive ? {color: '#ff69b4', fontWeight: 'bold'} : {}}
            onClick={() => setIsMobileMenuOpen(false)}
        >
            {label}
            {isActive && <div className="nav-active-line" style={{position: 'absolute', bottom: 0, left: '10%', width: '80%', height: '2px', background: '#ff69b4', borderRadius: '2px'}}></div>}
        </Link>
    );
  };

  return (
    <nav className="navbar">
      {/* Container gom tất cả vào 1 hàng trên Mobile */}
      <div className="nav-mobile-container">
          
          <div className="nav-left">
            <div className="nav-logo-img">
               <img src="/pictures/VuTriDung.jpg" alt="Real Avatar" className="nav-real-img" />
               <img src="/pictures/sakura_avatar.png" alt="Frame" className="nav-frame-img" />
            </div>
            
            <div className="nav-logo-text" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '12px' }}>
                <span className="logo-name" style={{
                    fontFamily: currentLang === 'en' ? 'inherit' : (currentLang === 'jp' ? "'Noto Serif JP', serif" : "'Noto Serif', serif"),
                    fontSize: '1.1rem', fontWeight: 'bold', color: '#5d4037', lineHeight: '1.2', whiteSpace: 'nowrap'
                }}>
                    {NAMES[currentLang]}
                </span>
                <span className="logo-tag" style={{ fontSize: '0.75rem', color: '#ff69b4', fontWeight: 'bold', marginTop: '2px', whiteSpace: 'nowrap' }}>
                    {TAGLINES[currentLang]}
                </span>
            </div>
          </div>

          <div className="nav-right" style={{gap: '10px'}}>
            <a href="https://personal-portfolio-vu-tri-dung-dyna.vercel.app" className="btn-switch-theme" target="_blank" title="Hacker Version">
               👾 <span className="desktop-text">HACKER VER</span>
            </a>
            <a href={resumeUrl || "#"} target="_blank" className="btn-cv" title="Download CV">
               📄 <span className="desktop-text">CV ⇩</span>
            </a>
            
            {/* Nút Hamburger chỉ hiện trên Mobile */}
            <button className="mobile-menu-btn mobile-only" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? '✖' : '☰'}
            </button>
          </div>
          
      </div>

      {/* Menu PC */}
      <div className="nav-center desktop-only-flex">
          <div className="nav-row">{row1.map(i => <NavLink key={i} item={i} />)}</div>
          <div className="nav-row" style={{borderTop: '1px dashed rgba(255, 105, 180, 0.3)', paddingTop: '5px'}}>{row2.map(i => <NavLink key={i} item={i} />)}</div>
      </div>

      {/* Menu Dropdown cho Mobile */}
      {isMobileMenuOpen && (
        <div className="mobile-dropdown-menu mobile-only">
           {navItems.map(i => <NavLink key={i} item={i} />)}
        </div>
      )}
    </nav>
  );
}