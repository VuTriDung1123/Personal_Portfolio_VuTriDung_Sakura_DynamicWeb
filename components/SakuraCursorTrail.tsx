"use client";
import { useEffect, useRef } from 'react';

export default function SakuraCursorTrail() {
  // Dùng useRef để lưu thời gian lần cuối tạo cánh hoa
  const lastRenderTime = useRef(0);

  useEffect(() => {
    // Hàm xử lý khi chuột di chuyển
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      // GIỚI HẠN TỐC ĐỘ: Chỉ tạo cánh hoa mới mỗi 40ms.
      // Nếu không có dòng này, web sẽ rất lag vì tạo quá nhiều element.
      if (now - lastRenderTime.current < 40) return;
      lastRenderTime.current = now;

      // 1. Tạo thẻ span mới cho cánh hoa
      const petal = document.createElement('span');
      petal.classList.add('cursor-trail-petal'); // Gắn class CSS đã viết ở Bước 2

      // 2. Random kích thước nhẹ (từ 12px đến 22px)
      const size = Math.random() * 10 + 12; 
      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;

      // 3. Đặt vị trí cánh hoa ngay tại toạ độ chuột
      // Cộng thêm scrollX/Y để nó vẫn đúng vị trí khi cuộn trang
      petal.style.left = `${e.pageX}px`;
      petal.style.top = `${e.pageY}px`;

      // 4. Thêm vào body
      document.body.appendChild(petal);

      // 5. Quan trọng: Xóa cánh hoa sau 1 giây (khi animation kết thúc) để dọn rác bộ nhớ
      setTimeout(() => {
        petal.remove();
      }, 1000);
    };

    // Gắn sự kiện vào toàn bộ document
    document.addEventListener('mousemove', handleMouseMove);

    // Dọn dẹp sự kiện khi component bị hủy (để tránh lỗi)
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Component này chỉ chạy logic ngầm, không render gì ra giao diện chính
  return null; 
}