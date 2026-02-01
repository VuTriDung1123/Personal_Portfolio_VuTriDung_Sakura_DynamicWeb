import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSectionContent, getAllPosts } from '@/lib/actions';

// 1. Khởi tạo Gemini với API Key từ biến môi trường
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    // Lấy lịch sử chat từ Client gửi lên
    const { messages } = await req.json(); 
    
    // Lấy câu hỏi mới nhất của khách
    const lastMessage = messages[messages.length - 1].content;

    // 2. TẢI DỮ LIỆU TỪ ADMIN (NẠP KIẾN THỨC CHO AI)
    // AI sẽ đọc toàn bộ thông tin này để trả lời như là bạn
    const [heroData, aboutData, skillsData, expData, faqData, projects] = await Promise.all([
      getSectionContent('hero'),
      getSectionContent('about'),
      getSectionContent('skills'),
      getSectionContent('experience'),
      getSectionContent('faq_data'),
      getAllPosts()
    ]);

    // Hàm phụ trợ để parse JSON an toàn
    const parse = (str: string) => { try { return JSON.parse(str); } catch { return ""; } };
    
    // Xử lý dữ liệu thô thành object
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

    // 3. TẠO SYSTEM PROMPT (KỊCH BẢN CHO AI)
    // Đây là phần quan trọng nhất để AI biết nó là ai
    const systemPrompt = `
      ROLE: You are the AI Assistant/Virtual Secretary for the Portfolio of "${hero.fullName || "Vu Tri Dung"}".
      
      --- YOUR KNOWLEDGE BASE (DATA ABOUT THE OWNER) ---
      1. PROFILE:
         - Name: ${hero.fullName}
         - Title: ${hero.greeting}
         - Description: ${hero.description}
      
      2. ABOUT ME: 
         ${aboutText}
      
      3. SKILLS: 
         ${skillText}
      
      4. EXPERIENCE (Work History):
         ${JSON.stringify(exp)}
      
      5. KNOWLEDGE BASE (FAQ):
         ${JSON.stringify(faq)}

      6. PROJECTS:
         User has ${projects?.length || 0} projects in the database.

      --- INSTRUCTIONS FOR AI ---
      - Answer the user's question based ONLY on the data above.
      - If the user asks something personal not in the data (e.g., "Where do you live exactly?"), apologize and say you don't know or suggest contacting via email.
      - TONE: Professional, Helpful, slightly "Cool/Tech" style (since this is a developer portfolio).
      - LANGUAGE: IMPORTANT! If the user asks in Vietnamese, answer in Vietnamese. If English, answer in English. Detect the language of the question automatically.
      - Keep answers concise (under 3-4 sentences) unless asked for details.
    `;

    // 4. CẤU HÌNH MODEL GEMINI 2.5 FLASH
    // Dựa trên danh sách bạn cung cấp: input 1M token, output 65k token
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", // <--- CẬP NHẬT ĐÚNG TÊN MODEL BẠN GỬI
        systemInstruction: systemPrompt, // Nạp vai trò vào đây
        generationConfig: {
            temperature: 1, // Độ sáng tạo (theo config mặc định của model này)
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 2000, // Giới hạn câu trả lời cho ngắn gọn
        }
    });

    // 5. GỬI TIN NHẮN VÀ NHẬN PHẢN HỒI
    const result = await model.generateContent(lastMessage);
    const response = await result.response;
    const reply = response.text();

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Gemini AI Error:", error);
    // Trả về lỗi giả lập phong cách Hacker
    return NextResponse.json({ reply: "SYSTEM_ERROR: Neural Link Interrupted. Please check API Key or Model access." }, { status: 500 });
  }
}