import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LandingPage } from '@/components/pages/LandingPage';
import { verifySessionToken } from '@/lib/server/jwt';

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('classflow_session')?.value;

  if (token) {
    const session = await verifySessionToken(token);

    if (session?.role === 'teacher') {
      redirect('/teacher/dashboard');
    }

    if (session?.role === 'student') {
      redirect('/student/dashboard');
    }
  }

  return <LandingPage />;
}
