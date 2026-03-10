"use client";

import { motion, useInView, useAnimation } from "framer-motion";
import { useRef, useEffect } from "react";

interface Props {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
}

export default function ScrollReveal({ children, width = "100%", delay = 0 }: Props) {
  const ref = useRef(null);
  // once: true giúp hiệu ứng chỉ chạy 1 lần khi cuộn tới, không bị giật lag
  // margin: "-50px" giúp phần tử bắt đầu hiện khi nó vào vùng nhìn thấy 50px
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  return (
    <div ref={ref} style={{ width, position: "relative", overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 50 }, // Ẩn đi và lùi xuống 50px
          visible: { opacity: 1, y: 0 }, // Hiện ra và trượt về vị trí cũ
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.7, delay: delay, ease: [0.17, 0.55, 0.55, 1] }} // Ease này tạo cảm giác mượt như bơ
      >
        {children}
      </motion.div>
    </div>
  );
}