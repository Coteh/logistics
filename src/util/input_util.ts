/**
 * Helper method to parse stringified number input with fallback to 0 instead of NaN
 * @param input string to parse into number
 * @returns parsed number
 */
export function getNumberInputFromString(input: string): number {
  return parseInt(input) || 0;
}
