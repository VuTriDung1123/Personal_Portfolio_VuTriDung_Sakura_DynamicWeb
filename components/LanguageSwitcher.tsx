"use client";

import { useState, useRef, useEffect } from "react";
import { Lang } from "@/lib/data";

interface Props {
  currentLang: Lang;
  setCurrentLang: (lang: Lang) => void;
}

export default function LanguageSwitcher({ currentLang, setCurrentLang }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSelect = (lang: Lang) => {
    setCurrentLang(lang);
    setIsOpen(false); // Chọn xong tự tắt
  };

  const getFlag = (l: Lang) => {
    if(l === 'vi') return '🇻🇳';
    if(l === 'en') return '🇬🇧';
    return '🇯🇵';
  };

  // UX: Bấm ra ngoài khoảng trống thì tự động đóng Menu lại
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // Dời sang LEFT: 50px, BOTTOM: 90px (Nằm ngay trên nút bấm Nhạc)
    <div ref={menuRef} style={{ position: 'fixed', bottom: '90px', left: '50px', zIndex: 999998 }}>
      
      {/* Nút bấm tròn hiển thị Cờ hiện tại */}
      <button 
        onClick={toggleOpen}
        style={{
          width: '45px', height: '45px', borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,240,245,0.95))',
          border: '2px solid #ffc1e3',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem', cursor: 'pointer',
          boxShadow: isOpen ? '0 0 0 4px rgba(255,105,180,0.2)' : '0 4px 15px rgba(255,105,180,0.3)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
        title="Chọn Ngôn Ngữ"
      >
        {getFlag(currentLang)}
      </button>

      {/* Khung Popup chọn ngôn ngữ */}
      {isOpen && (
        <div style={{
          position: 'absolute', bottom: '55px', left: '0', // Nổi lên trên nút bấm
          background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(16px)',
          borderRadius: '16px', padding: '8px', width: '150px',
          boxShadow: '0 10px 30px rgba(255,105,180,0.25)',
          border: '1px solid rgba(255, 193, 227, 0.6)',
          display: 'flex', flexDirection: 'column', gap: '4px',
          animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {(['vi', 'en', 'jp'] as Lang[]).map(l => (
            <button 
              key={l} 
              onClick={() => handleSelect(l)}
              style={{
                padding: '10px 12px', borderRadius: '10px', border: 'none',
                background: currentLang === l ? 'linear-gradient(135deg, #ff69b4, #ff8da1)' : 'transparent',
                color: currentLang === l ? 'white' : '#5d4037',
                fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '10px',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
              onMouseOver={(e) => { if(currentLang !== l) e.currentTarget.style.background = '#fff0f5'; }}
              onMouseOut={(e) => { if(currentLang !== l) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{fontSize: '1.2rem'}}>{getFlag(l)}</span> 
              {l === 'vi' ? 'Tiếng Việt' : l === 'en' ? 'English' : '日本語'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}