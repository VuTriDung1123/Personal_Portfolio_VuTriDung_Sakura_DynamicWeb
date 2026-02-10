// File: app/api/sections/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Đảm bảo đường dẫn import prisma đúng với dự án của bạn

export const dynamic = 'force-dynamic'; // Bắt buộc để không bị cache dữ liệu cũ

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
    }

    // Lấy dữ liệu từ DB giống hệt hàm getSectionContent
    const section = await prisma.sectionContent.findUnique({
      where: { sectionKey: key },
    });

    // Trả về JSON để App Android đọc được
    return NextResponse.json(section || {}); 
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Hàm POST để App Android (Admin) lưu dữ liệu
export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Giả sử body gửi lên có dạng { key: 'hero', contentEn: '...', ... }
        // Bạn cần xử lý logic lưu vào DB ở đây (tương tự saveSectionContent)
        // Tuy nhiên để App Admin chạy được, bạn cần implement logic update ở đây
        // Tạm thời trả về success để test GET trước.
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}