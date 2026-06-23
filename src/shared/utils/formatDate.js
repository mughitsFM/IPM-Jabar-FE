import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Format tanggal ke format Indonesia.
 * @param {string | Date | number} dateValue
 * @param {string} formatStr - format date-fns, default: "d MMMM yyyy"
 */
export function formatDate(dateValue, formatStr = "d MMMM yyyy") {
  if (!dateValue) return "-";
  const date = typeof dateValue === "string" ? parseISO(dateValue) : new Date(dateValue);
  if (!isValid(date)) return "-";
  return format(date, formatStr, { locale: id });
}

/**
 * Format tanggal + jam.
 * Contoh: "12 Juli 2025, 14:30"
 */
export function formatDateTime(dateValue) {
  return formatDate(dateValue, "d MMMM yyyy, HH:mm");
}

/**
 * Format relatif ("3 hari yang lalu").
 */
export function formatRelative(dateValue) {
  if (!dateValue) return "-";
  const date = typeof dateValue === "string" ? parseISO(dateValue) : new Date(dateValue);
  if (!isValid(date)) return "-";
  return formatDistanceToNow(date, { addSuffix: true, locale: id });
}

/**
 * Format singkat untuk badge/label kalender.
 * Contoh: "12 Jul 2025"
 */
export function formatShort(dateValue) {
  return formatDate(dateValue, "d MMM yyyy");
}
