import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSectionContent, getAllPosts } from '@/lib/actions';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages, language } = await req.json(); 
    const lastMessage = messages[messages.length - 1].content;

    const langMap: Record<string, string> = { 'vi': 'Vietnamese', 'en': 'English', 'jp': 'Japanese' };
    const targetLang = langMap[language] || 'English';

    // TẢI DỮ LIỆU TỪ ADMIN (BAO GỒM AI_CONFIG)
    const [heroData, aboutData, skillsData, expData, faqData, aiConfigData, projects] = await Promise.all([
      getSectionContent('hero'),
      getSectionContent('about'),
      getSectionContent('skills'),
      getSectionContent('experience'),
      getSectionContent('faq_data'),
      getSectionContent('ai_config'), // [MỚI] Lấy cấu hình AI
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
    const aiConfig = parse((aiConfigData as any)?.contentEn || "{}"); // [MỚI] Parse AI Config

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const skillText = (skillsData as any)?.contentEn || "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aboutText = (aboutData as any)?.contentEn || "";

    // SYSTEM PROMPT (ĐỘNG)
    const systemPrompt = `
      ROLE: You are the ${aiConfig.roleName || "AI Assistant"} for the Portfolio of "${hero.fullName || "Vu Tri Dung"}".
      
      --- PERSONALITY & TONE (CONFIGURED BY OWNER) ---
      - Tone: ${aiConfig.tone || "Professional & Helpful"}
      - Special Instructions: ${aiConfig.systemPromptOverride || "Be polite and concise."}
      
      --- SECRET KNOWLEDGE (ONLY YOU KNOW) ---
      ${aiConfig.customStory || "No secret info provided."}

      --- PUBLIC KNOWLEDGE BASE ---
      1. PROFILE: ${hero.greeting}, ${hero.description}
      2. ABOUT: ${aboutText}
      3. SKILLS: ${skillText}
      4. EXPERIENCE: ${JSON.stringify(exp)}
      5. FAQ: ${JSON.stringify(faq)}
      6. PROJECTS: User has ${projects?.length || 0} projects.

      --- FINAL INSTRUCTIONS ---
      1. Answer based on the data above. Use "Secret Knowledge" to make conversation more natural if relevant.
      2. **IMPORTANT: The user is speaking ${targetLang}. ANSWER IN ${targetLang}.**
      3. Keep answers concise.
    `;

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
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