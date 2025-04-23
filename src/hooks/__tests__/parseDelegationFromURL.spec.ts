import { describe, it, expect } from 'vitest';
import { parseDelegationFromURL } from '../parseDelegationFromURL';

describe('parseDelegationFromURL', () => {
  it('should return delegation when present in URL hash', () => {
    const url = 'https://example.com#delegation=test_delegation';
    const result = parseDelegationFromURL(url);
    expect(result).toBe('test_delegation');
  });

  it('should return undefined when URL has no hash fragment', () => {
    const url = 'https://example.com';
    const result = parseDelegationFromURL(url);
    expect(result).toBeUndefined();
  });

  it('should return undefined when hash fragment has no delegation parameter', () => {
    const url = 'https://example.com#other=param';
    const result = parseDelegationFromURL(url);
    expect(result).toBeUndefined();
  });

  it('should handle invalid percent encoding in hash fragment', () => {
    const url = 'https://example.com#%'; // Invalid percent encoding
    const result = parseDelegationFromURL(url);
    expect(result).toBeUndefined();
  });

  it('should handle multiple parameters in hash fragment', () => {
    const url = 'https://example.com#delegation=test_delegation&other=param';
    const result = parseDelegationFromURL(url);
    expect(result).toBe('test_delegation');
  });

  it('should return undefined when delegation parameter is empty', () => {
    const url = 'https://example.com#delegation=';
    const result = parseDelegationFromURL(url);
    expect(result).toBeUndefined();
  });
});
