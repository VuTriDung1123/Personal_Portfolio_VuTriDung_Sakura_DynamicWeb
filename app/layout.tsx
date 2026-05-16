import type { Metadata } from "next";
import { Noto_Sans, Noto_Serif, Noto_Serif_JP, Dancing_Script } from "next/font/google";
import "./globals.css";
import GlobalAudio from "@/components/GlobalAudio";

const notoSans = Noto_Sans({ subsets: ["latin"], weight: ["400", "700"], variable: '--font-noto-sans' });
const notoSerif = Noto_Serif({ subsets: ["latin", "vietnamese"], weight: ["400", "700"], variable: '--font-noto-serif' });
const notoSerifJP = Noto_Serif_JP({ subsets: ["latin"], weight: ["400", "700"], variable: '--font-noto-serif-jp' });
const dancingScript = Dancing_Script({ subsets: ["latin"], weight: ["700"], variable: '--font-dancing' });



export const metadata: Metadata = {
  title: "Personal Portfolio - Vu Tri Dung - Sakura",
  description: "Trang web hồ sơ cá nhân của Vũ Trí Dũng (Sakura). Lập trình viên Full-stack, Mobile App và Game Developer.",
  keywords: ["Vũ Trí Dũng", "Portfolio", "Sakura", "Fullstack Developer", "Next.js"],
  authors: [{ name: "Vu Tri Dung" }],
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      {/* Nạp các biến font vào body */}
      <body className={`${notoSans.variable} ${notoSerif.variable} ${notoSerifJP.variable} ${dancingScript.variable} antialiased`}>
        <GlobalAudio />
        {children}
      </body>
    </html>
  );
}