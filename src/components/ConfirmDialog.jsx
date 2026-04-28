'use client';

import {
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlineXMark,
} from 'react-icons/hi2';

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
  icon: IconComponent,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-base-100 border border-base-300 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          {/* Icon */}
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isDangerous
                ? 'bg-error/10 text-error'
                : 'bg-warning/10 text-warning'
            }`}
          >
            {IconComponent ? (
              <IconComponent className="w-8 h-8" />
            ) : isDangerous ? (
              <HiOutlineExclamationTriangle className="w-8 h-8" />
            ) : (
              <HiOutlineCheckCircle className="w-8 h-8" />
            )}
          </div>

          {/* Title and Message */}
          <h3 className="font-heading text-xl text-center mb-2">{title}</h3>
          <p className="text-muted text-sm text-center leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="btn btn-ghost gap-2"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`btn gap-2 ${
                isDangerous ? 'btn-error' : 'btn-primary'
              }`}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
