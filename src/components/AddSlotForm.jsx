'use client';

import { useMemo, useState } from 'react';
import { HiOutlinePlusCircle } from 'react-icons/hi2';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addMinutes(time, minutes) {
  const [hStr, mStr] = time.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const total = h * 60 + m + minutes;
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const nh = Math.floor(wrapped / 60);
  const nm = wrapped % 60;
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
}

export function AddSlotForm({ onCreated }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepNotes, setPrepNotes] = useState('');
  const [date, setDate] = useState(todayISO());
  const [startTime, setStartTime] = useState('09:00');
  const [submitting, setSubmitting] = useState(false);

  const endTime = useMemo(() => addMinutes(startTime, 15), [startTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const startMs = new Date(`${date}T${startTime}:00`).getTime();
    if (Number.isNaN(startMs)) {
      toast('Please choose a valid date and time.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/slots', {
        title,
        description,
        prepNotes,
        date,
        startTime,
        endTime,
      });
      toast('Slot added successfully.', 'success');
      onCreated(data);
    } catch (err) {
      const message = err?.response?.data?.error || 'Failed to add slot.';
      toast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card bg-base-200 border border-base-300 shadow-sm"
      data-testid="add-slot-form"
    >
      <div className="card-body p-6">
        <h3 className="card-title font-heading">
          <HiOutlinePlusCircle className="w-5 h-5 text-primary" />
          Add a new slot
        </h3>
        <p className="text-sm text-muted -mt-1">
          Slots are 15 minutes long. End time is calculated automatically.
        </p>
        <div className="grid grid-cols-1 gap-4 mt-2">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Physics revision, Admission prep"
              className="input input-bordered bg-base-300 border-base-300 focus:border-primary"
              data-testid="input-title"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short details about what this slot is for"
              className="textarea textarea-bordered bg-base-300 border-base-300 focus:border-primary min-h-24"
              data-testid="input-description"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Preparation notes</span>
            </label>
            <textarea
              value={prepNotes}
              onChange={(e) => setPrepNotes(e.target.value)}
              placeholder="Notebook, pen, textbook, topic list, etc."
              className="textarea textarea-bordered bg-base-300 border-base-300 focus:border-primary min-h-24"
              data-testid="input-prep-notes"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Date</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input input-bordered bg-base-300 border-base-300 focus:border-primary"
              data-testid="input-date"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Start time</span>
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="input input-bordered bg-base-300 border-base-300 focus:border-primary"
              data-testid="input-start"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">End time</span>
            </label>
            <input
              type="time"
              value={endTime}
              readOnly
              className="input input-bordered bg-base-300 border-base-300 opacity-80 cursor-not-allowed"
              data-testid="input-end"
            />
          </div>
        </div>
        <div className="card-actions justify-end mt-4">
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            data-testid="submit-slot"
          >
            {submitting ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Adding...
              </>
            ) : (
              <>
                <HiOutlinePlusCircle className="w-5 h-5" />
                Add slot
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
