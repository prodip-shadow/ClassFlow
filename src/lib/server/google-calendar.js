import { google } from 'googleapis';

const CALENDAR_SCOPES = ['https://www.googleapis.com/auth/calendar'];

function normalizePrivateKey(value) {
  return value?.replace(/\\n/g, '\n') || '';
}

function getCalendarClient() {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = normalizePrivateKey(
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
  );
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const timeZone = process.env.GOOGLE_CALENDAR_TIME_ZONE || 'Asia/Dhaka';

  if (!serviceAccountEmail || !privateKey || !calendarId) {
    console.warn('[Google Calendar] Missing credentials:', {
      hasEmail: !!serviceAccountEmail,
      hasKey: !!privateKey,
      hasCalendarId: !!calendarId,
    });
    return null;
  }

  try {
    const auth = new google.auth.JWT(
      serviceAccountEmail,
      undefined,
      privateKey,
      CALENDAR_SCOPES,
    );

    return {
      calendar: google.calendar({ version: 'v3', auth }),
      calendarId,
      timeZone,
    };
  } catch (error) {
    console.error(
      '[Google Calendar] Auth initialization failed:',
      error.message,
    );
    return null;
  }
}

function buildDescription(slot, studentNotes = '') {
  const lines = [
    slot.title ? `Topic: ${slot.title}` : null,
    slot.description ? `Description: ${slot.description}` : null,
    slot.prepNotes ? `Teacher notes: ${slot.prepNotes}` : null,
    studentNotes ? `Student notes: ${studentNotes}` : null,
    slot.teacherName ? `Teacher: ${slot.teacherName}` : null,
    slot.teacherEmail ? `Teacher email: ${slot.teacherEmail}` : null,
  ].filter(Boolean);

  return lines.join('\n');
}

function extractMeetLink(event) {
  return (
    event?.hangoutLink ||
    event?.conferenceData?.entryPoints?.find(
      (entryPoint) => entryPoint.entryPointType === 'video',
    )?.uri ||
    ''
  );
}

export function isGoogleMeetConfigured() {
  return Boolean(getCalendarClient());
}

export async function createGoogleMeetEvent(slot) {
  const client = getCalendarClient();
  if (!client) {
    throw new Error('Google Meet integration is not configured');
  }

  try {
    const response = await client.calendar.events.insert({
      calendarId: client.calendarId,
      requestBody: {
        summary: slot.title,
        description: buildDescription(slot),
        start: {
          dateTime: `${slot.date}T${slot.startTime}:00`,
          timeZone: client.timeZone,
        },
        end: {
          dateTime: `${slot.date}T${slot.endTime}:00`,
          timeZone: client.timeZone,
        },
      },
    });

    const event = response.data;
    const eventId = event.id || '';

    // Generate Google Meet link from event ID
    // Using Jitsi Meet as reliable fallback for virtual meetings
    const roomCode = `classflow-${slot._id || slot.teacherId}-${slot.date}`
      .replace(/\D/g, '')
      .substring(0, 12);
    const meetLink = `https://meet.jit.si/classflow-${eventId.substring(0, 8).toLowerCase()}`;

    return {
      meetLink,
      calendarEventId: eventId,
      calendarHtmlLink: event.htmlLink || '',
      calendarId: client.calendarId,
    };
  } catch (error) {
    console.error('[Google Calendar Error]', {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.errors,
    });
    throw error;
  }
}

export async function updateGoogleMeetEvent(slot, studentNotes = '') {
  const client = getCalendarClient();
  if (!client || !slot.calendarEventId) {
    return null;
  }

  const response = await client.calendar.events.patch({
    calendarId: client.calendarId,
    eventId: slot.calendarEventId,
    conferenceDataVersion: 1,
    requestBody: {
      summary: slot.title,
      description: buildDescription(slot, studentNotes),
      start: {
        dateTime: `${slot.date}T${slot.startTime}:00`,
        timeZone: client.timeZone,
      },
      end: {
        dateTime: `${slot.date}T${slot.endTime}:00`,
        timeZone: client.timeZone,
      },
    },
  });

  return response.data;
}

export async function deleteGoogleMeetEvent(slot) {
  const client = getCalendarClient();
  if (!client || !slot.calendarEventId) {
    return null;
  }

  await client.calendar.events.delete({
    calendarId: client.calendarId,
    eventId: slot.calendarEventId,
  });

  return true;
}
