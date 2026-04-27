import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit';

export async function POST(request) {
  try {
    const { error } = await requireSession(request);
    if (error) return error;

    const ip = getClientIp(request);
    const rl = checkRateLimit({
      key: `upload:${ip}`,
      limit: 20,
      windowMs: 60 * 60 * 1000,
    });
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many upload attempts. Try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rl.retryAfterSec) },
        },
      );
    }

    const apiKey = process.env.IMAGEBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'IMAGEBB_API_KEY is not configured' },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('image');

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { error: 'image file is required' },
        { status: 400 },
      );
    }

    if (typeof file.type === 'string' && !file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image uploads are allowed' },
        { status: 400 },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image size must be 5MB or less' },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString('base64');
    const body = new URLSearchParams();
    body.append('image', base64Image);

    const uploadRes = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      },
    );

    const data = await uploadRes.json();
    const url = data?.data?.display_url || data?.data?.url;

    if (!uploadRes.ok || !url) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 502 });
    }

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
}
