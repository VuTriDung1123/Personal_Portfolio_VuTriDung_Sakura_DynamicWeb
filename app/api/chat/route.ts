import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSectionContent, getAllPosts } from '@/lib/actions';

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// [MỚI] Danh sách Model dự phòng (Fallback Models)
// Sắp xếp theo thứ tự: Mới/Nhanh nhất -> Ổn định -> Cũ hơn
const FALLBACK_MODELS = [
    "gemini-3.1-flash-lite-preview",
    "gemini-2.5-flash-001",
    "gemini-flash-latest",
    "gemini-2.0-flash-001"
];

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      console.error("LỖI: Chưa tìm thấy GEMINI_API_KEY trong file .env");
      return NextResponse.json({ reply: "Lỗi hệ thống: Chưa cấu hình API Key. 🍃" }, { status: 500 });
    }

    const { messages, language, theme } = await req.json(); 
    const lastMessage = messages[messages.length - 1].content;

    const langMap: Record<string, string> = { 'vi': 'Vietnamese', 'en': 'English', 'jp': 'Japanese' };
    const targetLang = langMap[language] || 'English';

    const [heroData, aboutData, skillsData, expData, faqData, aiConfigData, projects] = await Promise.all([
      getSectionContent('hero'), getSectionContent('about'), getSectionContent('skills'),
      getSectionContent('experience'), getSectionContent('faq_data'), getSectionContent('ai_config'),
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
    const fullAiConfig = parse((aiConfigData as any)?.contentEn || "{}");
    
    const activeProfile = (theme === 'sakura') 
        ? (fullAiConfig.sakura || { roleName: "Sakura Assistant", tone: "Cute, Friendly", customStory: "", systemPromptOverride: "" })
        : (fullAiConfig.hacker || { roleName: "System Admin", tone: "Cool, Logical", customStory: "", systemPromptOverride: "" });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const skillText = (skillsData as any)?.contentEn || "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aboutText = (aboutData as any)?.contentEn || "";

    const systemPrompt = `
      ROLE: You are the "${activeProfile.roleName}" for the Portfolio of "${hero.fullName || "Vu Tri Dung"}".
      
      --- PERSONALITY & TONE ---
      - Tone: ${activeProfile.tone}
      - Style: ${theme === 'sakura' ? 'Use emojis like 🌸✨, be warm and polite.' : 'Use technical terms, be concise and cool.'}
      
      --- SECRET KNOWLEDGE ---
      ${activeProfile.customStory || "No secret info."}

      --- OVERRIDE ---
      ${activeProfile.systemPromptOverride || "None."}

      --- PUBLIC DATA ---
      1. PROFILE: ${hero.greeting}, ${hero.description}
      2. ABOUT: ${aboutText}
      3. SKILLS: ${skillText}
      4. EXPERIENCE: ${JSON.stringify(exp)}
      5. FAQ: ${JSON.stringify(faq)}
      6. PROJECTS: User has ${projects?.length || 0} projects.

      --- INSTRUCTIONS ---
      1. Answer based on the data above.
      2. **IMPORTANT: The user is speaking ${targetLang}. ANSWER IN ${targetLang}.**
      3. Keep answers concise.
    `;

    let reply = "";
    let success = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lastError: any = null;

    // [MỚI] VÒNG LẶP THỬ TỪNG MODEL
    for (const modelName of FALLBACK_MODELS) {
        try {
            console.log(`Đang gọi model AI: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: systemPrompt });
            const result = await model.generateContent(lastMessage);
            reply = result.response.text();
            success = true;
            console.log(`>> Thành công với model: ${modelName}`);
            break; // Thoát vòng lặp ngay khi có model trả lời thành công
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            console.warn(`>> Model ${modelName} thất bại: ${errorMessage}`);
            lastError = err;
            // Nếu lỗi, vòng lặp tự động chạy tiếp sang model dưới
        }
    }

    // Nếu lặp qua hết danh sách mà vẫn lỗi thì ném lỗi ra ngoài
    if (!success) {
        throw lastError || new Error("Tất cả các model AI đều thất bại.");
    }

    return NextResponse.json({ reply });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Gemini AI Final Error Details:", error.message || error);
    return NextResponse.json({ reply: "Hệ thống AI đang quá tải hoặc lỗi kết nối. Vui lòng thử lại sau 🍃" }, { status: 500 });
  }
}