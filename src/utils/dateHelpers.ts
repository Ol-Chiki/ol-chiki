
// utils/dateHelpers.ts

/**
 * Formats a Date object or date string into "YYYY-MM-DD" format.
 * @param date The date to format.
 * @returns The formatted date string or an empty string if invalid.
 */
export const formatDateToYYYYMMDD = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return ''; // Invalid date
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return '';
  }
};

/**
 * Formats a date string (YYYY-MM-DD) or Date object for display (e.g., "Month Day, Year").
 * @param dateInput The date string or Date object.
 * @returns Formatted display string or an empty string.
 */
export const formatDisplayDate = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) return '';
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput + 'T00:00:00') : dateInput; // Ensure correct parsing from YYYY-MM-DD
     if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error("Error formatting display date:", error);
    return '';
  }
};
