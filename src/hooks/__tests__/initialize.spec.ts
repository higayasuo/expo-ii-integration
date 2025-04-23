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
  const mockDelegationStorage = {} as DelegationChainValueStorageWrapper;
  const mockAppKeyStorage = {} as Ed25519KeyIdentityValueStorageWrapper;
  const mockIdentity = {} as DelegationIdentity;
  const onSuccess = vi.fn();
  const onError = vi.fn();
  const onFinally = vi.fn();

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
      onFinally,
    });

    expect(buildIdentityFromStorage).toHaveBeenCalledWith({
      appKeyStorage: mockAppKeyStorage,
      delegationStorage: mockDelegationStorage,
    });
    expect(onSuccess).toHaveBeenCalledWith(mockIdentity);
    expect(onError).not.toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalled();
  });

  it('should call onError when buildIdentityFromStorage throws an error', async () => {
    const error = new Error('Test error');
    vi.mocked(buildIdentityFromStorage).mockRejectedValue(error);

    await initialize({
      appKeyStorage: mockAppKeyStorage,
      delegationStorage: mockDelegationStorage,
      onSuccess,
      onError,
      onFinally,
    });

    expect(buildIdentityFromStorage).toHaveBeenCalledWith({
      appKeyStorage: mockAppKeyStorage,
      delegationStorage: mockDelegationStorage,
    });
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(error);
    expect(onFinally).toHaveBeenCalled();
  });

  it('should only call onFinally when no identity is returned', async () => {
    vi.mocked(buildIdentityFromStorage).mockResolvedValue(undefined);

    await initialize({
      appKeyStorage: mockAppKeyStorage,
      delegationStorage: mockDelegationStorage,
      onSuccess,
      onError,
      onFinally,
    });

    expect(buildIdentityFromStorage).toHaveBeenCalledWith({
      appKeyStorage: mockAppKeyStorage,
      delegationStorage: mockDelegationStorage,
    });
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalled();
  });
});
