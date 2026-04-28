'use client';

import { useEffect, useRef, memo } from 'react';
import gsap from 'gsap';
import {
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineCheckBadge,
  HiOutlineLockClosed,
  HiOutlineUserCircle,
  HiOutlineTrash,
} from 'react-icons/hi2';
import { getGoogleCalendarUrl } from '@/lib/calendar';

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

function SlotCardComponent({
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
  const isCompleted = slot.status === 'completed';
  const joinHref =
    slot.meetLink || slot.calendarHtmlLink || `/meet/${slot._id}`;
  const isExternalJoin = joinHref.startsWith('http');

  return (
    <div
      ref={ref}
      data-testid={`slot-card-${slot._id}`}
      className="card bg-base-200 border border-base-300 hover:border-primary/50 transition-colors shadow-sm"
    >
      <div className="card-body p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            {slot.title && (
              <p className="font-heading text-base-content">{slot.title}</p>
            )}
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
            {slot.description && (
              <p className="text-sm text-muted pt-1">{slot.description}</p>
            )}
          </div>
          <div
            className={`badge ${isCompleted ? 'badge-neutral' : isBooked ? 'badge-error' : 'badge-success'} gap-1 font-semibold`}
          >
            {isCompleted ? (
              <HiOutlineCheckBadge className="w-3.5 h-3.5" />
            ) : isBooked ? (
              <HiOutlineLockClosed className="w-3.5 h-3.5" />
            ) : (
              <HiOutlineCheckBadge className="w-3.5 h-3.5" />
            )}
            {isCompleted ? 'Completed' : isBooked ? 'Booked' : 'Available'}
          </div>
        </div>

        <div className="divider my-2" />

        <div className="flex items-center gap-2 text-sm">
          <HiOutlineUserCircle className="w-4 h-4 text-muted" />
          <span className="text-muted">Teacher:</span>
          <span className="font-medium">{slot.teacherName}</span>
        </div>

        {slot.prepNotes && (
          <div className="mt-3 rounded-lg border border-base-300 bg-base-300/40 p-3 text-sm">
            <p className="text-xs uppercase tracking-wide text-muted mb-1">
              Preparation notes
            </p>
            <p className="text-base-content/90 whitespace-pre-wrap">
              {slot.prepNotes}
            </p>
          </div>
        )}

        {showBookedBy && slot.bookedByName && (
          <div className="flex items-center gap-2 text-sm">
            <HiOutlineUserCircle className="w-4 h-4 text-muted" />
            <span className="text-muted">Booked by:</span>
            <span className="font-medium">{slot.bookedByName}</span>
          </div>
        )}

        {slot.studentNotes && (
          <div className="mt-3 rounded-lg border border-base-300 bg-base-300/40 p-3 text-sm">
            <p className="text-xs uppercase tracking-wide text-muted mb-1">
              Student notes
            </p>
            <p className="text-base-content/90 whitespace-pre-wrap">
              {slot.studentNotes}
            </p>
          </div>
        )}

        {slot.cancellationRequested && (
          <div className="badge badge-warning badge-outline mt-2">
            Cancellation request pending
          </div>
        )}

        {(onAction || onDelete) && (
          <div className="card-actions justify-end mt-4 gap-2">
            {isBooked && (
              <a
                href={joinHref}
                target={isExternalJoin ? '_blank' : undefined}
                rel={isExternalJoin ? 'noopener noreferrer' : undefined}
                className="btn btn-primary btn-sm gap-2"
                data-testid={`join-meeting-${slot._id}`}
              >
                <HiOutlineCalendarDays className="w-4 h-4" />
                Join meeting
              </a>
            )}
            {onDelete && (
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
            {isBooked && (
              <a
                href={getGoogleCalendarUrl(slot)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm text-primary gap-2"
                title="Add to Google Calendar"
              >
                <HiOutlineCalendarDays className="w-4 h-4" />
                <span className="hidden sm:inline">Calendar</span>
              </a>
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

export const SlotCard = memo(SlotCardComponent, (prevProps, nextProps) => {
  // Custom comparison: re-render only if necessary data changes
  return (
    prevProps.slot._id === nextProps.slot._id &&
    prevProps.slot.status === nextProps.slot.status &&
    prevProps.busy === nextProps.busy &&
    prevProps.actionLabel === nextProps.actionLabel &&
    prevProps.disableActionWhenBooked === nextProps.disableActionWhenBooked
  );
});
