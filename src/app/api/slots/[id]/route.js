import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import { Slot } from '@/models/Slot';
import { requireRole, requireSession } from '@/lib/server/auth';
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit';
import { User } from '@/models/User';
import { deleteCacheByPrefix } from '@/lib/server/cache';
import {
  createGoogleMeetEvent,
  deleteGoogleMeetEvent,
  updateGoogleMeetEvent,
} from '@/lib/server/google-calendar';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { session, error } = await requireSession(request);
    if (error) return error;

    await connectMongo();

    const user = await User.findOne({ email: session.email }).lean();
    if (!user) {
      return NextResponse.json(
        { error: 'User account not found' },
        { status: 403 },
      );
    }

    const slot = await Slot.findById(id).lean();
    if (!slot) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    const isOwner = slot.teacherId === String(user._id);
    const isBookedByUser = slot.bookedBy === String(user._id);

    if (!isOwner && !isBookedByUser) {
      return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
    }

    return NextResponse.json(slot);
  } catch {
    return NextResponse.json({ error: 'Failed to load slot' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const action = typeof body?.action === 'string' ? body.action : 'book';
    const studentNotes =
      typeof body?.studentNotes === 'string' ? body.studentNotes : '';
    const ip = getClientIp(request);

    await connectMongo();

    if (action === 'approve-cancel') {
      const { session, error } = await requireRole(request, 'teacher');
      if (error) return error;

      const rl = checkRateLimit({
        key: `slots-approve-cancel:${ip}:${session.email}`,
        limit: 120,
        windowMs: 60 * 60 * 1000,
      });

      if (!rl.success) {
        return NextResponse.json(
          { error: 'Too many attempts. Try again later.' },
          {
            status: 429,
            headers: { 'Retry-After': String(rl.retryAfterSec) },
          },
        );
      }

      const teacher = await User.findOne({ email: session.email }).lean();
      if (!teacher || teacher.role !== 'teacher') {
        return NextResponse.json(
          { error: 'Teacher account not found' },
          { status: 403 },
        );
      }

      const slot = await Slot.findById(id);
      if (!slot) {
        return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
      }

      if (slot.teacherId !== String(teacher._id)) {
        return NextResponse.json({ error: 'Not your slot' }, { status: 403 });
      }

      if (slot.status !== 'booked') {
        return NextResponse.json(
          { error: 'Only booked slots can be updated' },
          { status: 400 },
        );
      }

      if (!slot.cancellationRequested) {
        return NextResponse.json(
          { error: 'No cancellation request found for this slot' },
          { status: 400 },
        );
      }

      slot.status = 'available';
      slot.bookedBy = null;
      slot.bookedByName = null;
      slot.bookedByEmail = null;
      slot.cancellationRequested = false;
      slot.cancellationRequestedAt = null;
      await slot.save();

      deleteCacheByPrefix('slots:');

      return NextResponse.json(slot.toObject());
    }

    const { session, error } = await requireRole(request, 'student');
    if (error) return error;

    const student = await User.findOne({ email: session.email }).lean();
    if (!student || student.role !== 'student') {
      return NextResponse.json(
        { error: 'Student account not found' },
        { status: 403 },
      );
    }

    if (action === 'request-cancel') {
      const rl = checkRateLimit({
        key: `slots-request-cancel:${ip}:${session.email}`,
        limit: 80,
        windowMs: 60 * 60 * 1000,
      });

      if (!rl.success) {
        return NextResponse.json(
          { error: 'Too many attempts. Try again later.' },
          {
            status: 429,
            headers: { 'Retry-After': String(rl.retryAfterSec) },
          },
        );
      }

      const slot = await Slot.findById(id);
      if (!slot) {
        return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
      }

      if (slot.status !== 'booked' || slot.bookedBy !== String(student._id)) {
        return NextResponse.json(
          { error: 'You can request cancel only for your booked slot' },
          { status: 403 },
        );
      }

      if (slot.cancellationRequested) {
        return NextResponse.json(
          { error: 'Cancellation request already sent' },
          { status: 409 },
        );
      }

      slot.cancellationRequested = true;
      slot.cancellationRequestedAt = new Date();
      await slot.save();

      deleteCacheByPrefix('slots:');

      return NextResponse.json(slot.toObject());
    }

    const rl = checkRateLimit({
      key: `slots-book:${ip}:${session.email}`,
      limit: 80,
      windowMs: 60 * 60 * 1000,
    });

    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many booking attempts. Try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rl.retryAfterSec) },
        },
      );
    }

    const existingBooked = await Slot.findOne({
      bookedBy: String(student._id),
      status: 'booked',
      _id: { $ne: id },
    }).lean();

    if (existingBooked) {
      return NextResponse.json(
        {
          error:
            'You already have a booked slot. Request cancellation and wait for teacher approval before booking a new slot.',
        },
        { status: 409 },
      );
    }

    const slot = await Slot.findById(id);
    if (!slot) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    if (slot.status === 'booked') {
      return NextResponse.json(
        { error: 'Slot already booked' },
        { status: 409 },
      );
    }

    slot.status = 'booked';
    slot.bookedBy = String(student._id);
    slot.bookedByName = student.name;
    slot.bookedByEmail = student.email;
    slot.studentNotes = studentNotes.trim();
    slot.cancellationRequested = false;
    slot.cancellationRequestedAt = null;
    await slot.save();

    if (slot.calendarEventId) {
      try {
        await updateGoogleMeetEvent(slot, slot.studentNotes);
      } catch {
        // keep booking success even if calendar sync fails
      }
    }

    deleteCacheByPrefix('slots:');

    return NextResponse.json(slot.toObject());
  } catch {
    return NextResponse.json({ error: 'Failed to book slot' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { session, error } = await requireRole(request, 'teacher');
    if (error) return error;

    await connectMongo();
    const teacher = await User.findOne({ email: session.email }).lean();
    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Teacher account not found' },
        { status: 403 },
      );
    }

    const slot = await Slot.findById(id);
    if (!slot) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    if (slot.teacherId !== String(teacher._id)) {
      return NextResponse.json({ error: 'Not your slot' }, { status: 403 });
    }

    if (slot.status === 'booked') {
      return NextResponse.json(
        { error: 'Booked slot cannot be deleted directly' },
        { status: 409 },
      );
    }

    await slot.deleteOne();

    deleteCacheByPrefix('slots:');

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete slot' },
      { status: 500 },
    );
  }
}
