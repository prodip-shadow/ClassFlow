import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/server/jwt';

export const SESSION_COOKIE = 'classflow_session';

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};

export async function getSession(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  return {
    uid: payload.uid,
    email: payload.email,
    role: payload.role || null,
    userId: payload.userId || null,
    name: payload.name || null,
  };
}

export async function requireSession(request) {
  const session = await getSession(request);
  if (!session?.email) {
    return {
      session: null,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  return { session, error: null };
}

export async function requireRole(request, role) {
  const { session, error } = await requireSession(request);
  if (error) return { session: null, error };

  if (session.role !== role) {
    return {
      session: null,
      error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return { session, error: null };
}
