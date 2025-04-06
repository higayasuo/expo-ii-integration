/**
 * Compares two ArrayBuffers for equality.
 *
 * @param a - First ArrayBuffer to compare
 * @param b - Second ArrayBuffer to compare
 * @returns True if the ArrayBuffers have the same content, false otherwise
 */
export function arrayBufferEquals(a: ArrayBuffer, b: ArrayBuffer): boolean {
  if (a.byteLength !== b.byteLength) return false;
  const aArray = new Uint8Array(a);
  const bArray = new Uint8Array(b);
  return aArray.every((value, index) => value === bArray[index]);
}
