'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  HiOutlineSparkles,
  HiOutlineCalendarDays,
  HiOutlineCheckBadge,
  HiOutlineLockClosed,
  HiOutlineSquares2X2,
} from 'react-icons/hi2';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ProfileSection } from '@/components/ProfileSection';
import { AddSlotForm } from '@/components/AddSlotForm';
import { SlotCard } from '@/components/SlotCard';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { api } from '@/lib/api';

function StatsRow({ slots }) {
  const ref = useRef(null);
  const total = slots.length;
  const booked = slots.filter((s) => s.status === 'booked').length;
  const available = total - booked;

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current.querySelectorAll('[data-stat]'),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
    );
  }, [total, booked, available]);

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      data-testid="teacher-stats"
    >
      <div
        data-stat
        className="stat bg-base-200 border border-base-300 rounded-2xl"
      >
        <div className="stat-figure text-primary">
          <HiOutlineCalendarDays className="w-8 h-8" />
        </div>
        <div className="stat-title text-muted">Total slots</div>
        <div className="stat-value font-heading">{total}</div>
        <div className="stat-desc text-muted">
          All slots you&apos;ve created
        </div>
      </div>
      <div
        data-stat
        className="stat bg-base-200 border border-base-300 rounded-2xl"
      >
        <div className="stat-figure text-success">
          <HiOutlineCheckBadge className="w-8 h-8" />
        </div>
        <div className="stat-title text-muted">Available</div>
        <div className="stat-value font-heading text-success">{available}</div>
        <div className="stat-desc text-muted">Open for booking</div>
      </div>
      <div
        data-stat
        className="stat bg-base-200 border border-base-300 rounded-2xl"
      >
        <div className="stat-figure text-error">
          <HiOutlineLockClosed className="w-8 h-8" />
        </div>
        <div className="stat-title text-muted">Booked</div>
        <div className="stat-value font-heading text-error">{booked}</div>
        <div className="stat-desc text-muted">Already taken</div>
      </div>
    </div>
  );
}

function TeacherOverviewCard() {
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
            <h2 className="font-heading text-2xl">Teacher overview</h2>
            <p className="text-muted text-sm">
              Publish, manage, and monitor class availability with clarity.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-5">
          <div
            data-overview-item
            className="rounded-lg border border-base-300 bg-base-200/80 p-4"
          >
            <HiOutlineCalendarDays className="w-5 h-5 text-primary" />
            <p className="font-heading mt-2">Add 15-min Slots</p>
            <p className="text-xs text-muted mt-1">
              Create short sessions quickly with time conflict protection.
            </p>
          </div>
          <div
            data-overview-item
            className="rounded-lg border border-base-300 bg-base-200/80 p-4"
          >
            <HiOutlineCheckBadge className="w-5 h-5 text-success" />
            <p className="font-heading mt-2">Track Availability</p>
            <p className="text-xs text-muted mt-1">
              Keep your open slots organized and visible for students.
            </p>
          </div>
          <div
            data-overview-item
            className="rounded-lg border border-base-300 bg-base-200/80 p-4"
          >
            <HiOutlineLockClosed className="w-5 h-5 text-error" />
            <p className="font-heading mt-2">Review Booked Slots</p>
            <p className="text-xs text-muted mt-1">
              Check reserved sessions and maintain a smooth schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherDashboardInner({ section }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data } = await api.get('/slots');
        setSlots(data);
      } catch {
        toast('Failed to load slots.', 'error');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, toast]);

  const handleCreated = (slot) => {
    setSlots((prev) => [...prev, slot]);
  };

  const handleDelete = async (id) => {
    if (!user) return;
    setBusyId(id);
    try {
      await api.delete(`/slots/${id}`);
      setSlots((prev) => prev.filter((s) => s._id !== id));
      toast('Slot deleted.', 'success');
    } catch (err) {
      const message = err?.response?.data?.error || 'Failed to delete slot.';
      toast(message, 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleApproveCancel = async (id) => {
    setBusyId(id);
    try {
      const { data } = await api.patch(`/slots/${id}`, {
        action: 'approve-cancel',
      });
      setSlots((prev) => prev.map((s) => (s._id === id ? data : s)));
      toast('Cancellation approved. Slot is now available.', 'success');
    } catch (err) {
      const message =
        err?.response?.data?.error || 'Failed to approve cancellation.';
      toast(message, 'error');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="flex-1 px-4 sm:px-8 py-8 max-w-6xl w-full mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <HiOutlineSquares2X2 className="w-7 h-7 text-primary" />
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-muted text-sm">
            Manage your open slots and bookings.
          </p>
        </div>
      </div>

      {section === 'overview' && <TeacherOverviewCard />}

      {section === 'add' && (
        <div className="mb-8">
          <StatsRow slots={slots} />
        </div>
      )}

      {section === 'add' && (
        <div className="mb-8">
          <AddSlotForm onCreated={handleCreated} />
        </div>
      )}

      {section === 'profile' && (
        <div className="mb-8">
          <ProfileSection />
        </div>
      )}

      {section === 'slots' && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl">Your slots</h2>
            <span className="badge badge-outline">{slots.length} total</span>
          </div>
          <p className="text-sm text-muted mb-4">
            If a student requests cancellation, approve it to free the slot so
            the student can book a new one.
          </p>
          {loading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : slots.length === 0 ? (
            <div className="card bg-base-200 border border-dashed border-base-300">
              <div className="card-body items-center text-center py-12">
                <HiOutlineCalendarDays className="w-12 h-12 text-muted" />
                <p className="font-heading text-lg">No slots yet</p>
                <p className="text-sm text-muted">
                  Add your first 15-minute slot using the form above.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {slots.map((slot, idx) => (
                <SlotCard
                  key={slot._id}
                  slot={slot}
                  index={idx}
                  showBookedBy
                  onDelete={() => handleDelete(slot._id)}
                  onAction={
                    slot.cancellationRequested
                      ? () => handleApproveCancel(slot._id)
                      : undefined
                  }
                  actionLabel={
                    slot.cancellationRequested
                      ? 'Approve cancel request'
                      : undefined
                  }
                  disableActionWhenBooked={false}
                  actionClassName="btn btn-success btn-sm"
                  busy={busyId === slot._id}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export function TeacherDashboardPage({ section = 'overview' }) {
  return (
    <ProtectedRoute role="teacher">
      <TeacherDashboardInner section={section} />
    </ProtectedRoute>
  );
}
