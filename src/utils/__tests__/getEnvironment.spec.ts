import { describe, it, expect, beforeEach } from 'vitest';
import { getEnvironment } from '../getEnvironment';

describe('getEnvironment', () => {
  const mockFrontendCanisterId = 'test-canister-id';

  beforeEach(() => {
    // Reset window.location.href before each test
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
      },
      writable: true,
    });
  });

  it('should return "icp" when running in Bare environment with ICP URL', () => {
    window.location.href = `https://${mockFrontendCanisterId}.raw.ic0.app`;
    const result = getEnvironment('bare', mockFrontendCanisterId);
    expect(result).toBe('icp');
  });

  it('should return "bare" when running in Bare environment without ICP URL', () => {
    window.location.href = 'https://example.com';
    const result = getEnvironment('bare', mockFrontendCanisterId);
    expect(result).toBe('bare');
  });

  it('should return "storeClient" when running in StoreClient environment', () => {
    const result = getEnvironment('storeClient', mockFrontendCanisterId);
    expect(result).toBe('storeClient');
  });

  it('should return "standalone" when running in Standalone environment', () => {
    const result = getEnvironment('standalone', mockFrontendCanisterId);
    expect(result).toBe('standalone');
  });
});
