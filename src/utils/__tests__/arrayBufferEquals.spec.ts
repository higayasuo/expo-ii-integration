import { describe, it, expect } from 'vitest';
import { arrayBufferEquals } from '../arrayBufferEquals';

describe('arrayBufferEquals', () => {
  it('should return true for identical ArrayBuffers', () => {
    // Create two identical ArrayBuffers
    const buffer1 = new Uint8Array([1, 2, 3, 4, 5]).buffer;
    const buffer2 = new Uint8Array([1, 2, 3, 4, 5]).buffer;

    // Test that they are considered equal
    expect(arrayBufferEquals(buffer1, buffer2)).toBe(true);
  });

  it('should return false for ArrayBuffers with different lengths', () => {
    // Create ArrayBuffers with different lengths
    const buffer1 = new Uint8Array([1, 2, 3]).buffer;
    const buffer2 = new Uint8Array([1, 2, 3, 4]).buffer;

    // Test that they are not considered equal
    expect(arrayBufferEquals(buffer1, buffer2)).toBe(false);
  });

  it('should return false for ArrayBuffers with same length but different content', () => {
    // Create ArrayBuffers with the same length but different content
    const buffer1 = new Uint8Array([1, 2, 3, 4, 5]).buffer;
    const buffer2 = new Uint8Array([1, 2, 3, 4, 6]).buffer;

    // Test that they are not considered equal
    expect(arrayBufferEquals(buffer1, buffer2)).toBe(false);
  });

  it('should return true for empty ArrayBuffers', () => {
    // Create two empty ArrayBuffers
    const buffer1 = new Uint8Array([]).buffer;
    const buffer2 = new Uint8Array([]).buffer;

    // Test that they are considered equal
    expect(arrayBufferEquals(buffer1, buffer2)).toBe(true);
  });

  it('should return true for the same ArrayBuffer instance', () => {
    // Create a single ArrayBuffer
    const buffer = new Uint8Array([1, 2, 3, 4, 5]).buffer;

    // Test that it equals itself
    expect(arrayBufferEquals(buffer, buffer)).toBe(true);
  });
});
