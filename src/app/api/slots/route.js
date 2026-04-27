import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectMongo } from '@/lib/mongodb';
import { Slot } from '@/models/Slot';
import { requireSession, requireRole } from '@/lib/server/auth';
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit';
import { User } from '@/models/User';
import { deleteCacheByPrefix, getCache, setCache } from '@/lib/server/cache';

const createSlotSchema = z.object({
  date: z.string().min(1),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

const SLOTS_CACHE_TTL_MS = 8_000;

function toMilliseconds(date, time) {
  return new Date(`${date}T${time}:00`).getTime();
}

export async function GET(request) {
  try {
    const { session, error } = await requireSession(request);
    if (error) return error;

    const params = new URL(request.url).searchParams;
    const bookedBy = params.get('bookedBy');
    const status = params.get('status');
    const cacheKey = `slots:${session.role}:${session.userId || 'none'}:${bookedBy || 'none'}:${status || 'none'}`;
    const cachedSlots = getCache(cacheKey);

    if (cachedSlots) {
      return NextResponse.json(cachedSlots, {
        headers: {
          'Cache-Control': 'private, max-age=8, stale-while-revalidate=20',
          'X-Cache': 'HIT',
        },
      });
    }

    await connectMongo();

    const filter = {};
    if (session.role === 'teacher') {
      if (!session.userId) {
        return NextResponse.json(
          { error: 'Profile setup required' },
          { status: 403 },
        );
      }
      filter.teacherId = session.userId;
      if (status) filter.status = status;
    } else if (session.role === 'student') {
      if (!session.userId) {
        return NextResponse.json(
          { error: 'Profile setup required' },
          { status: 403 },
        );
      }
      if (bookedBy !== null) {
        filter.bookedBy = session.userId;
      } else {
        filter.status = status || 'available';
      }
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const slots = await Slot.find(filter)
      .sort({ date: 1, startTime: 1 })
      .lean();

    setCache(cacheKey, slots, SLOTS_CACHE_TTL_MS);

    return NextResponse.json(slots, {
      headers: {
        'Cache-Control': 'private, max-age=8, stale-while-revalidate=20',
        'X-Cache': 'MISS',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to list slots' },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { session, error } = await requireRole(request, 'teacher');
    if (error) return error;

    const ip = getClientIp(request);
    const rl = checkRateLimit({
      key: `slots-post:${ip}:${session.email}`,
      limit: 40,
      windowMs: 60 * 60 * 1000,
    });
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many create attempts. Try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rl.retryAfterSec) },
        },
      );
    }

    await connectMongo();
    const body = await request.json();
    const parsed = createSlotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid slot data', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const teacher = await User.findOne({ email: session.email }).lean();
    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Teacher account not found' },
        { status: 403 },
      );
    }

    const startMs = toMilliseconds(data.date, data.startTime);
    const endMs = toMilliseconds(data.date, data.endTime);

    if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
      return NextResponse.json({ error: 'Invalid date/time' }, { status: 400 });
    }

    if (startMs < Date.now() - 60_000) {
      return NextResponse.json(
        { error: 'Cannot create a slot in the past' },
        { status: 400 },
      );
    }

    if (endMs <= startMs) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 },
      );
    }

    const sameDay = await Slot.find({
      teacherId: String(teacher._id),
      date: data.date,
    }).lean();

    const overlap = sameDay.some((slot) => {
      const slotStart = toMilliseconds(slot.date, slot.startTime);
      const slotEnd = toMilliseconds(slot.date, slot.endTime);
      return startMs < slotEnd && endMs > slotStart;
    });

    if (overlap) {
      return NextResponse.json(
        { error: 'This slot overlaps an existing slot' },
        { status: 409 },
      );
    }

    const created = await Slot.create({
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      teacherId: String(teacher._id),
      teacherName: teacher.name,
      teacherEmail: teacher.email,
      status: 'available',
      bookedBy: null,
      bookedByName: null,
      bookedByEmail: null,
      cancellationRequested: false,
      cancellationRequestedAt: null,
    });

    deleteCacheByPrefix('slots:');

    return NextResponse.json(created.toObject(), { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create slot' },
      { status: 500 },
    );
  }
}
