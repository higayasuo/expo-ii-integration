import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleURL } from '../handleURL';
import { DelegationIdentity } from '@dfinity/identity';
import { Ed25519KeyIdentityValueStorageWrapper } from '../../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../../storage/DelegationChainValueStorageWrapper';
import { setupIdentityFromDelegation } from '../setupIdentityFromDelegation';

vi.mock('../setupIdentityFromDelegation', () => ({
  setupIdentityFromDelegation: vi.fn(),
}));

describe('handleURL', () => {
  const mockDelegationStorage = {} as DelegationChainValueStorageWrapper;
  const mockAppKeyStorage = {} as Ed25519KeyIdentityValueStorageWrapper;
  const mockIdentity = {} as DelegationIdentity;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call onSuccess when delegation is present and setup succeeds', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(setupIdentityFromDelegation).mockImplementation(
      async ({ onSuccess: success }) => {
        success(mockIdentity);
      },
    );

    await handleURL({
      url: 'https://example.com#delegation=test_delegation',
      delegationStorage: mockDelegationStorage,
      appKeyStorage: mockAppKeyStorage,
      onSuccess,
      onError,
    });

    expect(onSuccess).toHaveBeenCalledWith(mockIdentity);
    expect(onError).not.toHaveBeenCalled();
  });

  it('should not call onSuccess or onError when delegation is not present', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    await handleURL({
      url: 'https://example.com#other=param',
      delegationStorage: mockDelegationStorage,
      appKeyStorage: mockAppKeyStorage,
      onSuccess,
      onError,
    });

    expect(setupIdentityFromDelegation).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError when setupIdentityFromDelegation fails', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const error = new Error('Setup failed');

    vi.mocked(setupIdentityFromDelegation).mockImplementation(
      async ({ onError: errorCallback }) => {
        errorCallback(error);
      },
    );

    await handleURL({
      url: 'https://example.com#delegation=test_delegation',
      delegationStorage: mockDelegationStorage,
      appKeyStorage: mockAppKeyStorage,
      onSuccess,
      onError,
    });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(error);
  });
});
