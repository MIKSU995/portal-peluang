export interface OpportunityCalendarItem {
  title: string;
  description: string;
  location?: string | null;
  deadline: Date | string;
  link: string;
}

/**
 * Format objek Date menjadi string ISO standar tanpa separator (YYYYMMDDTHHMMSSZ)
 */
const formatDateToICS = (dateInput: Date | string): string => {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return new Date().toISOString().replace(/-|:|\.\d\d\d/g, '');
  }
  return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
};

/**
 * Membentuk URL interaktif Google Calendar untuk pengingat deadline
 */
export const getGoogleCalendarUrl = (item: OpportunityCalendarItem): string => {
  const endDate = new Date(item.deadline);
  // Default waktu pengingat kalender: 2 jam sebelum waktu deadline resmi
  const startDate = new Date(endDate.getTime() - 2 * 60 * 60 * 1000);

  const title = encodeURIComponent(`[Deadline KesempatanKita] ${item.title}`);
  const details = encodeURIComponent(
    `${item.description.trim()}\n\n🔗 Link Pendaftaran Resmi: ${item.link}`
  );
  const location = encodeURIComponent(item.location || 'Online');
  const dates = `${formatDateToICS(startDate)}/${formatDateToICS(endDate)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
};

/**
 * Mengunduh file berkas .ics (iCalendar standard) untuk diimpor ke Apple Calendar,
 * Outlook, atau aplikasi kalender lokal di HP / PC.
 */
export const downloadIcsFile = (item: OpportunityCalendarItem): void => {
  const endDate = new Date(item.deadline);
  const startDate = new Date(endDate.getTime() - 2 * 60 * 60 * 1000);

  // Sanitasi karakter khusus untuk format iCalendar (RFC 5545)
  const cleanDescription = item.description
    .replace(/\r?\n|\r/g, ' ')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');

  const cleanTitle = item.title.replace(/;/g, '\\;').replace(/,/g, '\\,');
  const cleanLocation = (item.location || 'Online').replace(/;/g, '\\;').replace(/,/g, '\\,');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KesempatanKita//Student Portal//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:kesempatankita-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@kesempatankita.com`,
    `DTSTAMP:${formatDateToICS(new Date())}`,
    `DTSTART:${formatDateToICS(startDate)}`,
    `DTEND:${formatDateToICS(endDate)}`,
    `SUMMARY:[Deadline] ${cleanTitle}`,
    `DESCRIPTION:${cleanDescription}\\n\\nLink: ${item.link}`,
    `LOCATION:${cleanLocation}`,
    `URL:${item.link}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  const safeFilename = item.title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);

  link.setAttribute('download', `deadline-${safeFilename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};