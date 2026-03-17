import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Tắt cache để luôn lấy bài mới nhất

// MỞ CỬA CORS CHO ANDROID
function jsonResponse(data: unknown, status = 200) {
    return NextResponse.json(data, {
        status,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

// 1. KIỂM TRA BẢO MẬT (OPTIONS)
export async function OPTIONS() { return jsonResponse({}, 200); }

// 2. [ĐÃ KHÔI PHỤC] LẤY DANH SÁCH BÀI VIẾT (GET)
export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return jsonResponse(posts);
    } catch (error) {
        console.error("API GET Error:", error);
        return jsonResponse([], 500);
    }
}

// 3. THÊM BÀI VIẾT (POST)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        // Bỏ 'id' và 'createdAt' đi vì PostgreSQL tự động tạo
        const { id, createdAt, ...dataToSave } = body; 
        const newPost = await prisma.post.create({ data: dataToSave });
        return jsonResponse(newPost);
    } catch { return jsonResponse({ error: "Lỗi tạo bài" }, 500); }
}

// 4. SỬA BÀI VIẾT (PUT)
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, createdAt, ...dataToUpdate } = body;
        const updated = await prisma.post.update({ where: { id }, data: dataToUpdate });
        return jsonResponse(updated);
    } catch  { return jsonResponse({ error: "Lỗi sửa bài" }, 500); }
}

// 5. XÓA BÀI VIẾT (DELETE)
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return jsonResponse({ error: "Thiếu ID" }, 400);
        await prisma.post.delete({ where: { id } });
        return jsonResponse({ success: true });
    } catch { return jsonResponse({ error: "Lỗi xóa" }, 500); }
}