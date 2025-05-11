import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login } from '../login';
import { Ed25519KeyIdentityValueStorageWrapper } from '../../../storage/Ed25519KeyIdentityValueStorageWrapper';
import { StringValueStorageWrapper } from 'expo-storage-universal';
import { openBrowser } from '../openBrowser';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { CryptoModule } from 'expo-crypto-universal';
import { DeepLinkType } from 'expo-icp-frontend-helpers';

vi.mock('../openBrowser', () => ({
  openBrowser: vi.fn(),
}));

vi.mock('@dfinity/identity', () => ({
  Ed25519KeyIdentity: {
    generate: vi.fn(),
  },
}));

describe('login', () => {
  const appKeyStorage = {
    save: vi.fn().mockResolvedValue(undefined),
  } as unknown as Ed25519KeyIdentityValueStorageWrapper;

  const redirectPathStorage = {
    save: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
  } as unknown as StringValueStorageWrapper;

  const sessionIdStorage = {
    save: vi.fn().mockResolvedValue(undefined),
  } as unknown as StringValueStorageWrapper;

  const cryptoModule = {
    getRandomBytes: vi.fn().mockResolvedValue(new Uint8Array(32)),
  } as unknown as CryptoModule;

  const mockParams = {
    iiIntegrationUrl: 'https://example.com',
    deepLinkType: 'modern' as DeepLinkType,
    redirectPath: '/dashboard',
    appKeyStorage,
    redirectPathStorage,
    sessionIdStorage,
    cryptoModule,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle login process successfully', async () => {
    const mockAppKey = {
      getPublicKey: () => ({
        toDer: () => new Uint8Array([1, 2, 3]),
      }),
    } as unknown as Ed25519KeyIdentity;

    vi.mocked(Ed25519KeyIdentity.generate).mockResolvedValue(mockAppKey);
    vi.mocked(openBrowser).mockResolvedValue(undefined);

    await login(mockParams);

    expect(redirectPathStorage.save).toHaveBeenCalledWith('/dashboard');
    expect(Ed25519KeyIdentity.generate).toHaveBeenCalled();
    expect(appKeyStorage.save).toHaveBeenCalledWith(mockAppKey);
    expect(sessionIdStorage.save).toHaveBeenCalledWith(expect.any(String));
    expect(openBrowser).toHaveBeenCalledWith(
      expect.stringContaining('https://example.com'),
    );
  });

  it('should remove redirect path when not provided', async () => {
    const mockAppKey = {
      getPublicKey: () => ({
        toDer: () => new Uint8Array([1, 2, 3]),
      }),
    } as unknown as Ed25519KeyIdentity;

    vi.mocked(Ed25519KeyIdentity.generate).mockResolvedValue(mockAppKey);
    vi.mocked(openBrowser).mockResolvedValue(undefined);

    await login({ ...mockParams, redirectPath: undefined });

    expect(redirectPathStorage.remove).toHaveBeenCalled();
    expect(redirectPathStorage.save).not.toHaveBeenCalled();
  });

  it('should throw error when Ed25519KeyIdentity.generate fails', async () => {
    vi.mocked(Ed25519KeyIdentity.generate).mockRejectedValue(
      new Error('Generate failed'),
    );

    await expect(login(mockParams)).rejects.toThrow('Generate failed');

    expect(redirectPathStorage.save).toHaveBeenCalledWith('/dashboard');
    expect(Ed25519KeyIdentity.generate).toHaveBeenCalled();
    expect(appKeyStorage.save).not.toHaveBeenCalled();
    expect(sessionIdStorage.save).not.toHaveBeenCalled();
    expect(openBrowser).not.toHaveBeenCalled();
  });

  it('should throw error when appKeyStorage.save fails', async () => {
    const mockAppKey = {
      getPublicKey: () => ({
        toDer: () => new Uint8Array([1, 2, 3]),
      }),
    } as unknown as Ed25519KeyIdentity;

    vi.mocked(Ed25519KeyIdentity.generate).mockResolvedValue(mockAppKey);
    (appKeyStorage.save as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Save failed'),
    );

    await expect(login(mockParams)).rejects.toThrow('Save failed');

    expect(redirectPathStorage.save).toHaveBeenCalledWith('/dashboard');
    expect(Ed25519KeyIdentity.generate).toHaveBeenCalled();
    expect(appKeyStorage.save).toHaveBeenCalledWith(mockAppKey);
    expect(sessionIdStorage.save).not.toHaveBeenCalled();
    expect(openBrowser).not.toHaveBeenCalled();
  });

  it('should throw error when openBrowser fails', async () => {
    const mockAppKey = {
      getPublicKey: () => ({
        toDer: () => new Uint8Array([1, 2, 3]),
      }),
    } as unknown as Ed25519KeyIdentity;

    vi.mocked(Ed25519KeyIdentity.generate).mockResolvedValue(mockAppKey);
    (appKeyStorage.save as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined,
    );
    vi.mocked(openBrowser).mockRejectedValue(new Error('Browser failed'));

    await expect(login(mockParams)).rejects.toThrow('Browser failed');

    expect(redirectPathStorage.save).toHaveBeenCalledWith('/dashboard');
    expect(Ed25519KeyIdentity.generate).toHaveBeenCalled();
    expect(appKeyStorage.save).toHaveBeenCalledWith(mockAppKey);
    expect(sessionIdStorage.save).toHaveBeenCalledWith(expect.any(String));
    expect(openBrowser).toHaveBeenCalledWith(
      expect.stringContaining('https://example.com'),
    );
  });
});
