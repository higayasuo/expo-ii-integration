import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login } from '../login';
import { Ed25519KeyIdentityValueStorageWrapper } from '../../../storage/Ed25519KeyIdentityValueStorageWrapper';
import { StringValueStorageWrapper } from 'expo-storage-universal';
import { buildIIIntegrationURL } from '../buildIIIntegrationURL';
import { openBrowser } from '../openBrowser';
import { saveRedirectPath } from '../saveRedirectPath';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { CryptoModule } from 'expo-crypto-universal';

vi.mock('../buildIIIntegrationURL', () => ({
  buildIIIntegrationURL: vi.fn(),
}));

vi.mock('../openBrowser', () => ({
  openBrowser: vi.fn(),
}));

vi.mock('../saveRedirectPath', () => ({
  saveRedirectPath: vi.fn(),
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
  } as unknown as StringValueStorageWrapper;

  const sessionIdStorage = {
    save: vi.fn().mockResolvedValue(undefined),
  } as unknown as StringValueStorageWrapper;

  const cryptoModule = {
    getRandomBytes: vi.fn().mockResolvedValue(new Uint8Array(32)),
  } as unknown as CryptoModule;

  const mockConfig = {
    localIPAddress: '127.0.0.1',
    dfxNetwork: 'local',
    easDeepLinkType: 'modern',
    deepLink: 'app://',
    frontendCanisterId: 'frontend',
    iiIntegrationCanisterId: 'ii-integration',
    currentPath: '/',
    loginOuterParams: { redirectPath: '/dashboard' },
    cryptoModule,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (appKeyStorage.save as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined,
    );
  });

  it('should open browser when login is successful', async () => {
    const mockAppKey = {
      getPublicKey: () => ({
        toDer: () => new Uint8Array([1, 2, 3]),
      }),
      toJSON: vi.fn(),
      getKeyPair: vi.fn(),
      sign: vi.fn(),
      '#private': vi.fn(),
    } as unknown as Ed25519KeyIdentity;
    const mockIIIntegrationURL = 'https://example.com';

    vi.mocked(Ed25519KeyIdentity.generate).mockResolvedValue(mockAppKey);
    vi.mocked(buildIIIntegrationURL).mockReturnValue(mockIIIntegrationURL);
    vi.mocked(openBrowser).mockResolvedValue(undefined);
    vi.mocked(saveRedirectPath).mockResolvedValue(undefined);

    await login({
      appKeyStorage,
      redirectPathStorage,
      sessionIdStorage,
      ...mockConfig,
    });

    expect(saveRedirectPath).toHaveBeenCalledWith({
      currentPath: '/',
      loginOuterParams: { redirectPath: '/dashboard' },
      redirectPathStorage,
    });
    expect(Ed25519KeyIdentity.generate).toHaveBeenCalled();
    expect(appKeyStorage.save).toHaveBeenCalledWith(mockAppKey);
    expect(sessionIdStorage.save).toHaveBeenCalledWith(expect.any(String));
    expect(buildIIIntegrationURL).toHaveBeenCalledWith({
      pubkey: '010203',
      localIPAddress: '127.0.0.1',
      dfxNetwork: 'local',
      easDeepLinkType: 'modern',
      deepLink: 'app://',
      frontendCanisterId: 'frontend',
      iiIntegrationCanisterId: 'ii-integration',
      sessionId: expect.any(String),
    });
    expect(openBrowser).toHaveBeenCalledWith(mockIIIntegrationURL);
  });

  it('should throw error when Ed25519KeyIdentity.generate fails', async () => {
    vi.mocked(Ed25519KeyIdentity.generate).mockRejectedValue(
      new Error('Generate failed'),
    );
    vi.mocked(saveRedirectPath).mockResolvedValue(undefined);

    await expect(
      login({
        appKeyStorage,
        redirectPathStorage,
        sessionIdStorage,
        ...mockConfig,
      }),
    ).rejects.toThrow('Generate failed');

    expect(saveRedirectPath).toHaveBeenCalledWith({
      currentPath: '/',
      loginOuterParams: { redirectPath: '/dashboard' },
      redirectPathStorage,
    });
    expect(Ed25519KeyIdentity.generate).toHaveBeenCalled();
    expect(appKeyStorage.save).not.toHaveBeenCalled();
    expect(sessionIdStorage.save).not.toHaveBeenCalled();
    expect(buildIIIntegrationURL).not.toHaveBeenCalled();
    expect(openBrowser).not.toHaveBeenCalled();
  });

  it('should throw error when appKeyStorage.save fails', async () => {
    const mockAppKey = {
      getPublicKey: () => ({
        toDer: () => new Uint8Array([1, 2, 3]),
      }),
      toJSON: vi.fn(),
      getKeyPair: vi.fn(),
      sign: vi.fn(),
      '#private': vi.fn(),
    } as unknown as Ed25519KeyIdentity;

    vi.mocked(Ed25519KeyIdentity.generate).mockResolvedValue(mockAppKey);
    (appKeyStorage.save as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Save failed'),
    );
    vi.mocked(saveRedirectPath).mockResolvedValue(undefined);

    await expect(
      login({
        appKeyStorage,
        redirectPathStorage,
        sessionIdStorage,
        ...mockConfig,
      }),
    ).rejects.toThrow('Save failed');

    expect(saveRedirectPath).toHaveBeenCalledWith({
      currentPath: '/',
      loginOuterParams: { redirectPath: '/dashboard' },
      redirectPathStorage,
    });
    expect(Ed25519KeyIdentity.generate).toHaveBeenCalled();
    expect(appKeyStorage.save).toHaveBeenCalledWith(mockAppKey);
    expect(sessionIdStorage.save).not.toHaveBeenCalled();
    expect(buildIIIntegrationURL).not.toHaveBeenCalled();
    expect(openBrowser).not.toHaveBeenCalled();
  });

  it('should throw error when openBrowser fails', async () => {
    const mockAppKey = {
      getPublicKey: () => ({
        toDer: () => new Uint8Array([1, 2, 3]),
      }),
      toJSON: vi.fn(),
      getKeyPair: vi.fn(),
      sign: vi.fn(),
      '#private': vi.fn(),
    } as unknown as Ed25519KeyIdentity;
    const mockIIIntegrationURL = 'https://example.com';

    vi.mocked(Ed25519KeyIdentity.generate).mockResolvedValue(mockAppKey);
    vi.mocked(buildIIIntegrationURL).mockReturnValue(mockIIIntegrationURL);
    vi.mocked(openBrowser).mockRejectedValue(new Error('Browser failed'));
    vi.mocked(saveRedirectPath).mockResolvedValue(undefined);

    await expect(
      login({
        appKeyStorage,
        redirectPathStorage,
        sessionIdStorage,
        ...mockConfig,
      }),
    ).rejects.toThrow('Browser failed');

    expect(saveRedirectPath).toHaveBeenCalledWith({
      currentPath: '/',
      loginOuterParams: { redirectPath: '/dashboard' },
      redirectPathStorage,
    });
    expect(Ed25519KeyIdentity.generate).toHaveBeenCalled();
    expect(appKeyStorage.save).toHaveBeenCalledWith(mockAppKey);
    expect(sessionIdStorage.save).toHaveBeenCalledWith(expect.any(String));
    expect(buildIIIntegrationURL).toHaveBeenCalledWith({
      pubkey: '010203',
      localIPAddress: '127.0.0.1',
      dfxNetwork: 'local',
      easDeepLinkType: 'modern',
      deepLink: 'app://',
      frontendCanisterId: 'frontend',
      iiIntegrationCanisterId: 'ii-integration',
      sessionId: expect.any(String),
    });
    expect(openBrowser).toHaveBeenCalledWith(mockIIIntegrationURL);
  });
});
