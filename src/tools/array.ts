/**
 * Returns the last entry of an array or undefined, if array has no entries
 * @param array The array
 * @returns The last element of array
 */
export function getLastArrayEntry<T>(array?: Array<T>): T | undefined {
  if (array) {
    if (array.length > 0) {
      return array[array.length - 1];
    } else {
      return undefined;
    }
  }
}
