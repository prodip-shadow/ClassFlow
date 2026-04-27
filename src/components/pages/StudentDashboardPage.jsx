'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  HiOutlineSparkles,
  HiOutlineCalendarDays,
  HiOutlineBookmarkSquare,
  HiOutlineCheckBadge,
  HiOutlineSquares2X2,
  HiOutlineXMark,
} from 'react-icons/hi2';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ProfileSection } from '@/components/ProfileSection';
import { SlotCard } from '@/components/SlotCard';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { api } from '@/lib/api';
import { getGoogleCalendarUrl } from '@/lib/calendar';


function StudentOverviewCard() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current.querySelectorAll('[data-overview-item]'),
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.08,
        ease: 'power2.out',
      },
    );
  }, []);

  return (
    <div
      ref={ref}
      className="card bg-gradient-to-br from-base-200 to-base-100 border border-base-300 mb-8 overflow-hidden"
    >
      <div className="card-body p-6 sm:p-8">
        <div data-overview-item className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
            <HiOutlineSparkles className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-heading text-2xl">Student overview</h2>
            <p className="text-muted text-sm">
              Smart class booking experience in a single dashboard.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-5">
          <div
            data-overview-item
            className="rounded-lg border border-base-300 bg-base-200/80 p-4"
          >
            <HiOutlineCheckBadge className="w-5 h-5 text-success" />
            <p className="font-heading mt-2">Find Open Slots</p>
            <p className="text-xs text-muted mt-1">
              Explore currently available teacher slots instantly.
            </p>
          </div>
          <div
            data-overview-item
            className="rounded-lg border border-base-300 bg-base-200/80 p-4"
          >
            <HiOutlineBookmarkSquare className="w-5 h-5 text-primary" />
            <p className="font-heading mt-2">Book in One Click</p>
            <p className="text-xs text-muted mt-1">
              Reserve a slot quickly and keep track from bookings.
            </p>
          </div>
          <div
            data-overview-item
            className="rounded-lg border border-base-300 bg-base-200/80 p-4"
          >
            <HiOutlineCalendarDays className="w-5 h-5 text-warning" />
            <p className="font-heading mt-2">Stay Organized</p>
            <p className="text-xs text-muted mt-1">
              Manage upcoming class times with clarity and focus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentDashboardInner({ section }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [available, setAvailable] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastBookedSlot, setLastBookedSlot] = useState(null);
  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [availResp, mineResp] = await Promise.all([
        api.get('/slots', { params: { status: 'available' } }),
        api.get('/slots', { params: { bookedBy: 'me' } }),
      ]);
      setAvailable(availResp.data);
      setBookings(mineResp.data);
    } catch {
      toast('Failed to load slots.', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    reload();
  }, [reload, user]);

  const handleBook = async (slot) => {
    if (!user) return;
    setBusyId(slot._id);
    setAvailable((prev) => prev.filter((s) => s._id !== slot._id));
    try {
      const { data } = await api.patch(`/slots/${slot._id}`);
      setBookings((prev) => [...prev, data]);
      setLastBookedSlot(data);
      setShowSuccessModal(true);
      toast('Slot booked successfully!', 'success');
      
      // Optional: automatically open calendar in new tab
      // window.open(getGoogleCalendarUrl(data), '_blank');
    } catch (err) {
      setAvailable((prev) => [...prev, slot]);
      const message = err?.response?.data?.error || 'Failed to book slot.';
      toast(message, 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleRequestCancel = async (slot) => {
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
  };

  const showAvailable = section === 'available';
  const showBookings = section === 'bookings';
  const hasActiveBooking = bookings.length > 0;

  return (
    <main className="flex-1 px-4 sm:px-8 py-8 max-w-6xl w-full mx-auto relative">
      {showSuccessModal && lastBookedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-base-100 border border-base-300 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineCheckBadge className="w-10 h-10" />
              </div>
              <h3 className="font-heading text-2xl mb-2">Booking Confirmed!</h3>
              <p className="text-muted text-sm mb-6">
                Your session with <span className="font-semibold text-base-content">{lastBookedSlot.teacherName}</span> on {lastBookedSlot.date} has been reserved.
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

      {section === 'overview' && <StudentOverviewCard />}

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
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {available.map((slot, idx) => (
                <SlotCard
                  key={slot._id}
                  slot={slot}
                  index={idx}
                  actionLabel="Book slot"
                  onAction={() => handleBook(slot)}
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
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
