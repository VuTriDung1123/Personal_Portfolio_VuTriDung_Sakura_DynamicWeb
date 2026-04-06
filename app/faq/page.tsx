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

    // --- FORM STATES ---
    const [isSending, setIsSending] = useState(false);
    const [sendMsg, setSendMsg] = useState<{ text: string, type: 'success' | 'error' | '' }>({ text: '', type: '' });

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

    // --- XỬ LÝ GỬI FORM EMAIL ---
    const handleSendMail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSending(true);
        setSendMsg({ text: 'Đang gửi bức thư của bạn đi... 🌸', type: '' });

        const formData = new FormData(e.currentTarget);
        
        // Kiểm tra dung lượng file
        const file = formData.get('file') as File;
        if (file && file.size > 4 * 1024 * 1024) { // Tối đa 4MB
            setSendMsg({ text: 'File đính kèm quá lớn (Tối đa 4MB) 🍃', type: 'error' });
            setIsSending(false);
            return;
        }

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setSendMsg({ text: 'Đã gửi thư thành công! Hãy kiểm tra hộp thư của bạn nhé. 🌸', type: 'success' });
                (e.target as HTMLFormElement).reset(); // Làm trống form
            } else {
                setSendMsg({ text: 'Có lỗi xảy ra khi gửi thư. Vui lòng thử lại sau 🍃', type: 'error' });
            }
        } catch (error) {
            setSendMsg({ text: 'Lỗi kết nối mạng 🍃', type: 'error' });
        } finally {
            setIsSending(false);
            setTimeout(() => setSendMsg({ text: '', type: '' }), 8000); // Ẩn thông báo sau 8s
        }
    };

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

                {/* Thanh chọn ngôn ngữ */}
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

                {/* Nội dung FAQ */}
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

                {/* --- FORM ĐẶT CÂU HỎI TRỰC TIẾP --- */}
                <div style={{
                    marginTop: '60px',
                    background: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '30px',
                    padding: '40px',
                    boxShadow: '0 10px 30px rgba(255,105,180,0.15)',
                    border: '1px solid white'
                }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2rem', color: '#d81b60', marginBottom: '10px', fontWeight: 'bold' }}>
                        ✿ ĐẶT CÂU HỎI CHO TÔI ✿
                    </h2>
                    <p style={{ textAlign: 'center', color: '#8d6e63', marginBottom: '30px', fontStyle: 'italic' }}>
                        Bạn không tìm thấy câu trả lời? Hãy gửi email trực tiếp cho tôi nhé! ✨
                    </p>

                    <form onSubmit={handleSendMail} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#ff69b4', fontWeight: 'bold', fontSize: '0.9rem' }}>Email của bạn:</label>
                                <input type="email" name="email" required placeholder="your.email@domain.com" style={{
                                    width: '100%', padding: '12px 15px', borderRadius: '15px', border: '1px solid #ffc1e3', outline: 'none', background: 'white', color: '#5d4037', fontSize: '1rem'
                                }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#ff69b4', fontWeight: 'bold', fontSize: '0.9rem' }}>Tiêu đề:</label>
                                <input type="text" name="subject" required placeholder="Vấn đề bạn cần hỏi..." style={{
                                    width: '100%', padding: '12px 15px', borderRadius: '15px', border: '1px solid #ffc1e3', outline: 'none', background: 'white', color: '#5d4037', fontSize: '1rem'
                                }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#ff69b4', fontWeight: 'bold', fontSize: '0.9rem' }}>Nội dung câu hỏi:</label>
                            <textarea name="message" required rows={5} placeholder="Nhập câu hỏi chi tiết của bạn tại đây..." style={{
                                width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid #ffc1e3', outline: 'none', background: 'white', color: '#5d4037', fontSize: '1rem', resize: 'vertical'
                            }}></textarea>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#ff69b4', fontWeight: 'bold', fontSize: '0.9rem' }}>Đính kèm file (Tùy chọn):</label>
                            <input type="file" name="file" style={{
                                width: '100%', padding: '10px', background: '#fff0f5', borderRadius: '10px', color: '#8d6e63', fontSize: '0.9rem', cursor: 'pointer'
                            }} />
                        </div>

                        {sendMsg.text && (
                            <div style={{
                                padding: '15px', borderRadius: '15px', fontWeight: 'bold', textAlign: 'center',
                                background: sendMsg.type === 'error' ? '#ffebee' : '#f0fdf4',
                                color: sendMsg.type === 'error' ? '#c62828' : '#2e7d32',
                                border: `1px solid ${sendMsg.type === 'error' ? '#ef9a9a' : '#bbf7d0'}`
                            }}>
                                {sendMsg.text}
                            </div>
                        )}

                        <button type="submit" disabled={isSending} style={{
                            marginTop: '10px', padding: '15px', borderRadius: '30px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s', border: 'none',
                            background: isSending ? '#ffc1e3' : 'linear-gradient(135deg, #ff69b4, #ff8da1)', color: 'white',
                            boxShadow: isSending ? 'none' : '0 5px 15px rgba(255,105,180,0.4)',
                        }}>
                            {isSending ? '🌸 Đang gửi đi...' : 'GỬI CÂU HỎI ➤'}
                        </button>
                    </form>
                </div>
                
            </div>
        </main>
    );
}