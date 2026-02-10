"use client";

import { useState, useRef, useEffect } from "react";
import { Lang } from "@/lib/data";
import AvatarViewer from "./AvatarViewer";

const GREETINGS = {
    vi: "Chào bạn! 🌸 Mình là trợ lý ảo của Dũng. Bạn cần giúp gì không?",
    en: "Hello! 🌸 I'm Dung's virtual assistant. How can I help you?",
    jp: "こんにちは！🌸 ズンのAIアシスタントです。何かお手伝いしましょうか？"
};

const SAKURA_MODEL_URL = "/models/blue_archive_miyako_sakura_portfolio.glb";

export default function SakuraAiChatBox({ currentLang }: { currentLang: Lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: GREETINGS[currentLang] || GREETINGS.en }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(prev => [...prev, { role: 'ai', content: `[System]: Language changed to ${currentLang.toUpperCase()} 🌸` }]);
  }, [currentLang]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMsg }], language: currentLang, theme: 'sakura' })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: "Oops... Mạng có vấn đề rồi 🍃" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* 1. ROBOT (GÓC TRÁI DƯỚI) - TRONG SUỐT, KHÔNG KHUNG VIỀN           */}
      {/* ------------------------------------------------------------------ */}
      <div 
        style={{
          position: 'fixed',
          bottom: '0px', 
          left: '20px',          
          width: '220px',        
          height: '300px',       
          zIndex: 999999, // Đè lên tất cả
          pointerEvents: 'auto', // Để xoay được model
          // ĐÃ XÓA BỎ BORDER VÀ BACKGROUND ĐỂ NÓ TRONG SUỐT HOÀN TOÀN
        }}
      >
          <AvatarViewer url={SAKURA_MODEL_URL} isTalking={isLoading} theme="sakura" />
          
          {/* Bóng hồng mờ ảo dưới chân cho đẹp */}
          <div style={{
              position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', 
              width: '100px', height: '15px', 
              background: 'radial-gradient(ellipse, rgba(255,105,180,0.4) 0%, transparent 70%)', 
              zIndex: -1, pointerEvents: 'none', filter: 'blur(5px)'
          }}></div>

          {/* Bong bóng chat nhỏ khi đang suy nghĩ */}
          {isLoading && (
             <div className="absolute top-10 right-0 bg-white text-[#ff69b4] text-xs px-3 py-1 rounded-t-xl rounded-br-xl shadow-md animate-bounce border border-[#ffc1e3]">
                 Hmm... 🌸
             </div>
          )}
      </div>


      {/* ------------------------------------------------------------------ */}
      {/* 2. CHATBOX (GÓC PHẢI DƯỚI) - UI ĐẸP (SAKURA THEME)                */}
      {/* ------------------------------------------------------------------ */}
      <div style={{position: 'fixed', bottom: '30px', right: '30px', zIndex: 999999, fontFamily: 'sans-serif'}}>
        
        {/* Nút Bật/Tắt Tròn Xoe Đẹp Mắt */}
        {!isOpen && (
          <button 
            onClick={() => setIsOpen(true)} 
            style={{
                width: '65px', height: '65px', borderRadius: '50%', 
                background: 'linear-gradient(135deg, #ff69b4, #ffc1e3)', 
                border: '3px solid white', color: 'white', fontSize: '28px', 
                boxShadow: '0 4px 20px rgba(255,105,180,0.6)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
          >
            🌸
          </button>
        )}

        {/* Khung Chat Chính (Khi mở) */}
        {isOpen && (
          <div style={{
              width: '340px', height: '500px', 
              background: 'rgba(255, 255, 255, 0.92)', // Nền trắng mờ
              backdropFilter: 'blur(12px)', // Hiệu ứng kính mờ
              borderRadius: '24px', 
              boxShadow: '0 20px 50px rgba(255,105,180,0.25)', 
              border: '1px solid rgba(255, 255, 255, 0.8)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              animation: 'fadeInUp 0.3s ease-out'
          }}>
            
            {/* Header Gradient */}
            <div style={{
                padding: '15px 20px', 
                background: 'linear-gradient(to right, #ff69b4, #ff9eb5)', 
                color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold',
                boxShadow: '0 2px 10px rgba(255,105,180,0.2)'
            }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <div style={{background:'white', width:'28px', height:'28px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px'}}>🤖</div>
                    <span style={{fontSize: '1rem', letterSpacing: '0.5px'}}>Sakura Assistant</span>
                </div>
                <button onClick={() => setIsOpen(false)} style={{background: 'rgba(255,255,255,0.2)', width:'28px', height:'28px', borderRadius:'50%', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center', paddingBottom:'2px'}}>&times;</button>
            </div>

            {/* Vùng Tin Nhắn */}
            <div ref={scrollRef} style={{flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: 'rgba(255, 240, 245, 0.3)'}}>
                {messages.map((m, i) => (
                    <div key={i} style={{
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%', padding: '10px 14px', 
                        borderRadius: '18px', 
                        borderBottomRightRadius: m.role === 'user' ? '4px' : '18px',
                        borderTopLeftRadius: m.role === 'ai' ? '4px' : '18px',
                        fontSize: '0.92rem', lineHeight: '1.4',
                        background: m.role === 'user' ? 'linear-gradient(135deg, #ff69b4, #ff8da1)' : 'white',
                        color: m.role === 'user' ? 'white' : '#555',
                        border: m.role === 'ai' ? '1px solid #ffe4e1' : 'none',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}>
                        {m.content}
                    </div>
                ))}
                {isLoading && (
                    <div style={{alignSelf: 'flex-start', background:'white', padding:'8px 12px', borderRadius:'18px', borderTopLeftRadius:'4px', border:'1px solid #ffe4e1', color: '#ff69b4', fontSize: '0.8rem', display:'flex', gap:'3px', alignItems:'center'}}>
                        <span>Đang soạn tin</span>
                        <span className="animate-bounce">.</span><span className="animate-bounce" style={{animationDelay:'0.1s'}}>.</span><span className="animate-bounce" style={{animationDelay:'0.2s'}}>.</span>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div style={{padding: '12px', background: 'white', borderTop: '1px solid #ffe4e1', display: 'flex', gap: '8px', alignItems:'center'}}>
                <input 
                    value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                    placeholder="Nhắn tin..." 
                    style={{
                        flex: 1, padding: '10px 15px', borderRadius: '25px', 
                        border: '1px solid #ffc1e3', outline: 'none', 
                        background: '#fff0f5', color: '#555', fontSize: '0.95rem',
                        transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#ff69b4'}
                    onBlur={(e) => e.target.style.borderColor = '#ffc1e3'}
                />
                <button onClick={handleSend} style={{
                    width: '40px', height: '40px', borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #ff69b4, #ff8da1)', 
                    color: 'white', border: 'none', cursor: 'pointer', 
                    display:'flex', alignItems:'center', justifyContent:'center',
                    boxShadow: '0 3px 10px rgba(255,105,180,0.3)',
                    fontSize: '1.2rem'
                }}>➤</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}