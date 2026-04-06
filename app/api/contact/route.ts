import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const email = formData.get('email') as string;
        const subject = formData.get('subject') as string;
        const message = formData.get('message') as string;
        const file = formData.get('file') as File | null;

        if (!email || !subject || !message) {
            return NextResponse.json({ error: "Thiếu thông tin bắt buộc." }, { status: 400 });
        }

        // Cấu hình con Bot chuyển phát thư (Dùng Gmail của bạn)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Xử lý file đính kèm
        const attachments = [];
        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            attachments.push({
                filename: file.name,
                content: buffer,
            });
        }

        // 1. GỬI EMAIL CHO BẠN
        await transporter.sendMail({
            from: `"${email}" <${process.env.EMAIL_USER}>`, 
            replyTo: email, 
            to: process.env.EMAIL_USER, 
            subject: `[SAKURA PORTFOLIO] ${subject}`,
            text: `Bạn nhận được một câu hỏi mới từ Portfolio!\n\nNgười gửi: ${email}\nTiêu đề: ${subject}\n\nNội dung:\n${message}`,
            attachments,
        });

        // 2. GỬI EMAIL TỰ ĐỘNG CHO KHÁCH (Auto-reply)
        await transporter.sendMail({
            from: `"Vũ Trí Dũng (Sakura Assistant)" <${process.env.EMAIL_USER}>`,
            to: email, 
            subject: `[Auto-Reply] Cảm ơn bạn đã liên hệ! 🌸`,
            text: `Xin chào,\n\nCảm ơn bạn đã ghé thăm trang Portfolio và gửi câu hỏi cho mình.\nHệ thống đã ghi nhận tin nhắn của bạn với nội dung:\n\n"${message}"\n\nMình sẽ đọc và phản hồi lại bạn qua email này trong thời gian sớm nhất nhé!\n\nTrân trọng,\nVũ Trí Dũng.`,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Lỗi gửi email:", error);
        return NextResponse.json({ error: "Không thể gửi thư." }, { status: 500 });
    }
}