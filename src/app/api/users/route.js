import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectMongo } from '@/lib/mongodb';
import { User } from '@/models/User';
import { requireSession } from '@/lib/server/auth';
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit';
import { deleteCache, getCache, setCache } from '@/lib/server/cache';

const USER_CACHE_TTL_MS = 10_000;

const upsertSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  photoURL: z.string().default(''),
  role: z.enum(['teacher', 'student']),
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  photoURL: z.string().optional(),
});

export async function GET(request) {
  try {
    const { session, error } = await requireSession(request);
    if (error) return error;

    const cacheKey = `user:${session.email}`;
    const cachedUser = getCache(cacheKey);
    if (cachedUser) {
      return NextResponse.json(cachedUser, {
        headers: {
          'Cache-Control': 'private, max-age=10, stale-while-revalidate=20',
          'X-Cache': 'HIT',
        },
      });
    }

    await connectMongo();
    const user = await User.findOne({ email: session.email }).lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    setCache(cacheKey, user, USER_CACHE_TTL_MS);

    return NextResponse.json(user, {
      headers: {
        'Cache-Control': 'private, max-age=10, stale-while-revalidate=20',
        'X-Cache': 'MISS',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { session, error } = await requireSession(request);
    if (error) return error;

    const ip = getClientIp(request);
    const rl = checkRateLimit({
      key: `users-post:${ip}`,
      limit: 25,
      windowMs: 60 * 60 * 1000,
    });
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rl.retryAfterSec) },
        },
      );
    }

    await connectMongo();
    const body = await request.json();
    const parsed = upsertSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid user data', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const data = parsed.data;
    if (data.email !== session.email) {
      return NextResponse.json(
        { error: 'Email must match authenticated session' },
        { status: 403 },
      );
    }

    const existing = await User.findOne({ email: data.email });
    if (existing) {
      deleteCache(`user:${session.email}`);
      return NextResponse.json(existing.toObject());
    }

    const created = await User.create(data);
    deleteCache(`user:${session.email}`);
    return NextResponse.json(created.toObject(), { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to upsert user' },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const { session, error } = await requireSession(request);
    if (error) return error;

    await connectMongo();
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid update data' },
        { status: 400 },
      );
    }

    const updates = parsed.data;
    const updated = await User.findOneAndUpdate(
      { email: session.email },
      { $set: updates },
      { new: true },
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    deleteCache(`user:${session.email}`);

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 },
    );
  }
}
