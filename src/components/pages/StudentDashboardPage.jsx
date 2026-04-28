'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, useMemo, memo } from 'react';
import {
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlineCalendarDays,
  HiOutlineBookmarkSquare,
  HiOutlineCheckBadge,
  HiOutlineSquares2X2,
} from 'react-icons/hi2';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ProfileSection } from '@/components/ProfileSection';
import { SlotCard } from '@/components/SlotCard';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { api } from '@/lib/api';
import { getGoogleCalendarUrl } from '@/lib/calendar';
import { withCache, cacheClear } from '@/lib/cache';

function StudentOverviewCardComponent({ available = [], bookings = [] }) {
  return (
    <div className="card bg-base-200 border border-base-300 mb-8 shadow">
      <div className="card-body p-6 sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <HiOutlineSparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-heading text-2xl">Student overview</h2>
              <p className="text-muted text-sm">
                Smart class booking experience in a single dashboard.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/student/dashboard/available"
              className="btn btn-primary gap-2"
            >
              Browse slots
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/student/dashboard/bookings"
              className="btn btn-ghost border border-base-300 gap-2"
            >
              My bookings
              <HiOutlineBookmarkSquare className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-5">
          <Link
            href="/student/dashboard/available"
            className="group rounded-lg border border-base-300 bg-base-200/80 p-4 text-left hover:border-primary/40 hover:bg-base-200 transition"
          >
            <HiOutlineCheckBadge className="w-5 h-5 text-success" />
            <p className="font-heading mt-2 flex items-center gap-2">
              Find Open Slots
              <HiOutlineArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
            </p>
            <p className="text-xs text-muted mt-1">
              Explore currently available teacher slots instantly.
            </p>
          </Link>
          <Link
            href="/student/dashboard/bookings"
            className="group rounded-lg border border-base-300 bg-base-200/80 p-4 text-left hover:border-primary/40 hover:bg-base-200 transition"
          >
            <HiOutlineBookmarkSquare className="w-5 h-5 text-primary" />
            <p className="font-heading mt-2 flex items-center gap-2">
              Book in One Click
              <HiOutlineArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
            </p>
            <p className="text-xs text-muted mt-1">
              Reserve a slot quickly and keep track from bookings.
            </p>
          </Link>
          <Link
            href="/student/dashboard/bookings"
            className="group rounded-lg border border-base-300 bg-base-200/80 p-4 text-left hover:border-warning/40 hover:bg-base-200 transition"
          >
            <HiOutlineCalendarDays className="w-5 h-5 text-warning" />
            <p className="font-heading mt-2 flex items-center gap-2">
              Stay Organized
              <HiOutlineArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
            </p>
            <p className="text-xs text-muted mt-1">
              Manage upcoming class times with clarity and focus.
            </p>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-base-300/50">
          <div className="stat bg-base-100 rounded-lg p-4">
            <div className="stat-figure text-primary">
              <HiOutlineBookmarkSquare className="w-6 h-6" />
            </div>
            <div className="stat-title text-xs text-muted">My Bookings</div>
            <div className="stat-value font-heading text-xl">
              {bookings.length}
            </div>
            <div className="stat-desc text-xs text-muted mt-1">
              {bookings.length === 0
                ? 'No bookings'
                : `${bookings.length} session${bookings.length !== 1 ? 's' : ''}`}
            </div>
          </div>

          <div className="stat bg-base-100 rounded-lg p-4">
            <div className="stat-figure text-success">
              <HiOutlineCheckBadge className="w-6 h-6" />
            </div>
            <div className="stat-title text-xs text-muted">Open Slots</div>
            <div className="stat-value font-heading text-xl text-success">
              {available.length}
            </div>
            <div className="stat-desc text-xs text-muted mt-1">
              {available.length === 0 ? 'None available' : 'Ready to book'}
            </div>
          </div>

          <div className="stat bg-base-100 rounded-lg p-4">
            <div className="stat-figure text-warning">
              <HiOutlineCalendarDays className="w-6 h-6" />
            </div>
            <div className="stat-title text-xs text-muted">Next Class</div>
            <div className="stat-value font-heading text-sm text-warning">
              {bookings.length > 0 ? bookings[0]?.date?.slice(5) : '—'}
            </div>
            <div className="stat-desc text-xs text-muted mt-1">
              {bookings.length > 0
                ? `${bookings[0]?.startTime}`
                : 'Schedule soon'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const StudentOverviewCard = memo(StudentOverviewCardComponent);

function StudentDashboardInner({ section }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [available, setAvailable] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [selectedBookingSlot, setSelectedBookingSlot] = useState(null);
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastBookedSlot, setLastBookedSlot] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const needsData =
    section === 'available' || section === 'bookings' || section === 'overview';

  // Memoized computed values
  const hasActiveBooking = useMemo(
    () => bookings.length > 0,
    [bookings.length],
  );
  const showAvailable = useMemo(() => section === 'available', [section]);
  const showBookings = useMemo(() => section === 'bookings', [section]);

  // Lazy load data only when needed
  useEffect(() => {
    if (!user || !needsData || dataLoaded) return;

    const load = async () => {
      setLoading(true);
      try {
        const [availResp, mineResp] = await Promise.all([
          withCache(`available-slots-${user._id}`, () =>
            api
              .get('/slots', { params: { status: 'available' } })
              .then((r) => r.data),
          ),
          withCache(`my-bookings-${user._id}`, () =>
            api
              .get('/slots', { params: { bookedBy: 'me' } })
              .then((r) => r.data),
          ),
        ]);
        setAvailable(availResp);
        setBookings(mineResp);
        setDataLoaded(true);
      } catch {
        toast('Failed to load slots.', 'error');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, needsData, dataLoaded, toast]);

  // Memoized handlers
  const openBookingModal = useCallback(
    (slot) => {
      if (busyId || bookingSubmitting) return;
      setBookingNotes('');
      setSelectedBookingSlot(slot);
    },
    [busyId, bookingSubmitting],
  );

  const closeBookingModal = useCallback(() => {
    if (bookingSubmitting) return;
    setSelectedBookingSlot(null);
    setBookingNotes('');
  }, [bookingSubmitting]);

  const handleBook = useCallback(async () => {
    if (!user || !selectedBookingSlot) return;
    const slot = selectedBookingSlot;
    setBookingSubmitting(true);
    setBusyId(slot._id);
    setAvailable((prev) => prev.filter((s) => s._id !== slot._id));
    setSelectedBookingSlot(null);

    try {
      const { data } = await api.patch(`/slots/${slot._id}`, {
        studentNotes: bookingNotes,
      });
      setBookings((prev) => [...prev, data]);
      setLastBookedSlot(data);
      setShowSuccessModal(true);
      toast('Slot booked successfully!', 'success');
      // Clear cache on successful booking
      cacheClear(`available-slots-${user._id}`);
      cacheClear(`my-bookings-${user._id}`);
    } catch (err) {
      setAvailable((prev) => [...prev, slot]);
      const message = err?.response?.data?.error || 'Failed to book slot.';
      toast(message, 'error');
    } finally {
      setBusyId(null);
      setBookingSubmitting(false);
      setBookingNotes('');
    }
  }, [user, selectedBookingSlot, bookingNotes, toast]);

  const handleRequestCancel = useCallback(
    async (slot) => {
      if (!user) return;
      setBusyId(slot._id);
      try {
        const { data } = await api.patch(`/slots/${slot._id}`, {
          action: 'request-cancel',
        });
        setBookings((prev) => prev.map((s) => (s._id === slot._id ? data : s)));
        toast('Cancellation request sent to teacher.', 'success');
      } catch (err) {
        const message =
          err?.response?.data?.error || 'Failed to send cancellation request.';
        toast(message, 'error');
      } finally {
        setBusyId(null);
      }
    },
    [user, toast],
  );

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl w-full mx-auto relative">
      {selectedBookingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-base-100 border border-base-300 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <h3 className="font-heading text-2xl mb-2">Add booking notes</h3>
              <p className="text-sm text-muted mb-4">
                Tell your teacher what you want to discuss. These notes will be
                attached to the booking and visible on the meeting page.
              </p>

              <div className="rounded-xl border border-base-300 bg-base-200/70 p-4 mb-4">
                <p className="font-semibold">{selectedBookingSlot.title}</p>
                <p className="text-sm text-muted">
                  {selectedBookingSlot.date} · {selectedBookingSlot.startTime} -{' '}
                  {selectedBookingSlot.endTime}
                </p>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Your notes</span>
                </label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Example: need help with chapter 5, mock exam prep, admission questions"
                  className="textarea textarea-bordered bg-base-300 border-base-300 focus:border-primary min-h-28"
                  data-testid="booking-notes"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-5 justify-end">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="btn btn-ghost"
                  disabled={bookingSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBook}
                  className="btn btn-primary gap-2"
                  disabled={bookingSubmitting}
                >
                  {bookingSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Booking...
                    </>
                  ) : (
                    'Confirm booking'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && lastBookedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-base-100 border border-base-300 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineCheckBadge className="w-10 h-10" />
              </div>
              <h3 className="font-heading text-2xl mb-2">Booking Confirmed!</h3>
              <p className="text-muted text-sm mb-6">
                Your session with{' '}
                <span className="font-semibold text-base-content">
                  {lastBookedSlot.teacherName}
                </span>{' '}
                on {lastBookedSlot.date} has been reserved.
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href={getGoogleCalendarUrl(lastBookedSlot)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full gap-2"
                  onClick={() => setShowSuccessModal(false)}
                >
                  <HiOutlineCalendarDays className="w-5 h-5" />
                  Add to Google Calendar
                </a>
                <a
                  href={
                    lastBookedSlot.meetLink ||
                    lastBookedSlot.calendarHtmlLink ||
                    `/meet/${lastBookedSlot._id}`
                  }
                  target={
                    lastBookedSlot.meetLink || lastBookedSlot.calendarHtmlLink
                      ? '_blank'
                      : undefined
                  }
                  rel={
                    lastBookedSlot.meetLink || lastBookedSlot.calendarHtmlLink
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className="btn btn-ghost w-full gap-2"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Join meeting
                </a>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="btn btn-ghost w-full"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 flex items-center gap-3">
        <HiOutlineSquares2X2 className="w-7 h-7 text-primary" />
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl">
            Hi, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-muted text-sm">
            Browse open slots and manage your bookings.
          </p>
        </div>
      </div>

      {section === 'overview' && (
        <StudentOverviewCard available={available} bookings={bookings} />
      )}

      {section === 'profile' && (
        <div className="mb-8">
          <ProfileSection />
        </div>
      )}

      {showAvailable && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl flex items-center gap-2">
              <HiOutlineCheckBadge className="w-5 h-5 text-success" />
              Available slots
            </h2>
            <span className="badge badge-outline">{available.length} open</span>
          </div>
          {hasActiveBooking && (
            <div className="alert alert-warning mb-4 text-sm">
              You already have a booked slot. Send a cancel request and wait for
              teacher approval before booking a new slot.
            </div>
          )}
          {loading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : available.length === 0 ? (
            <div className="card bg-base-200 border border-dashed border-base-300">
              <div className="card-body items-center text-center py-12">
                <HiOutlineCalendarDays className="w-12 h-12 text-muted" />
                <p className="font-heading text-lg">No open slots</p>
                <p className="text-sm text-muted">
                  Check back soon - teachers add new slots throughout the week.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {available.map((slot, idx) => (
                <SlotCard
                  key={slot._id}
                  slot={slot}
                  index={idx}
                  actionLabel="Book slot"
                  onAction={() => openBookingModal(slot)}
                  busy={busyId === slot._id}
                  actionDisabled={hasActiveBooking}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {showBookings && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl flex items-center gap-2">
              <HiOutlineBookmarkSquare className="w-5 h-5 text-primary" />
              My bookings
            </h2>
            <span className="badge badge-outline">
              {bookings.length} booked
            </span>
          </div>
          {bookings.length === 0 ? (
            <div className="card bg-base-200 border border-dashed border-base-300">
              <div className="card-body items-center text-center py-12">
                <HiOutlineBookmarkSquare className="w-12 h-12 text-muted" />
                <p className="font-heading text-lg">No bookings yet</p>
                <p className="text-sm text-muted">
                  Book any open slot above to see it appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {bookings.map((slot, idx) => (
                <SlotCard
                  key={slot._id}
                  slot={slot}
                  index={idx}
                  actionLabel={
                    slot.cancellationRequested
                      ? 'Request sent'
                      : 'Request cancel'
                  }
                  onAction={() => handleRequestCancel(slot)}
                  busy={busyId === slot._id}
                  actionDisabled={slot.cancellationRequested}
                  disableActionWhenBooked={false}
                  actionClassName="btn btn-warning btn-sm"
                />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export function StudentDashboardPage({ section = 'overview' }) {
  return (
    <ProtectedRoute role="student">
      <StudentDashboardInner section={section} />
    </ProtectedRoute>
  );
}
