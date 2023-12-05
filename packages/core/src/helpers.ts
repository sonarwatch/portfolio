/**
 * Deep clones a value.
 *
 * @template T - The type of the value being cloned.
 * @param value - The value to be cloned.
 * @returns A deep clone of the value.
 */
export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
