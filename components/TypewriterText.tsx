"use client";
import { useState, useEffect } from "react";

export default function TypewriterText({ words }: { words: string[] }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const typeSpeed = 100; // Tốc độ gõ
    const deleteSpeed = 50; // Tốc độ xóa
    const delayBetweenWords = 2000; // Nghỉ 2 giây trước khi xóa

    const currentWord = words[currentWordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Đang gõ
        setCurrentText(currentWord.substring(0, currentText.length + 1));
        if (currentText === currentWord) {
          setTimeout(() => setIsDeleting(true), delayBetweenWords);
        }
      } else {
        // Đang xóa
        setCurrentText(currentWord.substring(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <span style={{ color: "#ff69b4", fontWeight: "bold" }}>
      {currentText}
      <span className="animate-pulse" style={{ color: "#5d4037" }}>|</span>
    </span>
  );
}