import { describe, it, expect, vi, beforeEach } from 'vitest';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { getEnvironment } from '../getEnvironment';

// Mock expo-constants
vi.mock('expo-constants', () => ({
  default: {
    executionEnvironment: 'bare' as ExecutionEnvironment,
  },
  ExecutionEnvironment: {
    Bare: 'bare' as ExecutionEnvironment,
    StoreClient: 'storeClient' as ExecutionEnvironment,
    Standalone: 'standalone' as ExecutionEnvironment,
  },
}));

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
    const result = getEnvironment(mockFrontendCanisterId);
    expect(result).toBe('icp');
  });

  it('should return "bare" when running in Bare environment without ICP URL', () => {
    window.location.href = 'https://example.com';
    const result = getEnvironment(mockFrontendCanisterId);
    expect(result).toBe('bare');
  });

  it('should return "storeClient" when running in StoreClient environment', () => {
    vi.mocked(Constants).executionEnvironment =
      ExecutionEnvironment.StoreClient;
    const result = getEnvironment(mockFrontendCanisterId);
    expect(result).toBe('storeClient');
  });

  it('should return "standalone" when running in Standalone environment', () => {
    vi.mocked(Constants).executionEnvironment = ExecutionEnvironment.Standalone;
    const result = getEnvironment(mockFrontendCanisterId);
    expect(result).toBe('standalone');
  });
});
