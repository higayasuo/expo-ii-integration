import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnonymousIdentity } from '@dfinity/agent';
import { DelegationIdentity } from '@dfinity/identity';
import { getIdentity } from '../getIdentity';
import { Ed25519KeyIdentityValueStorageWrapper } from '../../../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../../../storage/DelegationChainValueStorageWrapper';
import { buildIdentityFromStorage } from '../buildIdentityFromStorage';

vi.mock('../buildIdentityFromStorage', () => ({
  buildIdentityFromStorage: vi.fn(),
}));

describe('getIdentity', () => {
  const appKeyStorage = {} as Ed25519KeyIdentityValueStorageWrapper;
  const delegationStorage = {} as DelegationChainValueStorageWrapper;
  const onError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return identity when buildIdentityFromStorage succeeds', async () => {
    const mockIdentity = {} as DelegationIdentity;
    vi.mocked(buildIdentityFromStorage).mockResolvedValue(mockIdentity);

    const identity = await getIdentity({
      appKeyStorage,
      delegationStorage,
      onError,
    });

    expect(identity).toBe(mockIdentity);
    expect(onError).not.toHaveBeenCalled();
  });

  it('should return AnonymousIdentity when buildIdentityFromStorage returns undefined', async () => {
    vi.mocked(buildIdentityFromStorage).mockResolvedValue(undefined);

    const identity = await getIdentity({
      appKeyStorage,
      delegationStorage,
      onError,
    });

    expect(identity).toBeInstanceOf(AnonymousIdentity);
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError and throw error when buildIdentityFromStorage fails', async () => {
    const error = new Error('Failed to build identity');
    vi.mocked(buildIdentityFromStorage).mockRejectedValue(error);

    await expect(
      getIdentity({
        appKeyStorage,
        delegationStorage,
        onError,
      }),
    ).rejects.toThrow(error);

    expect(onError).toHaveBeenCalledWith(error);
  });
});
