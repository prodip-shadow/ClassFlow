import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import { User } from '@/models/User';
import { createSessionToken } from '@/lib/server/jwt';
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from '@/lib/server/auth';
import { verifyFirebaseIdToken } from '@/lib/server/firebase-id-token';
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit';

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit({
      key: `auth-session:${ip}`,
      limit: 15,
      windowMs: 10 * 60 * 1000,
    });

    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many login attempts, try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rl.retryAfterSec) },
        },
      );
    }

    const body = await request.json();
    const idToken = body?.idToken;

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json(
        { error: 'idToken is required' },
        { status: 400 },
      );
    }

    const firebaseUser = await verifyFirebaseIdToken(idToken);

    if (!firebaseUser?.email) {
      return NextResponse.json(
        { error: 'Invalid auth token' },
        { status: 401 },
      );
    }

    await connectMongo();
    const appUser = await User.findOne({ email: firebaseUser.email }).lean();

    const token = await createSessionToken({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: appUser?.name || firebaseUser.name || null,
      role: appUser?.role || null,
      userId: appUser?._id ? String(appUser._id) : null,
    });

    const response = NextResponse.json({
      ok: true,
      role: appUser?.role || null,
    });
    response.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 401 },
    );
  }
}
