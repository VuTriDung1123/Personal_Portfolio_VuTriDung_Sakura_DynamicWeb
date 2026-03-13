"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SakuraFalling from "@/components/SakuraFalling";
import SakuraCursorTrail from "@/components/SakuraCursorTrail";
import { getSectionContent } from "@/lib/actions";
import { Lang } from "@/lib/data";

// Type dữ liệu
type FaqItem = { q: string; a: string; };
type SectionData = { contentEn: string; contentVi: string; contentJp: string; };

export default function SakuraFaqPage() {
    const [viewLang, setViewLang] = useState<Lang>("en");
    const [allFaq, setAllFaq] = useState<{ en: FaqItem[], vi: FaqItem[], jp: FaqItem[] }>({ en: [], vi: [], jp: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    useEffect(() => {
        const savedLang = localStorage.getItem("sakura_lang") as Lang;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (savedLang && ['en', 'vi', 'jp'].includes(savedLang)) setViewLang(savedLang);

        getSectionContent("faq_data").then((data) => {
            if (data) {
                const sec = data as unknown as SectionData;
                try {
                    setAllFaq({
                        en: JSON.parse(sec.contentEn || "[]"),
                        vi: JSON.parse(sec.contentVi || "[]"),
                        jp: JSON.parse(sec.contentJp || "[]")
                    });
                } catch (e) { console.error(e); }
            }
            setTimeout(() => setIsLoading(false), 800);
        });
    }, []);

    const toggleFaq = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const currentList = allFaq[viewLang];

    return (
        <main style={{ 
            minHeight: '100vh', 
            fontFamily: "'Noto Sans', sans-serif",
            color: '#5d4037',
            backgroundImage: "url('/pictures/japanese_bg.jpg')",
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            paddingBottom: '50px'
        }}>
            {/* Lớp phủ mờ nền */}
            <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255, 240, 245, 0.7)', zIndex: 0}}></div>
            
            <SakuraFalling />
            <SakuraCursorTrail />

            {/* Nút Back về Home */}
            <div style={{position: 'fixed', top: '20px', left: '20px', zIndex: 50}}>
                <Link href="/" style={{
                    background: 'rgba(255,255,255,0.9)', border: '2px solid #ff69b4', color: '#ff69b4',
                    padding: '10px 20px', fontWeight: 'bold', borderRadius: '30px', 
                    boxShadow: '0 4px 10px rgba(255,105,180,0.3)', display: 'block', textDecoration: 'none'
                }}>
                    🌸 TRANG CHỦ
                </Link>
            </div>

            <div style={{maxWidth: '900px', margin: '0 auto', padding: '100px 20px', position: 'relative', zIndex: 1}}>
                
                {/* Header */}
                <div style={{textAlign: 'center', marginBottom: '50px'}}>
                    <h1 style={{
                        fontSize: '3rem', color: '#ff69b4', fontWeight: '800', 
                        textShadow: '2px 2px 0px white', marginBottom: '10px'
                    }}>
                        FAQ & HELP
                    </h1>
                    <p style={{fontSize: '1.2rem', color: '#8d6e63', fontStyle: 'italic'}}>
                        Giải đáp các thắc mắc thường gặp về công việc và kỹ năng.
                    </p>
                </div>

                {/* Thanh chọn ngôn ngữ (Style Sakura) */}
                <div style={{display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px'}}>
                    {[
                        { code: 'vi', label: '🇻🇳 Tiếng Việt' },
                        { code: 'en', label: '🇬🇧 English' },
                        { code: 'jp', label: '🇯🇵 日本語' }
                    ].map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => { setViewLang(lang.code as Lang); setExpandedIndex(null); }}
                            style={{
                                background: viewLang === lang.code ? '#ff69b4' : 'white',
                                color: viewLang === lang.code ? 'white' : '#8d6e63',
                                border: '1px solid #ffb7b2',
                                padding: '8px 20px',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                boxShadow: viewLang === lang.code ? '0 4px 15px rgba(255,105,180,0.4)' : '0 2px 5px rgba(0,0,0,0.05)',
                                transition: '0.3s'
                            }}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>

                {/* Nội dung FAQ (Glassmorphism) */}
                {isLoading ? (
                    <div style={{textAlign: 'center', fontSize: '1.5rem', color: '#ff69b4', padding: '50px'}}>
                        <div style={{animation: 'spin-slow 3s infinite', display: 'inline-block'}}>🌸</div> Đang tải dữ liệu...
                    </div>
                ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                        {currentList && currentList.length > 0 ? (
                            currentList.map((item, index) => (
                                <div key={index} style={{
                                    background: 'rgba(255, 255, 255, 0.85)', 
                                    borderRadius: '20px',
                                    border: '1px solid white',
                                    boxShadow: '0 5px 20px rgba(255,183,178,0.2)',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s'
                                }}>
                                    {/* Câu hỏi */}
                                    <button 
                                        onClick={() => toggleFaq(index)}
                                        style={{
                                            width: '100%', textAlign: 'left', padding: '20px 25px',
                                            background: expandedIndex === index ? 'rgba(255, 240, 245, 0.5)' : 'transparent',
                                            border: 'none', color: '#5d4037', fontSize: '1.1rem', fontWeight: 'bold',
                                            cursor: 'pointer', fontFamily: 'inherit',
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                        }}
                                    >
                                        <span style={{display:'flex', gap:'10px', alignItems:'center'}}>
                                            <span style={{color: '#ff69b4'}}>✿</span> {item.q}
                                        </span>
                                        <span style={{
                                            fontSize: '1.5rem', color: '#ffb7b2', fontWeight: '300',
                                            transform: expandedIndex === index ? 'rotate(45deg)' : 'rotate(0deg)',
                                            transition: '0.3s'
                                        }}>
                                            +
                                        </span>
                                    </button>

                                    {/* Câu trả lời (Animation mở) */}
                                    {expandedIndex === index && (
                                        <div style={{
                                            padding: '0 25px 25px', 
                                            color: '#795548', lineHeight: '1.8', fontSize: '1rem',
                                            animation: 'fadeIn 0.5s'
                                        }}>
                                            <div style={{width: '100%', height: '1px', background: '#ffe4e1', marginBottom: '15px'}}></div>
                                            {item.a}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div style={{textAlign: 'center', padding: '50px', background: 'rgba(255,255,255,0.6)', borderRadius: '20px', color: '#8d6e63', fontStyle: 'italic'}}>
                                🍃 Chưa có dữ liệu cho ngôn ngữ này.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}