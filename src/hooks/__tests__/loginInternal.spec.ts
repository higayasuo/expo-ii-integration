import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getLoginInternal } from '../loginInternal';
import { DelegationIdentity } from '@dfinity/identity';
import { Ed25519KeyIdentityValueStorageWrapper } from '../../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../../storage/DelegationChainValueStorageWrapper';
import * as WebBrowser from 'expo-web-browser';
import { setupIdentityFromDelegation } from '../setupIdentityFromDelegation';

const mockMessenger = {
  on: vi.fn(),
  open: vi.fn(),
  close: vi.fn(),
};

vi.mock('../setupIdentityFromDelegation', () => ({
  setupIdentityFromDelegation: vi.fn(),
}));

vi.mock('expo-web-browser', () => ({
  openBrowserAsync: vi.fn(),
}));

vi.mock('../../messengers/IIIntegrationMessenger', () => ({
  IIIntegrationMessenger: vi.fn().mockImplementation(() => mockMessenger),
}));

describe('getLoginInternal', () => {
  const mockDelegationStorage = {} as DelegationChainValueStorageWrapper;
  const mockAppKeyStorage = {} as Ed25519KeyIdentityValueStorageWrapper;
  const mockIdentity = {} as DelegationIdentity;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should open browser for native platform', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const loginInternal = getLoginInternal({
      platform: 'native',
      appKeyStorage: mockAppKeyStorage,
      delegationStorage: mockDelegationStorage,
      onSuccess,
      onError,
    });

    await loginInternal('https://example.com');

    expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith(
      'https://example.com',
    );
    expect(mockMessenger.on).not.toHaveBeenCalled();
  });

  it('should use messenger for web platform', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const loginInternal = getLoginInternal({
      platform: 'web',
      appKeyStorage: mockAppKeyStorage,
      delegationStorage: mockDelegationStorage,
      onSuccess,
      onError,
    });

    await loginInternal('https://example.com');

    expect(mockMessenger.open).toHaveBeenCalledWith({
      url: 'https://example.com',
    });
    expect(WebBrowser.openBrowserAsync).not.toHaveBeenCalled();
  });

  it('should handle messenger success callback', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const loginInternal = getLoginInternal({
      platform: 'web',
      appKeyStorage: mockAppKeyStorage,
      delegationStorage: mockDelegationStorage,
      onSuccess,
      onError,
    });

    await loginInternal('https://example.com');

    const successCallback = mockMessenger.on.mock.calls[0][1];
    await successCallback({ delegation: 'test_delegation' });

    expect(setupIdentityFromDelegation).toHaveBeenCalledWith({
      delegation: 'test_delegation',
      delegationStorage: mockDelegationStorage,
      appKeyStorage: mockAppKeyStorage,
      onSuccess: expect.any(Function),
      onError,
    });
  });

  it('should close messenger on successful identity setup', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const loginInternal = getLoginInternal({
      platform: 'web',
      appKeyStorage: mockAppKeyStorage,
      delegationStorage: mockDelegationStorage,
      onSuccess,
      onError,
    });

    await loginInternal('https://example.com');

    const successCallback = mockMessenger.on.mock.calls[0][1];
    await successCallback({ delegation: 'test_delegation' });

    const setupSuccessCallback = vi.mocked(setupIdentityFromDelegation).mock
      .calls[0][0].onSuccess;
    setupSuccessCallback(mockIdentity);

    expect(mockMessenger.close).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalledWith(mockIdentity);
  });
});
