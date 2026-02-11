import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key'); // App sẽ gửi ?key=about, ?key=hero...

  if (!key) return NextResponse.json(null);

  try {
    const section = await prisma.sectionContent.findUnique({
      where: { sectionKey: key },
    });
    return NextResponse.json(section || {}); 
  } catch (error) {
    return NextResponse.json(null);
  }
}