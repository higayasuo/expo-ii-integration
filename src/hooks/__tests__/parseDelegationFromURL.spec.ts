import { describe, it, expect } from 'vitest';
import { parseDelegationFromURL } from '../parseDelegationFromURL';

describe('parseDelegationFromURL', () => {
  it('should return delegation when delegation is present', () => {
    const url = 'https://example.com/ii-integration#delegation=test-delegation';
    const result = parseDelegationFromURL(url);
    expect(result).toBe('test-delegation');
  });

  it('should return undefined when delegation is not present', () => {
    const url = 'https://example.com/ii-integration#other=value';
    const result = parseDelegationFromURL(url);
    expect(result).toBeUndefined();
  });

  it('should return undefined when hash is not present', () => {
    const url = 'https://example.com/ii-integration';
    const result = parseDelegationFromURL(url);
    expect(result).toBeUndefined();
  });
});
