function getMeetingUrl(slot) {
  if (slot?.meetLink) {
    return slot.meetLink;
  }

  if (slot?.calendarHtmlLink) {
    return slot.calendarHtmlLink;
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/meet/${slot?._id || ''}`;
  }

  return `/meet/${slot?._id || ''}`;
}

export function getGoogleCalendarUrl(slot) {
  const {
    _id,
    date,
    startTime,
    endTime,
    teacherName,
    title,
    description,
    prepNotes,
    studentNotes,
  } = slot;

  const formatDate = (d, t) => {
    const [year, month, day] = d.split('-');
    const [hour, minute] = t.split(':');
    return `${year}${month}${day}T${hour}${minute}00`;
  };

  const start = formatDate(date, startTime);
  const end = formatDate(date, endTime);

  const meetingUrl = getMeetingUrl(slot);
  const detailsParts = [
    title ? `Topic: ${title}` : null,
    description ? `Description: ${description}` : null,
    prepNotes ? `Teacher notes: ${prepNotes}` : null,
    studentNotes ? `Student notes: ${studentNotes}` : null,
    meetingUrl ? `Join: ${meetingUrl}` : null,
    teacherName ? `Teacher: ${teacherName}` : null,
  ].filter(Boolean);

  const details = detailsParts.join('\n');
  const location = meetingUrl || 'ClassFlow Platform';
  const text = `ClassFlow: ${title || teacherName || 'Meeting'}`;

  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.append('action', 'TEMPLATE');
  url.searchParams.append('text', text);
  url.searchParams.append('dates', `${start}/${end}`);
  url.searchParams.append('details', details);
  url.searchParams.append('location', location);

  return url.toString();
}
