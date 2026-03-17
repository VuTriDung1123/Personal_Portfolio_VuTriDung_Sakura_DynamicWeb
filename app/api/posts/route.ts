import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// MỞ CỬA CORS CHO ANDROID
function jsonResponse(data: any, status = 200) {
    return NextResponse.json(data, {
        status,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

export async function OPTIONS() { return jsonResponse({}, 200); }

// THÊM BÀI VIẾT (TỪ APP)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        // Bỏ 'id' đi vì PostgreSQL tự tạo ID
        const { id, createdAt, ...dataToSave } = body; 
        const newPost = await prisma.post.create({ data: dataToSave });
        return jsonResponse(newPost);
    } catch (error) { return jsonResponse({ error: "Lỗi tạo bài" }, 500); }
}

// SỬA BÀI VIẾT (TỪ APP)
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, createdAt, ...dataToUpdate } = body;
        const updated = await prisma.post.update({ where: { id }, data: dataToUpdate });
        return jsonResponse(updated);
    } catch (error) { return jsonResponse({ error: "Lỗi sửa bài" }, 500); }
}

// XÓA BÀI VIẾT (TỪ APP)
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return jsonResponse({ error: "Thiếu ID" }, 400);
        await prisma.post.delete({ where: { id } });
        return jsonResponse({ success: true });
    } catch (error) { return jsonResponse({ error: "Lỗi xóa" }, 500); }
}