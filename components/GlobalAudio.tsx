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

    // 1. ÉP PHÁT NHẠC NGAY LẬP TỨC KHI VỪA VÀO WEB
    useEffect(() => {
        if (isAdmin || hasInteracted) return;

        const audio = audioRef.current;
        if (audio) {
            // Cố gắng phát nhạc ngay. Dùng Promise để bắt lỗi nếu trình duyệt chặn Autoplay.
            audio.play().then(() => {
                setIsPlaying(true);
                setHasInteracted(true);
            }).catch(() => {
                console.log("Trình duyệt chặn Autoplay. Đang đợi người dùng thao tác...");
            });
        }
    }, [isAdmin, hasInteracted]);

    // 2. Kế hoạch B: Lắng nghe tương tác (Click/Scroll) nếu Autoplay bị chặn
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

        // Bắt sự kiện click hoặc cuộn trang lần đầu tiên
        document.addEventListener("click", handleInteraction, { once: true });
        document.addEventListener("scroll", handleInteraction, { once: true });

        return () => {
            document.removeEventListener("click", handleInteraction);
            document.removeEventListener("scroll", handleInteraction);
        };
    }, [hasInteracted, pathname]);

    // 3. Xử lý bật/tắt nhạc khi đổi trang (chặn Admin)
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isAdmin) {
            audio.pause(); // Vào admin thì tắt nhạc
        } else if (isPlaying && hasInteracted) {
            // Đang phát nhạc và ra khỏi admin -> phát lại
            audio.play().catch(() => setIsPlaying(false));
        }
    }, [pathname, isAdmin, isPlaying, hasInteracted]);

    // 4. Hàm cho nút bật/tắt thủ công
    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation(); // Tránh kích hoạt lại sự kiện click ở document
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

    // Nếu đang ở trang Admin thì không hiển thị nút nhạc và dừng phát
    if (isAdmin) return null;

    return (
        <>
            {/* Thẻ audio chạy ngầm, loop lặp lại liên tục, thêm thuộc tính autoPlay */}
            <audio ref={audioRef} src="/music_japan.mp3" loop preload="auto" autoPlay />
            
            {/* Đưa nút sang GÓC DƯỚI TRÁI - Kế bên mô hình 3D AI để không che khung chat */}
            <button
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