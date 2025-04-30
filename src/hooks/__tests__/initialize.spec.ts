import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initialize } from '../initialize';
import { DelegationIdentity } from '@dfinity/identity';
import { Ed25519KeyIdentityValueStorageWrapper } from '../../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../../storage/DelegationChainValueStorageWrapper';
import { buildIdentityFromStorage } from '../buildIdentityFromStorage';

vi.mock('../buildIdentityFromStorage', () => ({
  buildIdentityFromStorage: vi.fn(),
}));

describe('initialize', () => {
  const mockAppKeyStorage = {} as Ed25519KeyIdentityValueStorageWrapper;
  const mockDelegationStorage = {} as DelegationChainValueStorageWrapper;
  const onSuccess = vi.fn();
  const onError = vi.fn();
  const mockIdentity = {} as DelegationIdentity;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call onSuccess when identity is built successfully', async () => {
    vi.mocked(buildIdentityFromStorage).mockResolvedValue(mockIdentity);

    await initialize({
      appKeyStorage: mockAppKeyStorage,
      delegationStorage: mockDelegationStorage,
      onSuccess,
      onError,
    });

    expect(onSuccess).toHaveBeenCalledWith(mockIdentity);
    expect(onError).not.toHaveBeenCalled();
  });

  it('should not call onSuccess when no identity is built', async () => {
    vi.mocked(buildIdentityFromStorage).mockResolvedValue(undefined);

    await initialize({
      appKeyStorage: mockAppKeyStorage,
      delegationStorage: mockDelegationStorage,
      onSuccess,
      onError,
    });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError when buildIdentityFromStorage throws an error', async () => {
    const error = new Error('Build failed');
    vi.mocked(buildIdentityFromStorage).mockRejectedValue(error);

    await initialize({
      appKeyStorage: mockAppKeyStorage,
      delegationStorage: mockDelegationStorage,
      onSuccess,
      onError,
    });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(error);
  });
});
