'use client';

import { ToastProvider } from '@/components/Toast';
import { AuthProvider } from '@/contexts/AuthContext';

export function Providers({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
}
