import i18n from "@/i18n";

const getLocale = () => {
  const locale = i18n.global.locale.value;
  return locale === "kh" ? "km-KH" : "en-GB";
};

/**
 * Formats a date string or Date object into a readable date-time string.
 * Example: 03/04/2026 16:15
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "-";
  try {
    return new Intl.DateTimeFormat(getLocale(), {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(date));
  } catch (e) {
    return "-";
  }
}

/**
 * Formats a date string or Date object into a readable date string (no time).
 * Example: 03/04/2026
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  try {
    return new Intl.DateTimeFormat(getLocale(), {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  } catch (e) {
    return "-";
  }
}

/**
 * Formats a date into a localized long format.
 * Example: Friday, April 3, 2026, 4:15:20 PM
 */
export function formatFullDateTime(
  date: string | Date | null | undefined,
): string {
  if (!date) return "-";
  try {
    return new Intl.DateTimeFormat(getLocale(), {
      dateStyle: "full",
      timeStyle: "medium",
    }).format(new Date(date));
  } catch (e) {
    return "-";
  }
}

/**
 * Converts a Date object to a local ISO string (YYYY-MM-DDTHH:mm) suitable for input[type="datetime-local"].
 */
export function toLocalISOString(date: Date): string {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
}
