/**
 * Date formatting helpers
 */

// Formats YYYY-MM-DD to DD MMM YYYY (e.g. 2026-08-20 -> 20 Aug 2026)
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

// Returns current date in YYYY-MM-DD string format
export const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Converts Year-Month string (2026-08) to month name (Aug 2026)
export const formatMonthYear = (monthYearStr) => {
  if (!monthYearStr) return '';
  const parts = monthYearStr.split('-');
  if (parts.length !== 2) return monthYearStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  if (isNaN(year) || isNaN(month)) return monthYearStr;
  const date = new Date(year, month, 1);
  if (isNaN(date.getTime())) return monthYearStr;
  return new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric' }).format(date);
};
