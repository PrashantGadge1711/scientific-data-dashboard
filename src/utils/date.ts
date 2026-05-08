/**
 * Returns the current year as a number
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Returns the current year as a string
 */
export function getCurrentYearString(): string {
  return String(new Date().getFullYear());
}
