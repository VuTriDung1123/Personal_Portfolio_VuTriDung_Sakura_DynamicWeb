import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function jsonResponse(data: any, status = 200) {
    return NextResponse.json(data, {
        status,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

export async function OPTIONS() {
    return jsonResponse({}, 200);
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return jsonResponse(posts);
  } catch (error) {
    console.error("API Error:", error);
    return jsonResponse([], 500);
  }
}