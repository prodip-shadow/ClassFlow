'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  HiOutlineArrowLeft,
  HiOutlineCalendarDays,
  HiOutlineClipboardDocument,
  HiOutlineClock,
  HiOutlineLink,
  HiOutlineSparkles,
  HiOutlineUserCircle,
} from 'react-icons/hi2';
import { api } from '@/lib/api';
import { getGoogleCalendarUrl } from '@/lib/calendar';

function getJoinUrl(slotId) {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/meet/${slotId}`;
  }

  return `/meet/${slotId}`;
}

export default function MeetingRoomPage({ params }) {
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const joinUrl =
    slot?.meetLink || slot?.calendarHtmlLink || getJoinUrl(params.id);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/slots/${params.id}`);
        setSlot(data);
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load meeting.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [params.id]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
    } catch {
      // ignore clipboard errors in unsupported browsers
    }
  };

  return (
    <main className="min-h-screen bg-base-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="btn btn-ghost mb-6 gap-2">
          <HiOutlineArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {loading ? (
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body items-center py-16">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        ) : slot ? (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <section className="card bg-gradient-to-br from-base-200 via-base-200 to-base-100 border border-base-300 shadow-lg shadow-black/10">
              <div className="card-body p-6 sm:p-8">
                <div className="flex items-start gap-3 mb-4">
                  <span className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                    <HiOutlineSparkles className="w-6 h-6" />
                  </span>
                  <div>
                    <p className="text-sm text-muted uppercase tracking-widest">
                      Meeting room
                    </p>
                    <h1 className="font-heading text-3xl mt-1">{slot.title}</h1>
                    <p className="text-muted mt-2">
                      {slot.date} · {slot.startTime} - {slot.endTime}
                    </p>
                  </div>
                </div>

                {slot.description && (
                  <div className="rounded-xl border border-base-300 bg-base-300/40 p-4 mb-4">
                    <p className="text-sm uppercase tracking-wide text-muted mb-1">
                      Description
                    </p>
                    <p className="whitespace-pre-wrap text-base-content/90">
                      {slot.description}
                    </p>
                  </div>
                )}

                <div className="rounded-2xl border border-base-300 bg-base-200 p-5">
                  <p className="text-sm uppercase tracking-wide text-muted mb-3">
                    Meeting link
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      readOnly
                      value={joinUrl}
                      className="input input-bordered bg-base-300 border-base-300 flex-1"
                    />
                    <button
                      type="button"
                      onClick={copyLink}
                      className="btn btn-primary gap-2"
                    >
                      <HiOutlineClipboardDocument className="w-5 h-5" />
                      Copy link
                    </button>
                  </div>
                  <p className="text-xs text-muted mt-3">
                    This is the real Google Meet link when Google Calendar is
                    connected. If not, it falls back to the meeting page URL.
                  </p>
                </div>
              </div>
            </section>

            <aside className="space-y-4">
              <div className="card bg-base-200 border border-base-300">
                <div className="card-body p-5">
                  <h2 className="font-heading text-xl mb-3">Meeting details</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <HiOutlineUserCircle className="w-4 h-4 text-primary" />
                      <span className="text-muted">Teacher:</span>
                      <span className="font-medium">{slot.teacherName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiOutlineClock className="w-4 h-4 text-primary" />
                      <span className="text-muted">Status:</span>
                      <span className="font-medium capitalize">
                        {slot.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mt-5">
                    <a
                      href={slot.meetLink || slot.calendarHtmlLink || joinUrl}
                      target={
                        slot.meetLink || slot.calendarHtmlLink
                          ? '_blank'
                          : undefined
                      }
                      rel={
                        slot.meetLink || slot.calendarHtmlLink
                          ? 'noopener noreferrer'
                          : undefined
                      }
                      className="btn btn-primary gap-2"
                    >
                      <HiOutlineCalendarDays className="w-5 h-5" />
                      Join Google Meet
                    </a>
                    <a
                      href={getGoogleCalendarUrl(slot)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost gap-2"
                    >
                      <HiOutlineLink className="w-5 h-5" />
                      Open calendar draft
                    </a>
                  </div>
                </div>
              </div>

              {slot.prepNotes && (
                <div className="card bg-base-200 border border-base-300">
                  <div className="card-body p-5">
                    <h2 className="font-heading text-xl mb-2">
                      Preparation notes
                    </h2>
                    <p className="text-sm whitespace-pre-wrap text-muted">
                      {slot.prepNotes}
                    </p>
                  </div>
                </div>
              )}

              {slot.studentNotes && (
                <div className="card bg-base-200 border border-base-300">
                  <div className="card-body p-5">
                    <h2 className="font-heading text-xl mb-2">Student notes</h2>
                    <p className="text-sm whitespace-pre-wrap text-muted">
                      {slot.studentNotes}
                    </p>
                  </div>
                </div>
              )}
            </aside>
          </div>
        ) : null}
      </div>
    </main>
  );
}
