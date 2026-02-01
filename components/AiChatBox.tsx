"use client";

import { useState, useRef, useEffect } from "react";

export default function AiChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  // Tin nhắn chào mừng mặc định
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: "SYSTEM_ONLINE. I am Dũng's AI Assistant. How can I help you?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    
    // Thêm tin nhắn user vào list
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // Gọi API Gemini
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            messages: [...messages, { role: 'user', content: userMsg }]
        })
      });

      const data = await res.json();
      
      // Thêm tin nhắn AI trả lời
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (error) {
        console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "ERROR: Connection interrupted." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, fontFamily: "'VT323', monospace" }}>
      
      {/* Nút bật/tắt Chat (Style Hacker) */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="group"
          style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'black', border: '2px solid #00ff41',
            color: '#00ff41', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold',
            boxShadow: '0 0 15px #00ff41', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s'
          }}
        >
          <span className="group-hover:animate-pulse">AI</span>
        </button>
      )}

      {/* Cửa sổ Chat */}
      {isOpen && (
        <div style={{
          width: '320px', height: '450px', 
          background: 'rgba(0, 10, 0, 0.95)', 
          border: '1px solid #00ff41',
          display: 'flex', flexDirection: 'column', 
          boxShadow: '0 0 30px rgba(0,255,65,0.2)',
          borderRadius: '5px', overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: '#00ff41', color: 'black', padding: '10px', fontWeight: 'bold',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: '1px solid #003300'
          }}>
            <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                <span style={{width:'8px', height:'8px', background:'black', borderRadius:'50%', animation:'pulse 1s infinite'}}></span>
                <span>AI_SECRETARY</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{background:'none', border:'none', fontWeight:'bold', cursor:'pointer', fontSize:'1.2rem'}}>&times;</button>
          </div>

          {/* Body Chat */}
          <div ref={scrollRef} style={{flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px'}}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%', padding: '8px 12px',
                background: m.role === 'user' ? '#003300' : 'rgba(0,0,0,0.5)',
                border: m.role === 'user' ? '1px solid #00ff41' : '1px solid #333',
                color: '#e0e0e0', fontSize: '1rem', wordWrap: 'break-word',
                borderRadius: m.role === 'user' ? '10px 10px 0 10px' : '10px 10px 10px 0'
              }}>
                <strong style={{color: m.role==='user'?'#00ff41':'#008f11', display: 'block', fontSize: '0.7rem', marginBottom: '3px', textTransform:'uppercase'}}>
                    {m.role === 'user' ? '> YOU' : '> SYSTEM_AI'}
                </strong>
                {m.content}
              </div>
            ))}
            {isLoading && (
                <div style={{alignSelf: 'flex-start', color: '#00ff41', fontSize: '0.9rem'}}>
                    Thinking<span className="cursor-blink">_</span>
                </div>
            )}
          </div>

          {/* Input Area */}
          <div style={{padding: '10px', borderTop: '1px solid #00ff41', display: 'flex', background:'black'}}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query database..."
              style={{
                flex: 1, background: 'transparent', border: 'none', color: '#00ff41', outline: 'none', fontSize: '1rem', fontFamily: 'inherit'
              }}
            />
            <button onClick={handleSend} style={{background: 'none', border: 'none', color: '#00ff41', fontWeight: 'bold', cursor: 'pointer', paddingLeft:'10px'}}>{`>>`}</button>
          </div>
        </div>
      )}
    </div>
  );
}