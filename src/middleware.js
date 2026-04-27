import { NextResponse } from 'next/server';

const SESSION_COOKIE = 'classflow_session';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/teacher/dashboard') ||
    pathname.startsWith('/student/dashboard')
  ) {
    const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
    if (!hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/teacher/dashboard/:path*', '/student/dashboard/:path*'],
};
