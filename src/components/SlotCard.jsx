'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineCheckBadge,
  HiOutlineLockClosed,
  HiOutlineUserCircle,
  HiOutlineTrash,
} from 'react-icons/hi2';

function formatDate(date) {
  try {
    const d = new Date(`${date}T00:00:00`);
    return d.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return date;
  }
}

export function SlotCard({
  slot,
  index = 0,
  actionLabel,
  onAction,
  onDelete,
  busy,
  showBookedBy,
  actionDisabled,
  disableActionWhenBooked = true,
  actionClassName = 'btn btn-primary btn-sm',
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        delay: index * 0.05,
        ease: 'power2.out',
      },
    );
  }, [index]);

  const isBooked = slot.status === 'booked';

  return (
    <div
      ref={ref}
      data-testid={`slot-card-${slot._id}`}
      className="card bg-base-200 border border-base-300 hover:border-primary/50 transition-colors shadow-sm"
    >
      <div className="card-body p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-base-content/90">
              <HiOutlineCalendarDays className="w-4 h-4 text-primary" />
              <span className="font-semibold">{formatDate(slot.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <HiOutlineClock className="w-4 h-4" />
              <span>
                {slot.startTime} - {slot.endTime}
              </span>
            </div>
          </div>
          <div
            className={`badge ${isBooked ? 'badge-error' : 'badge-success'} gap-1 font-semibold`}
          >
            {isBooked ? (
              <HiOutlineLockClosed className="w-3.5 h-3.5" />
            ) : (
              <HiOutlineCheckBadge className="w-3.5 h-3.5" />
            )}
            {isBooked ? 'Booked' : 'Available'}
          </div>
        </div>

        <div className="divider my-2" />

        <div className="flex items-center gap-2 text-sm">
          <HiOutlineUserCircle className="w-4 h-4 text-muted" />
          <span className="text-muted">Teacher:</span>
          <span className="font-medium">{slot.teacherName}</span>
        </div>

        {showBookedBy && slot.bookedByName && (
          <div className="flex items-center gap-2 text-sm">
            <HiOutlineUserCircle className="w-4 h-4 text-muted" />
            <span className="text-muted">Booked by:</span>
            <span className="font-medium">{slot.bookedByName}</span>
          </div>
        )}

        {slot.cancellationRequested && (
          <div className="badge badge-warning badge-outline mt-2">
            Cancellation request pending
          </div>
        )}

        {(onAction || onDelete) && (
          <div className="card-actions justify-end mt-4 gap-2">
            {onDelete && !isBooked && (
              <button
                type="button"
                onClick={onDelete}
                disabled={busy}
                className="btn btn-ghost btn-sm text-error"
                data-testid={`delete-slot-${slot._id}`}
              >
                <HiOutlineTrash className="w-4 h-4" /> Delete
              </button>
            )}
            {onAction && actionLabel && (
              <button
                type="button"
                onClick={onAction}
                disabled={
                  busy ||
                  (disableActionWhenBooked && isBooked) ||
                  actionDisabled
                }
                className={actionClassName}
                data-testid={`action-slot-${slot._id}`}
              >
                {busy ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  actionLabel
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
