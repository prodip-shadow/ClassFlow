'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import {
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlineCalendarDays,
  HiOutlineCheckBadge,
  HiOutlineLockClosed,
  HiOutlineSquares2X2,
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ProfileSection } from '@/components/ProfileSection';
import { AddSlotForm } from '@/components/AddSlotForm';
import { SlotCard } from '@/components/SlotCard';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { api } from '@/lib/api';
import { withCache, cacheClear } from '@/lib/cache';

function StatsRowComponent({ slots }) {
  const stats = useMemo(() => {
    const total = slots.length;
    const booked = slots.filter((s) => s.status === 'booked').length;
    const available = slots.filter((s) => s.status === 'available').length;
    return { total, booked, available };
  }, [slots]);

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      data-testid="teacher-stats"
    >
      <div className="stat bg-base-200 border border-base-300 rounded-lg">
        <div className="stat-figure text-primary">
          <HiOutlineCalendarDays className="w-8 h-8" />
        </div>
        <div className="stat-title text-muted text-sm">Total slots</div>
        <div className="stat-value font-heading">{stats.total}</div>
        <div className="stat-desc text-muted text-xs">All you created</div>
      </div>
      <div className="stat bg-base-200 border border-base-300 rounded-lg">
        <div className="stat-figure text-success">
          <HiOutlineCheckBadge className="w-8 h-8" />
        </div>
        <div className="stat-title text-muted text-sm">Available</div>
        <div className="stat-value font-heading text-success">
          {stats.available}
        </div>
        <div className="stat-desc text-muted text-xs">Open to book</div>
      </div>
      <div className="stat bg-base-200 border border-base-300 rounded-lg">
        <div className="stat-figure text-error">
          <HiOutlineLockClosed className="w-8 h-8" />
        </div>
        <div className="stat-title text-muted text-sm">Booked</div>
        <div className="stat-value font-heading text-error">{stats.booked}</div>
        <div className="stat-desc text-muted text-xs">Already taken</div>
      </div>
    </div>
  );
}

const StatsRow = memo(StatsRowComponent);

function TeacherOverviewCardComponent({ slots = [] }) {
  return (
    <div className="card bg-base-200 border border-base-300 mb-8 shadow">
      <div className="card-body p-6 sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <HiOutlineSparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-heading text-2xl">Teacher overview</h2>
              <p className="text-muted text-sm">
                Publish, manage, and monitor class availability with clarity.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/teacher/dashboard/add"
              className="btn btn-primary gap-2"
            >
              <HiOutlinePlusCircle className="w-5 h-5" />
              Add slot
            </Link>
            <Link
              href="/teacher/dashboard/slots"
              className="btn btn-ghost border border-base-300 gap-2"
            >
              Manage slots
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-5">
          <Link
            href="/teacher/dashboard/add"
            className="group rounded-lg border border-base-300 bg-base-200/80 p-4 text-left hover:border-primary/40 hover:bg-base-200 transition"
          >
            <HiOutlineCalendarDays className="w-5 h-5 text-primary" />
            <p className="font-heading mt-2 flex items-center gap-2">
              Add 15-min Slots
              <HiOutlineArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
            </p>
            <p className="text-xs text-muted mt-1">
              Create short sessions quickly with time conflict protection.
            </p>
          </Link>
          <Link
            href="/teacher/dashboard/slots"
            className="group rounded-lg border border-base-300 bg-base-200/80 p-4 text-left hover:border-success/40 hover:bg-base-200 transition"
          >
            <HiOutlineCheckBadge className="w-5 h-5 text-success" />
            <p className="font-heading mt-2 flex items-center gap-2">
              Track Availability
              <HiOutlineArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
            </p>
            <p className="text-xs text-muted mt-1">
              Keep your open slots organized and visible for students.
            </p>
          </Link>
          <Link
            href="/teacher/dashboard/slots"
            className="group rounded-lg border border-base-300 bg-base-200/80 p-4 text-left hover:border-error/40 hover:bg-base-200 transition"
          >
            <HiOutlineLockClosed className="w-5 h-5 text-error" />
            <p className="font-heading mt-2 flex items-center gap-2">
              Review Booked Slots
              <HiOutlineArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
            </p>
            <p className="text-xs text-muted mt-1">
              Check reserved sessions and maintain a smooth schedule.
            </p>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-base-300/50">
          <StatsRow slots={slots} />
        </div>
      </div>
    </div>
  );
}

const TeacherOverviewCard = memo(TeacherOverviewCardComponent);

function TeacherDashboardInner({ section }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null,
    slotId: null,
    isLoading: false,
  });

  const needsData =
    section === 'slots' || section === 'add' || section === 'overview';

  // Lazy load data only when needed
  useEffect(() => {
    if (!user || !needsData || dataLoaded) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await withCache(`teacher-slots-${user._id}`, () =>
          api.get('/slots').then((r) => r.data),
        );
        setSlots(data);
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
  const handleCreated = useCallback(
    (slot) => {
      setSlots((prev) => [...prev, slot]);
      cacheClear(`teacher-slots-${user._id}`);
    },
    [user._id],
  );

  const handleDelete = useCallback(
    (id) => {
      if (!user || bulkDeleting) return;
      setConfirmDialog({
        isOpen: true,
        type: 'delete',
        slotId: id,
        isLoading: false,
      });
    },
    [user, bulkDeleting],
  );

  const confirmDelete = useCallback(async () => {
    const { slotId } = confirmDialog;
    if (!slotId) return;

    setConfirmDialog((prev) => ({ ...prev, isLoading: true }));
    setBusyId(slotId);

    try {
      await api.delete(`/slots/${slotId}`);
      setSlots((prev) => prev.filter((s) => s._id !== slotId));
      toast('Meeting deleted.', 'success');
      cacheClear(`teacher-slots-${user._id}`);
      setConfirmDialog({
        isOpen: false,
        type: null,
        slotId: null,
        isLoading: false,
      });
    } catch (err) {
      const message = err?.response?.data?.error || 'Failed to delete slot.';
      toast(message, 'error');
      setConfirmDialog((prev) => ({ ...prev, isLoading: false }));
    } finally {
      setBusyId(null);
    }
  }, [confirmDialog, toast, user._id]);

  const handleApproveCancel = useCallback(
    async (id) => {
      if (bulkDeleting) return;
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
    },
    [bulkDeleting, toast],
  );

  const handleDeleteAll = useCallback(() => {
    if (!user || bulkDeleting || slots.length === 0) return;
    setConfirmDialog({
      isOpen: true,
      type: 'deleteAll',
      slotId: null,
      isLoading: false,
    });
  }, [user, bulkDeleting, slots.length]);

  const confirmDeleteAll = useCallback(async () => {
    setConfirmDialog((prev) => ({ ...prev, isLoading: true }));
    setBulkDeleting(true);

    try {
      const { data } = await api.delete('/slots', {
        params: { scope: 'all' },
      });
      setSlots([]);
      cacheClear(`teacher-slots-${user._id}`);
      const failed = Number(data?.failedCalendarDeletes || 0);
      if (failed > 0) {
        toast(
          `Deleted ${data?.deletedCount || 0} slots. ${failed} calendar cleanup(s) failed.`,
          'error',
        );
      } else {
        toast('All meetings deleted.', 'success');
      }
      setConfirmDialog({
        isOpen: false,
        type: null,
        slotId: null,
        isLoading: false,
      });
    } catch (err) {
      const message =
        err?.response?.data?.error || 'Failed to delete all meetings.';
      toast(message, 'error');
      setConfirmDialog((prev) => ({ ...prev, isLoading: false }));
    } finally {
      setBulkDeleting(false);
    }
  }, [user._id, toast]);

  return (
    <>
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl w-full mx-auto">
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

        {section === 'overview' && <TeacherOverviewCard slots={slots} />}

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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h2 className="font-heading text-xl">Your slots</h2>
                <p className="text-sm text-muted mt-1">
                  If a student requests cancellation, approve it to free the
                  slot so the student can book a new one.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="badge badge-outline">
                  {slots.length} total
                </span>
                <button
                  type="button"
                  onClick={handleDeleteAll}
                  disabled={loading || bulkDeleting || slots.length === 0}
                  className="btn btn-error btn-sm gap-2"
                >
                  {bulkDeleting ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <HiOutlineTrash className="w-4 h-4" />
                  )}
                  Delete all meetings
                </button>
              </div>
            </div>
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
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
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

      {/* Confirm Dialog for Dangerous Actions */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={
          confirmDialog.type === 'delete'
            ? 'Delete this meeting?'
            : 'Delete all meetings?'
        }
        message={
          confirmDialog.type === 'delete'
            ? 'This will remove it from the app and delete the linked calendar event. This action cannot be undone.'
            : 'This will remove every slot from your dashboard and delete all linked calendar events. This action cannot be undone.'
        }
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        isLoading={confirmDialog.isLoading}
        icon={HiOutlineExclamationTriangle}
        onConfirm={
          confirmDialog.type === 'delete' ? confirmDelete : confirmDeleteAll
        }
        onCancel={() =>
          setConfirmDialog({
            isOpen: false,
            type: null,
            slotId: null,
            isLoading: false,
          })
        }
      />
    </>
  );
}

export function TeacherDashboardPage({ section = 'overview' }) {
  return (
    <ProtectedRoute role="teacher">
      <TeacherDashboardInner section={section} />
    </ProtectedRoute>
  );
}
