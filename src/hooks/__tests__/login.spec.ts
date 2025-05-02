import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login } from '../login';
import { Ed25519KeyIdentityValueStorageWrapper } from '../../storage/Ed25519KeyIdentityValueStorageWrapper';
import { RedirectPathStorage } from '../../storage/RedirectPathStorage';
import { buildIIIntegrationURL } from '../buildIIIntegrationURL';
import { openBrowser } from '../openBrowser';
import { saveRedirectPath } from '../saveRedirectPath';
import { Ed25519KeyIdentity } from '@dfinity/identity';

vi.mock('../buildIIIntegrationURL', () => ({
  buildIIIntegrationURL: vi.fn(),
}));

vi.mock('../openBrowser', () => ({
  openBrowser: vi.fn(),
}));

vi.mock('../saveRedirectPath', () => ({
  saveRedirectPath: vi.fn(),
}));

describe('login', () => {
  const appKeyStorage = {
    retrieve: vi.fn(),
  } as unknown as Ed25519KeyIdentityValueStorageWrapper;

  const redirectPathStorage = {
    save: vi.fn().mockResolvedValue(undefined),
  } as unknown as RedirectPathStorage;

  const mockConfig = {
    localIPAddress: '127.0.0.1',
    dfxNetwork: 'local',
    easDeepLinkType: 'modern',
    deepLink: 'app://',
    frontendCanisterId: 'frontend',
    iiIntegrationCanisterId: 'ii-integration',
    currentPath: '/',
    loginOuterParams: { redirectPath: '/dashboard' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
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

    vi.mocked(appKeyStorage.retrieve).mockResolvedValue(mockAppKey);
    vi.mocked(buildIIIntegrationURL).mockReturnValue(mockIIIntegrationURL);
    vi.mocked(openBrowser).mockResolvedValue(undefined);
    vi.mocked(saveRedirectPath).mockResolvedValue(undefined);

    await login({
      appKeyStorage,
      redirectPathStorage,
      ...mockConfig,
    });

    expect(saveRedirectPath).toHaveBeenCalledWith({
      currentPath: '/',
      loginOuterParams: { redirectPath: '/dashboard' },
      redirectPathStorage,
    });
    expect(appKeyStorage.retrieve).toHaveBeenCalled();
    expect(buildIIIntegrationURL).toHaveBeenCalledWith({
      pubkey: '010203',
      localIPAddress: '127.0.0.1',
      dfxNetwork: 'local',
      easDeepLinkType: 'modern',
      deepLink: 'app://',
      frontendCanisterId: 'frontend',
      iiIntegrationCanisterId: 'ii-integration',
    });
    expect(openBrowser).toHaveBeenCalledWith(mockIIIntegrationURL);
  });

  it('should throw error when appKeyStorage.retrieve fails', async () => {
    vi.mocked(appKeyStorage.retrieve).mockRejectedValue(
      new Error('Retrieve failed'),
    );
    vi.mocked(saveRedirectPath).mockResolvedValue(undefined);

    await expect(
      login({
        appKeyStorage,
        redirectPathStorage,
        ...mockConfig,
      }),
    ).rejects.toThrow('Retrieve failed');

    expect(saveRedirectPath).toHaveBeenCalledWith({
      currentPath: '/',
      loginOuterParams: { redirectPath: '/dashboard' },
      redirectPathStorage,
    });
    expect(appKeyStorage.retrieve).toHaveBeenCalled();
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

    vi.mocked(appKeyStorage.retrieve).mockResolvedValue(mockAppKey);
    vi.mocked(buildIIIntegrationURL).mockReturnValue(mockIIIntegrationURL);
    vi.mocked(openBrowser).mockRejectedValue(new Error('Browser failed'));
    vi.mocked(saveRedirectPath).mockResolvedValue(undefined);

    await expect(
      login({
        appKeyStorage,
        redirectPathStorage,
        ...mockConfig,
      }),
    ).rejects.toThrow('Browser failed');

    expect(saveRedirectPath).toHaveBeenCalledWith({
      currentPath: '/',
      loginOuterParams: { redirectPath: '/dashboard' },
      redirectPathStorage,
    });
    expect(appKeyStorage.retrieve).toHaveBeenCalled();
    expect(buildIIIntegrationURL).toHaveBeenCalledWith({
      pubkey: '010203',
      localIPAddress: '127.0.0.1',
      dfxNetwork: 'local',
      easDeepLinkType: 'modern',
      deepLink: 'app://',
      frontendCanisterId: 'frontend',
      iiIntegrationCanisterId: 'ii-integration',
    });
    expect(openBrowser).toHaveBeenCalledWith(mockIIIntegrationURL);
  });
});
