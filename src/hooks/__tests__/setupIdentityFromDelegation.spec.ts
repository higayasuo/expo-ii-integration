import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DelegationIdentity } from '@dfinity/identity';
import { setupIdentityFromDelegation } from '../setupIdentityFromDelegation';
import { buildIdentityFromDelegation } from '../buildIdentityFromDelegation';
import { Ed25519KeyIdentityValueStorageWrapper } from '../../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../../storage/DelegationChainValueStorageWrapper';

vi.mock('../buildIdentityFromDelegation', () => ({
  buildIdentityFromDelegation: vi.fn(),
}));

describe('setupIdentityFromDelegation', () => {
  const mockDelegation = 'test-delegation';
  const mockDelegationStorage = {} as DelegationChainValueStorageWrapper;
  const mockAppKeyStorage = {} as Ed25519KeyIdentityValueStorageWrapper;
  const mockIdentity = {} as DelegationIdentity;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call buildIdentityFromDelegation with correct parameters', async () => {
    vi.mocked(buildIdentityFromDelegation).mockResolvedValue(mockIdentity);
    const onSuccess = vi.fn();
    const onError = vi.fn();

    await setupIdentityFromDelegation({
      delegation: mockDelegation,
      delegationStorage: mockDelegationStorage,
      appKeyStorage: mockAppKeyStorage,
      onSuccess,
      onError,
    });

    expect(buildIdentityFromDelegation).toHaveBeenCalledWith({
      delegation: mockDelegation,
      delegationStorage: mockDelegationStorage,
      appKeyStorage: mockAppKeyStorage,
    });
  });

  it('should call onSuccess with the identity when buildIdentityFromDelegation succeeds', async () => {
    vi.mocked(buildIdentityFromDelegation).mockResolvedValue(mockIdentity);
    const onSuccess = vi.fn();
    const onError = vi.fn();

    await setupIdentityFromDelegation({
      delegation: mockDelegation,
      delegationStorage: mockDelegationStorage,
      appKeyStorage: mockAppKeyStorage,
      onSuccess,
      onError,
    });

    expect(onSuccess).toHaveBeenCalledWith(mockIdentity);
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError when buildIdentityFromDelegation fails', async () => {
    const mockError = new Error('Test error');
    vi.mocked(buildIdentityFromDelegation).mockRejectedValue(mockError);
    const onSuccess = vi.fn();
    const onError = vi.fn();

    await setupIdentityFromDelegation({
      delegation: mockDelegation,
      delegationStorage: mockDelegationStorage,
      appKeyStorage: mockAppKeyStorage,
      onSuccess,
      onError,
    });

    expect(onError).toHaveBeenCalledWith(mockError);
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
