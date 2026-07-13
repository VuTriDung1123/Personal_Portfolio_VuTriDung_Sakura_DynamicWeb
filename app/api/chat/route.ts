import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSectionContent, getAllPosts } from "@/lib/actions";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    console.log("==== CHECK API KEY ====", process.env.GEMINI_API_KEY);
    if (!apiKey) {
      console.error("LỖI: Chưa tìm thấy GEMINI_API_KEY trong file .env");
      return NextResponse.json(
        { reply: "Lỗi hệ thống: Chưa cấu hình API Key. 🍃" },
        { status: 500 },
      );
    }

    const { messages, language, theme } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    const langMap: Record<string, string> = {
      vi: "Vietnamese",
      en: "English",
      jp: "Japanese",
    };
    const targetLang = langMap[language] || "English";

    const [
      heroData,
      aboutData,
      skillsData,
      expData,
      faqData,
      aiConfigData,
      projects,
    ] = await Promise.all([
      getSectionContent("hero"),
      getSectionContent("about"),
      getSectionContent("skills"),
      getSectionContent("experience"),
      getSectionContent("faq_data"),
      getSectionContent("ai_config"),
      getAllPosts(),
    ]);

    const parse = (str: string) => {
      try {
        return JSON.parse(str);
      } catch {
        return "";
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hero = parse((heroData as any)?.contentEn || "{}");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exp = parse((expData as any)?.contentEn || "[]");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const faq = parse((faqData as any)?.contentEn || "[]");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fullAiConfig = parse((aiConfigData as any)?.contentEn || "{}");

    const activeProfile =
      theme === "sakura"
        ? fullAiConfig.sakura || {
            roleName: "Sakura Assistant",
            tone: "Cute, Friendly",
            customStory: "",
            systemPromptOverride: "",
          }
        : fullAiConfig.hacker || {
            roleName: "System Admin",
            tone: "Cool, Logical",
            customStory: "",
            systemPromptOverride: "",
          };

    // 1. DANH SÁCH CÁC MODEL DỰ PHÒNG (Dùng alias -latest tự động cập nhật bản xịn nhất)
    const FALLBACK_MODELS = [
      "gemini-flash-latest", // Ưu tiên 1: Tự động trỏ vào bản Flash mới và nhanh nhất
      "gemini-3.5-flash", // Ưu tiên 2: Bản 3.5 Flash cụ thể (rất mạnh)
      "gemini-pro-latest", // Ưu tiên 3: Tự động trỏ vào bản Pro mới nhất (thông minh nhưng chậm hơn chút)
      "gemini-flash-lite-latest", // Ưu tiên cuối: Bản Lite siêu nhẹ để vét cùng cạn kiệt
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const skillText = (skillsData as any)?.contentEn || "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aboutText = (aboutData as any)?.contentEn || "";

    const systemPrompt = `
      ROLE: You are the "${activeProfile.roleName}" for the Portfolio of "${hero.fullName || "Vu Tri Dung"}".
      
      --- PERSONALITY & TONE ---
      - Tone: ${activeProfile.tone}
      - Style: ${theme === "sakura" ? "Use emojis like 🌸✨, be warm and polite." : "Use technical terms, be concise and cool."}
      
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
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt,
        });
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
    return NextResponse.json(
      {
        reply:
          "Hệ thống AI đang quá tải hoặc lỗi kết nối. Vui lòng thử lại sau 🍃",
      },
      { status: 500 },
    );
  }
}
