import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleURL } from '../handleURL';
import { Ed25519KeyIdentityValueStorageWrapper } from '../../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../../storage/DelegationChainValueStorageWrapper';
import { Storage } from 'expo-storage-universal';
import { setupIdentityFromDelegation } from '../setupIdentityFromDelegation';
import { DelegationIdentity } from '@dfinity/identity';

vi.mock('../setupIdentityFromDelegation', () => ({
  setupIdentityFromDelegation: vi.fn(),
}));

describe('handleURL', () => {
  const authPath = 'ii-integration';
  const storage = {
    find: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  } as unknown as Storage;
  const delegationStorage = new DelegationChainValueStorageWrapper(
    storage,
    'delegation',
  );
  const appKeyStorage = new Ed25519KeyIdentityValueStorageWrapper(
    storage,
    'appKey',
  );
  const onSuccess = vi.fn();
  const onError = vi.fn();
  const mockIdentity = {} as DelegationIdentity;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call onSuccess when delegation is present', async () => {
    vi.mocked(setupIdentityFromDelegation).mockImplementation(
      async ({ onSuccess: success }) => {
        success(mockIdentity);
      },
    );

    await handleURL({
      url: 'https://example.com/ii-integration#delegation=test_delegation',
      authPath,
      delegationStorage,
      appKeyStorage,
      onSuccess,
      onError,
    });

    expect(onSuccess).toHaveBeenCalledWith(mockIdentity);
    expect(onError).not.toHaveBeenCalled();
  });

  it('should not call onSuccess when delegation is not present', async () => {
    await handleURL({
      url: 'https://example.com/ii-integration#other=param',
      authPath,
      delegationStorage,
      appKeyStorage,
      onSuccess,
      onError,
    });

    expect(setupIdentityFromDelegation).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError when URL is invalid', async () => {
    await handleURL({
      url: 'invalid-url',
      authPath,
      delegationStorage,
      appKeyStorage,
      onSuccess,
      onError,
    });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
  });
});
