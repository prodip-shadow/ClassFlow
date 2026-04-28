import mongoose, { Schema } from 'mongoose';

const SlotSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    prepNotes: { type: String, default: '', trim: true },
    meetLink: { type: String, default: '' },
    calendarEventId: { type: String, default: '' },
    calendarHtmlLink: { type: String, default: '' },
    calendarId: { type: String, default: '' },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
      type: String,
      enum: ['available', 'booked'],
      default: 'available',
    },
    teacherId: { type: String, required: true, index: true },
    teacherName: { type: String, required: true },
    teacherEmail: { type: String, required: true },
    bookedBy: { type: String, default: null, index: true },
    bookedByName: { type: String, default: null },
    bookedByEmail: { type: String, default: null },
    studentNotes: { type: String, default: '', trim: true },
    cancellationRequested: { type: Boolean, default: false },
    cancellationRequestedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Slot = mongoose.models.Slot || mongoose.model('Slot', SlotSchema);
