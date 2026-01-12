"use client";
import { useEffect, useState } from "react";

interface Petal { id: number; left: string; animDuration: string; size: string; delay: string; }

export default function SakuraFalling() {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
        setIsMounted(true);
        const arr = Array.from({ length: 25 }, (_, i) => ({
          id: i,
          left: Math.random() * 100 + "%",
          animDuration: 6 + Math.random() * 10 + "s",
          size: 10 + Math.random() * 15 + "px",
          delay: Math.random() * 5 + "s",
        }));
        setPetals(arr);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  if (!isMounted) return null;

  return (
    // Sử dụng container có style cố định để đảm bảo không ảnh hưởng layout
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {petals.map((p) => (
        <div
          key={p.id}
          // [QUAN TRỌNG] Dùng class 'petal' để khớp với globals.css
          className="petal" 
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.animDuration,
            animationDelay: p.delay,
            // Thêm style inline dự phòng để chắc chắn nó là hình tròn màu hồng
            position: 'absolute',
            top: '-20px',
            backgroundColor: '#ffc0cb',
            borderRadius: '100% 0 100% 0',
            opacity: 0.6
          }}
        />
      ))}
    </div>
  );
}