import { describe, it, expect } from 'vitest';
import { buildIIIntegrationURL } from '../buildIIIntegrationURL';

describe('buildIIIntegrationURL', () => {
  const mockArgs = {
    pubkey: 'test-pubkey',
    localIPAddress: '192.168.1.210',
    dfxNetwork: 'local',
    easDeepLinkType: undefined,
    deepLink: 'exp://192.168.1.210:8081',
    frontendCanisterId: 'test-frontend-canister-id',
    iiIntegrationCanisterId: 'test-ii-integration-canister-id',
    authPath: 'ii-integration',
  };

  it('should return a valid URL with correct base path', () => {
    const result = buildIIIntegrationURL(mockArgs);
    const url = new URL(result);

    expect(url.origin).toBe('https://192.168.1.210:14943');
    expect(url.pathname).toBe('/ii-integration');
  });

  it('should handle authPath that starts with a forward slash', () => {
    const result = buildIIIntegrationURL({
      ...mockArgs,
      authPath: '/ii-integration',
    });
    const url = new URL(result);

    expect(url.origin).toBe('https://192.168.1.210:14943');
    expect(url.pathname).toBe('/ii-integration');
  });

  it('should include correct query parameters', () => {
    const result = buildIIIntegrationURL(mockArgs);
    const url = new URL(result);

    expect(url.searchParams.get('canisterId')).toBe(
      mockArgs.iiIntegrationCanisterId,
    );
    expect(url.searchParams.get('pubkey')).toBe(mockArgs.pubkey);
    expect(url.searchParams.get('deep-link-type')).toBe('expo-go');
  });
});
