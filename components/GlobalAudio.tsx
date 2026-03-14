"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function GlobalAudio() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const pathname = usePathname();
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Kiểm tra xem có đang ở trang admin không
    const isAdmin = pathname.startsWith("/admin");

    // 1. CỐ GẮNG PHÁT NHẠC NGAY LẬP TỨC (Dành cho trình duyệt đã nới lỏng chính sách)
    useEffect(() => {
        if (isAdmin || hasInteracted) return;

        const audio = audioRef.current;
        if (audio) {
            audio.play().then(() => {
                setIsPlaying(true);
                setHasInteracted(true);
            }).catch((err) => {
                console.log("Trình duyệt chặn Autoplay thuần. Đang đợi người dùng nhúc nhích chuột...");
            });
        }
    }, [isAdmin, hasInteracted]);

    // 2. LƯỚI BẮT SỰ KIỆN SIÊU NHẠY: Bật nhạc ngay cả khi chỉ lướt chuột qua lúc đang Loading
    useEffect(() => {
        const handleInteraction = () => {
            if (!hasInteracted && !pathname.startsWith("/admin")) {
                setHasInteracted(true);
                setIsPlaying(true);
                if (audioRef.current) {
                    audioRef.current.play().catch(() => setIsPlaying(false));
                }
            }
        };

        // Khai báo mọi cử chỉ có thể xảy ra trên PC và Mobile
        const events = ["click", "scroll", "mousemove", "touchstart", "keydown"];
        
        // Gắn sự kiện vào toàn trang web
        events.forEach(event => {
            document.addEventListener(event, handleInteraction, { once: true });
        });

        return () => {
            // Dọn dẹp để không bị rò rỉ bộ nhớ
            events.forEach(event => {
                document.removeEventListener(event, handleInteraction);
            });
        };
    }, [hasInteracted, pathname]);

    // 3. Xử lý bật/tắt nhạc khi chuyển qua lại giữa các trang (VD: Từ Home -> Admin)
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isAdmin) {
            audio.pause(); // Vào admin thì tắt nhạc
        } else if (isPlaying && hasInteracted) {
            audio.play().catch(() => setIsPlaying(false));
        }
    }, [pathname, isAdmin, isPlaying, hasInteracted]);

    // 4. Hàm cho nút bật/tắt thủ công ở góc
    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsPlaying(false));
        }
    };

    if (isAdmin) return null;

    return (
        <>
            {/* autoPlay được set sẵn, preload = "auto" để tải nhạc về máy ngay từ giây đầu tiên */}
            <audio ref={audioRef} src="/music_japan.mp3" loop preload="auto" autoPlay />
            
            <button
                className="global-audio-btn"
                onClick={togglePlay}
                style={{
                    position: 'fixed',
                    bottom: '30px', 
                    left: '50px',
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff69b4, #ffc1e3)',
                    color: 'white',
                    border: '2px solid white',
                    boxShadow: '0 4px 15px rgba(255,105,180,0.4)',
                    cursor: 'pointer',
                    zIndex: 999998,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    transition: 'transform 0.3s',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                title={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
            >
                {isPlaying ? '🎵' : '🔇'}
            </button>
        </>
    );
}