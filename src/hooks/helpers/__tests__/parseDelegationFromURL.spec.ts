import { describe, it, expect } from 'vitest';
import { parseDelegationFromURL } from '../parseDelegationFromURL';

describe('parseDelegationFromURL', () => {
  it('should return delegation when delegation and session-id match', () => {
    const url =
      'https://example.com/ii-integration#delegation=test-delegation&session-id=test-session-id';
    const result = parseDelegationFromURL({
      url,
      sessionId: 'test-session-id',
    });
    expect(result).toBe('test-delegation');
  });

  it('should return undefined when session-id does not match', () => {
    const url =
      'https://example.com/ii-integration#delegation=test-delegation&session-id=wrong-session-id';
    const result = parseDelegationFromURL({
      url,
      sessionId: 'test-session-id',
    });
    expect(result).toBeUndefined();
  });

  it('should return undefined when delegation is not present', () => {
    const url =
      'https://example.com/ii-integration#session-id=test-session-id&other=value';
    const result = parseDelegationFromURL({
      url,
      sessionId: 'test-session-id',
    });
    expect(result).toBeUndefined();
  });

  it('should return undefined when hash is not present', () => {
    const url = 'https://example.com/ii-integration';
    const result = parseDelegationFromURL({
      url,
      sessionId: 'test-session-id',
    });
    expect(result).toBeUndefined();
  });
});
