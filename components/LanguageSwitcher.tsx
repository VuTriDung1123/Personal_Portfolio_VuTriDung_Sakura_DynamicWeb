"use client";

import { useState } from "react";
import { Lang } from "@/lib/data";

interface Props {
  currentLang: Lang;
  setCurrentLang: (lang: Lang) => void;
}

export default function LanguageSwitcher({ currentLang, setCurrentLang }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSelect = (lang: Lang) => {
    setCurrentLang(lang);
    setIsOpen(false);
  };

  const getFlag = (l: Lang) => {
    if(l === 'vi') return '🇻🇳';
    if(l === 'en') return '🇬🇧';
    return '🇯🇵';
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 999998 }}>
      {/* Nút chính */}
      <button 
        onClick={toggleOpen}
        style={{
          width: '50px', height: '50px', borderRadius: '50%',
          background: 'white', border: '2px solid #ffc1e3',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(255,105,180,0.2)',
          transition: 'transform 0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {getFlag(currentLang)}
      </button>

      {/* Menu thả lên (Drop-up) */}
      {isOpen && (
        <div style={{
          position: 'absolute', bottom: '60px', right: '0',
          background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)',
          borderRadius: '15px', padding: '10px',
          boxShadow: '0 10px 25px rgba(255,105,180,0.3)',
          border: '1px solid #ffc1e3',
          display: 'flex', flexDirection: 'column', gap: '5px',
          animation: 'fadeInUp 0.2s ease-out'
        }}>
          {(['en', 'vi', 'jp'] as Lang[]).map(l => (
            <button 
              key={l} 
              onClick={() => handleSelect(l)}
              style={{
                padding: '8px 15px', borderRadius: '10px', border: 'none',
                background: currentLang === l ? '#ff69b4' : 'transparent',
                color: currentLang === l ? 'white' : '#5d4037',
                fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: '0.2s'
              }}
            >
              <span style={{fontSize: '1.2rem'}}>{getFlag(l)}</span> {l.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}