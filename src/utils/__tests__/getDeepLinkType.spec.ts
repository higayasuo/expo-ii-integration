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
      easDeepLinkType: undefined,
      deepLink: 'exp://localhost:8081',
      frontendCanisterId: mockFrontendCanisterId,
    });

    expect(result).toBe('expo-go');
  });

  it('should return "dev-server" when deepLink is "http://localhost:8081"', () => {
    const result = getDeepLinkType({
      easDeepLinkType: undefined,
      deepLink: 'http://localhost:8081',
      frontendCanisterId: mockFrontendCanisterId,
    });

    expect(result).toBe('dev-server');
  });

  it('should return "icp" when deepLink includes frontendCanisterId', () => {
    const result = getDeepLinkType({
      easDeepLinkType: undefined,
      deepLink: `https://${mockFrontendCanisterId}.raw.ic0.app`,
      frontendCanisterId: mockFrontendCanisterId,
    });

    expect(result).toBe('icp');
  });

  it('should throw an error when deep link type cannot be determined', () => {
    expect(() =>
      getDeepLinkType({
        easDeepLinkType: undefined,
        deepLink: 'unknown-deep-link',
        frontendCanisterId: mockFrontendCanisterId,
      }),
    ).toThrow('Could not determine deep link type');
  });

  it('should include all parameters in the error message', () => {
    const deepLink = 'unknown-deep-link';
    const frontendCanisterId = 'test-canister-id';
    const easDeepLinkType = undefined;

    try {
      getDeepLinkType({
        deepLink,
        frontendCanisterId,
        easDeepLinkType,
      });
      throw new Error('Expected an error to be thrown');
    } catch (error: unknown) {
      expect(error instanceof Error).toBe(true);
      expect((error as Error).message).toBe(
        'Could not determine deep link type:' +
          `\n  {\n    "easDeepLinkType": undefined,\n    "deepLink": "${deepLink}",\n    "frontendCanisterId": "${frontendCanisterId}"\n  }`,
      );
    }
  });
});
