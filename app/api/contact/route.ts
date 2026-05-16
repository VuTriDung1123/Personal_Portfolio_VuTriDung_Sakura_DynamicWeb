import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const email = formData.get('email') as string;
        const subject = formData.get('subject') as string;
        const message = formData.get('message') as string;
        const file = formData.get('file') as File | null;
        const recaptchaToken = formData.get('recaptchaToken') as string;

        if (!email || !subject || !message) {
            return NextResponse.json({ error: "Thiếu thông tin bắt buộc." }, { status: 400 });
        }

        if (!recaptchaToken) {
            return NextResponse.json({ error: "Vui lòng xác thực bạn không phải là Robot." }, { status: 400 });
        }

        // 1. Gửi token cho Google kiểm tra CAPTCHA
        const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
        });
        const verifyData = await verifyRes.json();

        if (!verifyData.success) {
            return NextResponse.json({ error: "Xác thực CAPTCHA thất bại. Vui lòng thử lại." }, { status: 400 });
        }

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("LỖI: Chưa cấu hình EMAIL_USER hoặc EMAIL_PASS trong file .env");
            return NextResponse.json({ error: "Lỗi cấu hình Server." }, { status: 500 });
        }

        // Cấu hình con Bot chuyển phát thư
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // TỐI ƯU 1: Bỏ transporter.verify() tại đây để tiết kiệm thời gian kết nối handshake.

        const attachments = [];
        if (file && file.size > 0 && file.name !== 'undefined') {
            const buffer = Buffer.from(await file.arrayBuffer());
            attachments.push({
                filename: file.name,
                content: buffer,
            });
        }

        // TỐI ƯU 2: Kích hoạt Promise.all để bắn cả 2 Email đi cùng một lúc song song
        await Promise.all([
            // Bức thư số 1: Gửi cho bạn (Admin)
            transporter.sendMail({
                from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`, 
                replyTo: email, 
                to: process.env.EMAIL_USER, 
                subject: `[SAKURA PORTFOLIO] ${subject}`,
                text: `Bạn nhận được một câu hỏi mới từ Portfolio!\n\nNgười gửi: ${email}\nTiêu đề: ${subject}\n\nNội dung:\n${message}`,
                attachments,
            }),
            // Bức thư số 2: Gửi Auto-reply cho khách gọn gàng
            transporter.sendMail({
                from: `"Vũ Trí Dũng (Sakura Assistant)" <${process.env.EMAIL_USER}>`,
                to: email, 
                subject: `[Auto-Reply] Cảm ơn bạn đã liên hệ! 🌸`,
                text: `Xin chào,\n\nCảm ơn bạn đã ghé thăm trang Portfolio và gửi câu hỏi cho mình.\nHệ thống đã ghi nhận tin nhắn của bạn với nội dung:\n\n"${message}"\n\nMình sẽ đọc và phản hồi lại bạn qua email này trong thời gian sớm nhất nhé!\n\nTrân trọng,\nVũ Trí Dũng.`,
            })
        ]);

        // Cả 2 thư xử lý xong song song, trả phản hồi về ngay lập tức
        return NextResponse.json({ success: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("=== LỖI GỬI EMAIL ===");
        console.error(error.message || error);
        return NextResponse.json({ error: "Không thể gửi thư." }, { status: 500 });
    }
}