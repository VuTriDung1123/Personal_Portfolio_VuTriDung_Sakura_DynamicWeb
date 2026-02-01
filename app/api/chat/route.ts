import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSectionContent, getAllPosts } from '@/lib/actions';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    // [MỚI] Nhận thêm biến 'language' từ Client
    const { messages, language } = await req.json(); 
    
    const lastMessage = messages[messages.length - 1].content;

    // Mapping mã ngôn ngữ sang tên đầy đủ để AI hiểu rõ hơn
    const langMap: Record<string, string> = {
        'vi': 'Vietnamese',
        'en': 'English',
        'jp': 'Japanese'
    };
    const targetLang = langMap[language] || 'English';

    // Tải dữ liệu Admin
    const [heroData, aboutData, skillsData, expData, faqData, projects] = await Promise.all([
      getSectionContent('hero'),
      getSectionContent('about'),
      getSectionContent('skills'),
      getSectionContent('experience'),
      getSectionContent('faq_data'),
      getAllPosts()
    ]);

    const parse = (str: string) => { try { return JSON.parse(str); } catch { return ""; } };
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hero = parse((heroData as any)?.contentEn || "{}");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exp = parse((expData as any)?.contentEn || "[]");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const faq = parse((faqData as any)?.contentEn || "[]");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const skillText = (skillsData as any)?.contentEn || "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aboutText = (aboutData as any)?.contentEn || "";

    // SYSTEM PROMPT [CẬP NHẬT PHẦN LANGUAGE]
    const systemPrompt = `
      ROLE: You are the AI Assistant/Virtual Secretary for the Portfolio of "${hero.fullName || "Vu Tri Dung"}".
      
      --- KNOWLEDGE BASE ---
      1. PROFILE: ${hero.greeting}, ${hero.description}
      2. ABOUT: ${aboutText}
      3. SKILLS: ${skillText}
      4. EXPERIENCE: ${JSON.stringify(exp)}
      5. FAQ: ${JSON.stringify(faq)}
      6. PROJECTS: User has ${projects?.length || 0} projects.

      --- INSTRUCTIONS ---
      1. Answer based ONLY on the data above.
      2. TONE: Professional, Helpful, slightly "Cool/Tech".
      3. **IMPORTANT: The user is currently viewing the website in ${targetLang}. YOU MUST ANSWER IN ${targetLang}.**
      4. Keep answers concise (under 3-4 sentences).
    `;

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", // Hoặc gemini-1.5-flash nếu key chưa hỗ trợ 2.5
        systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(lastMessage);
    const response = await result.response;
    const reply = response.text();

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Gemini AI Error:", error);
    return NextResponse.json({ reply: "SYSTEM_ERROR: Neural Link Interrupted." }, { status: 500 });
  }
}