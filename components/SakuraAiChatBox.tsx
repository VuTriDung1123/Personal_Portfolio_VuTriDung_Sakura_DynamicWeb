"use client";

import { useState, useRef, useEffect } from "react";
import { Lang } from "@/lib/data"; // Đảm bảo import type Lang

// [MỚI] Định nghĩa câu chào theo ngôn ngữ
const GREETINGS = {
    vi: "Xin chào! 🌸 Mình là trợ lý ảo của Dũng. Mình có thể giúp gì cho bạn không?",
    en: "Hello! 🌸 I am Dung's AI Assistant. How can I help you today?",
    jp: "こんにちは！🌸 AIアシスタントです。何かお手伝いしましょうか？"
};

// [MỚI] Nhận props currentLang
export default function SakuraAiChatBox({ currentLang }: { currentLang: Lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: GREETINGS[currentLang] || GREETINGS.en }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // [MỚI] Tự động đổi câu chào khi user đổi ngôn ngữ web
  useEffect(() => {
    // Chỉ đổi câu chào nếu đoạn chat chưa bắt đầu hoặc muốn reset
    // Ở đây ta thêm một tin nhắn mới từ AI để chào lại bằng ngôn ngữ mới
    setMessages(prev => [
        ...prev, 
        { role: 'ai', content: `[System]: Language switched to ${currentLang.toUpperCase()}. 🌸` }
    ]);
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
        body: JSON.stringify({ 
            messages: [...messages, { role: 'user', content: userMsg }],
            language: currentLang, // [MỚI] Gửi kèm ngôn ngữ hiện tại
            theme: 'sakura'
        })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Oops... Kết nối bị gián đoạn rồi. 🍃" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, fontFamily: "'Noto Sans', sans-serif" }}>
      
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            width: '65px', height: '65px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff69b4 0%, #ffc1e3 100%)',
            border: '2px solid white',
            color: 'white', fontSize: '30px', cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255, 105, 180, 0.5)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.3s ease',
            animation: 'float 3s ease-in-out infinite' 
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          🌸
        </button>
      )}

      {isOpen && (
        <div style={{
          width: '340px', height: '520px', 
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid #ffc1e3',
          display: 'flex', flexDirection: 'column', 
          boxShadow: '0 10px 40px rgba(255, 105, 180, 0.25)',
          borderRadius: '25px', overflow: 'hidden',
          animation: 'fadeInUp 0.4s ease-out'
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #ff69b4, #ff9eb5)', 
            color: 'white', padding: '15px 20px', fontWeight: 'bold',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 2px 10px rgba(255,105,180,0.2)'
          }}>
            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                <div style={{background:'white', borderRadius:'50%', padding:'2px', width:'28px', height:'28px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <span style={{fontSize:'16px'}}>🤖</span>
                </div>
                <div>
                    <span style={{display:'block', fontSize:'1rem'}}>Sakura Assistant</span>
                    <span style={{display:'block', fontSize:'0.7rem', opacity:0.9, fontWeight:'normal'}}>● {currentLang.toUpperCase()} Mode</span>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{background:'none', border:'none', color:'white', fontSize:'1.5rem', cursor:'pointer', opacity: 0.8}}>
                &times;
            </button>
          </div>

          <div ref={scrollRef} style={{
              flex: 1, padding: '15px', overflowY: 'auto', 
              display: 'flex', flexDirection: 'column', gap: '15px',
              backgroundColor: '#fff0f5'
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%', padding: '10px 15px',
                background: m.role === 'user' ? '#ff69b4' : 'white',
                color: m.role === 'user' ? 'white' : '#5d4037',
                borderRadius: m.role === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                fontSize: '0.95rem', lineHeight: '1.5',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                wordWrap: 'break-word',
                border: m.role === 'ai' ? '1px solid #ffe4e1' : 'none'
              }}>
                {m.content}
              </div>
            ))}
            {isLoading && (
                <div style={{alignSelf: 'flex-start', background: 'white', padding: '10px 15px', borderRadius: '20px', color: '#ff69b4', fontSize: '0.9rem', border: '1px solid #ffe4e1'}}>
                    <span style={{display:'inline-block', animation:'spin 1s infinite'}}>🌸</span> Đang suy nghĩ...
                </div>
            )}
          </div>

          <div style={{padding: '15px', background:'white', display: 'flex', gap: '10px', borderTop: '1px solid #fff0f5'}}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={currentLang === 'vi' ? "Nhập câu hỏi..." : (currentLang === 'jp' ? "質問を入力..." : "Type your question...")}
              style={{
                flex: 1, background: '#fff0f5', border: '1px solid #ffc1e3', 
                padding: '10px 15px', borderRadius: '25px', outline: 'none', 
                color: '#5d4037', fontSize: '0.95rem'
              }}
            />
            <button 
                onClick={handleSend} 
                style={{
                    width: '40px', height: '40px', borderRadius: '50%', 
                    background: '#ff69b4', border: 'none', color: 'white', 
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 3px 10px rgba(255,105,180,0.3)'
                }}
            >
                ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}