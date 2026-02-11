import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Bắt buộc để không bị cache

// Hàm helper trả về JSON có gắn CORS header
function jsonResponse(data: any, status = 200) {
    return NextResponse.json(data, {
        status,
        headers: {
            'Access-Control-Allow-Origin': '*', // MỞ CỬA CHO APP ANDROID
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

// 1. Xử lý Pre-flight check (CORS)
export async function OPTIONS() {
    return jsonResponse({}, 200);
}

// 2. GET: App Android gọi cái này để lấy dữ liệu
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) return jsonResponse(null);

    try {
        // [QUAN TRỌNG] Dùng 'prisma.pageSection' vì Admin lưu vào đây
        const section = await prisma.pageSection.findUnique({
            where: { sectionKey: key },
        });
        
        // Nếu tìm thấy, trả về data. Nếu không, trả về object rỗng {}
        return jsonResponse(section || {});
    } catch (error) {
        console.error("API GET Error:", error);
        return jsonResponse(null, 500);
    }
}

// 3. POST: Admin (nếu sau này viết App Admin) sẽ dùng cái này
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sectionKey, contentEn, contentVi, contentJp } = body;

        if (!sectionKey) return jsonResponse({ error: "Missing key" }, 400);

        // [QUAN TRỌNG] Cũng dùng 'prisma.pageSection'
        const updated = await prisma.pageSection.upsert({
            where: { sectionKey },
            update: { contentEn, contentVi, contentJp },
            create: { sectionKey, contentEn, contentVi, contentJp },
        });

        return jsonResponse(updated);
    } catch (error) {
        console.error("API POST Error:", error);
        return jsonResponse({ error: "Failed to save" }, 500);
    }
}