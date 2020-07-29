/**
 * Convert discrete hour (1-24) into human-readable time string
 * @param hour discrete hour
 * @returns human-readable time string (e.g. 08:00 AM)
 */
export function hoursToTimeString(hour: number) {
  hour -= 1;
  let label: string = 'AM';
  if (hour >= 12) {
    if (hour > 12) {
      hour -= 12;
    }
    label = 'PM';
  } else if (hour === 0) {
    hour = 12;
  }
  return hour.toString().padStart(2, '0') + ':00 ' + label;
}

/**
 * Generate array of discrete hours
 * @returns array of discrete hours, from 1-24
 */
export function createHoursArr(): number[] {
  return new Array(24).fill(0).map((_, index) => {
    return index + 1;
  });
}

/**
 * Ensures the discrete week is clamped between 1 and 52
 * @param week discrete week
 * @returns clamped discrete week
 */
export function getClampedWeek(week: number): number {
  return ((((week - 1) % 52) + 52) % 52) + 1;
}
