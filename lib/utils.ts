import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  
  // Add random suffix to ensure uniqueness
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  
  return `${base}-${randomSuffix}`;
}

/**
 * Format a date for display
 * @param date - Date string or Date object
 * @param locale - Locale code (default: "en")
 */
export function formatDate(date: string | Date, locale: string = "en"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const localeCode = locale === "he" ? "he-IL" : "en-US";
  return d.toLocaleDateString(localeCode, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format time for display
 */
export function formatTime(time: string): string {
  // Simple time formatter - expects "HH:MM" format
  return time;
}

