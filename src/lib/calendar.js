/**
 * Generates a Google Calendar event creation URL.
 * @param {Object} slot - The slot data
 * @param {string} teacherName - The name of the teacher
 * @returns {string} The Google Calendar URL
 */
export function getGoogleCalendarUrl(slot) {
  const { date, startTime, endTime, teacherName } = slot;
  
  // Format dates: YYYYMMDDTHHmmSSZ or YYYYMMDDTHHmmSS
  // Slot date is YYYY-MM-DD
  // Slot startTime/endTime is HH:mm
  
  const formatDate = (d, t) => {
    const [year, month, day] = d.split('-');
    const [hour, minute] = t.split(':');
    return `${year}${month}${day}T${hour}${minute}00`;
  };

  const start = formatDate(date, startTime);
  const end = formatDate(date, endTime);
  
  const details = `Class with ${teacherName}`;
  const location = "ClassFlow Platform";
  const text = `ClassFlow: ${teacherName}`;

  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.append('action', 'TEMPLATE');
  url.searchParams.append('text', text);
  url.searchParams.append('dates', `${start}/${end}`);
  url.searchParams.append('details', details);
  url.searchParams.append('location', location);

  return url.toString();
}
