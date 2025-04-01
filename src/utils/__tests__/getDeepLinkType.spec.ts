import { describe, it, expect } from 'vitest';
import { getDeepLinkType } from '../getDeepLinkType';

describe('getDeepLinkType', () => {
  const mockFrontendCanisterId = 'test-canister-id';

  it('should return the provided easDeepLinkType when it exists', () => {
    const result = getDeepLinkType({
      easDeepLinkType: 'legacy',
      deepLink: 'any-deep-link',
      frontendCanisterId: mockFrontendCanisterId,
    });

    expect(result).toBe('legacy');
  });

  it('should return "expo-go" when deepLink starts with "exp://"', () => {
    const result = getDeepLinkType({
      deepLink: 'exp://localhost:8081',
      frontendCanisterId: mockFrontendCanisterId,
    });

    expect(result).toBe('expo-go');
  });

  it('should return "dev-server" when deepLink is "http://localhost:8081/"', () => {
    const result = getDeepLinkType({
      deepLink: 'http://localhost:8081/',
      frontendCanisterId: mockFrontendCanisterId,
    });

    expect(result).toBe('dev-server');
  });

  it('should return "icp" when deepLink includes frontendCanisterId', () => {
    const result = getDeepLinkType({
      deepLink: `https://${mockFrontendCanisterId}.raw.ic0.app`,
      frontendCanisterId: mockFrontendCanisterId,
    });

    expect(result).toBe('icp');
  });

  it('should throw an error when deep link type cannot be determined', () => {
    expect(() =>
      getDeepLinkType({
        deepLink: 'unknown-deep-link',
        frontendCanisterId: mockFrontendCanisterId,
      }),
    ).toThrow('Could not determine deep link type');
  });
});
