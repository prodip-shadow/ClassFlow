'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
} from 'react-icons/hi2';

const ToastContext = createContext(undefined);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, kind = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, kind, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="toast toast-top toast-end z-[1000]"
        data-testid="toast-stack"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`alert ${
              t.kind === 'success'
                ? 'alert-success'
                : t.kind === 'error'
                  ? 'alert-error'
                  : 'alert-info'
            } shadow-lg`}
          >
            {t.kind === 'success' && (
              <HiOutlineCheckCircle className="w-5 h-5" />
            )}
            {t.kind === 'error' && (
              <HiOutlineExclamationCircle className="w-5 h-5" />
            )}
            {t.kind === 'info' && (
              <HiOutlineInformationCircle className="w-5 h-5" />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
