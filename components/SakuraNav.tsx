"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Lang } from "@/lib/data";
import { usePathname } from "next/navigation"; // Import thêm cái này để check trang

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

export default function SakuraNav({ t, currentLang, setCurrentLang, resumeUrl }: TopNavProps) {
  const pathname = usePathname(); // Lấy đường dẫn hiện tại
  const navItems = ['home', 'about', 'profile', 'certificates', 'career', 'achievements', 'skills', 'experience', 'projects', 'blog', 'gallery', 'contact'];
  
  const row1 = navItems.slice(0, 6);
  const row2 = navItems.slice(6, 12);

  const NavLink = ({ item }: { item: string }) => {
    let label = t[`nav_${item}`] || item.toUpperCase();
    // Fix label tiếng Anh nếu file dịch thiếu
    if(item === 'certificates') label = t.nav_cert || "CERTIFICATES"; 
    if(item === 'experience') label = t.nav_exp || "EXPERIENCE"; 
    if(item === 'projects') label = t.nav_proj || "PROJECTS";

    // LOGIC LINK THÔNG MINH:
    // 1. Nếu là Home -> Về trang chủ
    // 2. Nếu là Blog -> Sang trang /blog
    // 3. Nếu là các mục khác:
    //    - Đang ở trang chủ: Cuộn xuống (#id)
    //    - Đang ở trang khác (vd trang blog): Về trang chủ rồi cuộn (/#id)
    let href = "";
    if (item === 'home') href = "/";
    else if (item === 'blog') href = "/blog";
    else href = pathname === '/' ? `#${item}` : `/#${item}`;

    return <Link href={href} className="nav-link">{label}</Link>;
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="nav-logo-img">
           <img src="/pictures/VuTriDung.jpg" alt="Real Avatar" className="nav-real-img" />
           <img src="/pictures/sakura_avatar.png" alt="Frame" className="nav-frame-img" />
        </div>
        
        <div className="nav-logo-text" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '12px' }}>
            <span className="logo-name" style={{
                fontFamily: currentLang === 'en' ? 'inherit' : (currentLang === 'jp' ? "'Noto Serif JP', serif" : "'Noto Serif', serif"),
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: '#5d4037',
                lineHeight: '1.2',
                whiteSpace: 'nowrap' // Giữ tên trên 1 dòng
            }}>
                {NAMES[currentLang]}
            </span>
            <span className="logo-tag" style={{ fontSize: '0.75rem', color: '#ff69b4', fontWeight: 'bold', marginTop: '2px' }}>
                {TAGLINES[currentLang]}
            </span>
        </div>
      </div>

      <div className="nav-center">
          <div className="nav-row">{row1.map(i => <NavLink key={i} item={i} />)}</div>
          <div className="nav-row" style={{borderTop: '1px dashed #ffc1e3', paddingTop: '2px'}}>{row2.map(i => <NavLink key={i} item={i} />)}</div>
      </div>

      <div className="nav-right" style={{gap: '15px'}}>
        <a 
          href="https://personal-portfolio-vu-tri-dung-dyna.vercel.app" 
          className="btn-switch-theme"
          target="_blank"
        >
           👾 HACKER VER
        </a>

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