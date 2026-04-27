'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/');
      return;
    }

    if (role && user.role !== role) {
      router.replace(
        user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard',
      );
    }
  }, [user, loading, role, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!user || (role && user.role !== role)) return null;

  return <>{children}</>;
}
