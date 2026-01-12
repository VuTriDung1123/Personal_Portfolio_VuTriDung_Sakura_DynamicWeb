"use client";
import { useEffect, useState } from "react";

interface Petal {
  id: number;
  left: string;
  animDuration: string;
  size: string;
  delay: string;
}

export default function SakuraFalling() {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
        setIsMounted(true);
        const arr = Array.from({ length: 30 }, (_, i) => ({
          id: i,
          left: Math.random() * 100 + "%", // Vị trí ngẫu nhiên chiều ngang
          animDuration: 5 + Math.random() * 10 + "s", // Tốc độ rơi
          size: 10 + Math.random() * 15 + "px", // Kích thước
          delay: Math.random() * 5 + "s", // Độ trễ xuất hiện
        }));
        setPetals(arr);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* 1. Định nghĩa chuyển động ngay tại đây để chắc chắn chạy */}
      <style jsx global>{`
        @keyframes sakura-fall {
          0% {
            top: -10%;
            transform: translateX(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            top: 100%;
            transform: translateX(100px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* 2. Container full màn hình, nằm ĐÈ LÊN TRÊN (z-index cao) nhưng không chặn chuột (pointer-events-none) */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none', // Cho phép click xuyên qua
          zIndex: 9999, // Luôn nổi lên trên cùng
          overflow: 'hidden'
        }}
      >
        {petals.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.left,
              width: p.size,
              height: p.size,
              background: '#ffc0cb', // Màu hồng phấn
              borderRadius: '100% 0 100% 0', // Hình dáng cánh hoa
              boxShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              animationName: 'sakura-fall', // Gọi keyframe ở trên
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              animationDuration: p.animDuration,
              animationDelay: p.delay,
              top: '-20px', // Xuất phát từ ngoài màn hình
              opacity: 0.8
            }}
          />
        ))}
      </div>
    </>
  );
}