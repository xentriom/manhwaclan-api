/**
 * Converts absolute date strings to Date objects
 */
function parseAbsoluteTime(absoluteTime: string): Date {
  // Handle ISO format: "2025-08-17 10:50:09"
  if (absoluteTime.match(/^\d{4}-\d{2}-\d{2}/)) {
    return new Date(absoluteTime);
  }

  // Handle other common formats
  const parsed = new Date(absoluteTime);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  // If parsing fails, return current date
  return new Date();
}

/**
 * Formats a Date object to "Month Day, Year" format
 */
function formatDate(date: Date): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

/**
 * Normalizes date strings to "Month Day, Year" format
 * Handles both relative ("1 day ago") and absolute ("2025-08-17 10:50:09") formats
 */
export function normalizeDate(dateString: string): string {
  if (!dateString || dateString.trim() === "") {
    return "";
  }

  const trimmed = dateString.trim();

  // Check if it's already a relative time
  if (
    trimmed.includes("ago") ||
    trimmed.includes("now") ||
    trimmed.match(/\d+\s+(second|minute|hour|day|week|month|year)/)
  ) {
    return trimmed; // Return as-is if already relative
  } else {
    // Convert absolute date to "Month Day, Year" format
    return formatToAbsoluteDate(trimmed);
  }
}

/**
 * Converts absolute date strings to "Month Day, Year" format
 * Examples: "2025-08-17 10:50:09" -> "August 17, 2025"
 */
export function formatToAbsoluteDate(dateString: string): string {
  if (!dateString || dateString.trim() === "") {
    return "";
  }

  const trimmed = dateString.trim();

  // Check if it's already in a readable format
  if (trimmed.match(/^[A-Za-z]+\s+\d+,\s+\d{4}$/)) {
    return trimmed; // Already in "Month Day, Year" format
  }

  // Parse the date and format it
  const date = parseAbsoluteTime(trimmed);
  return formatDate(date);
}
