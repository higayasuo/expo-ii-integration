import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initialize } from '../initialize';
import { Ed25519KeyIdentityValueStorageWrapper } from '../../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../../storage/DelegationChainValueStorageWrapper';
import { Storage } from 'expo-storage-universal';
import { Ed25519KeyIdentity, DelegationChain } from '@dfinity/identity';

vi.mock('@dfinity/identity', () => ({
  Ed25519KeyIdentity: {
    generate: vi.fn(),
  },
}));

describe('initialize', () => {
  const mockStorage = {
    find: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  } as unknown as Storage;

  const mockAppKeyStorage = new Ed25519KeyIdentityValueStorageWrapper(
    mockStorage,
    'appKey',
  );
  const mockDelegationStorage = new DelegationChainValueStorageWrapper(
    mockStorage,
    'delegation',
  );
  const onSuccess = vi.fn();
  const onError = vi.fn();
  const onFinally = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate and save new appKey when not found', async () => {
    const generatedKey = {} as unknown as Ed25519KeyIdentity;

    mockAppKeyStorage.find = vi.fn().mockResolvedValue(undefined);
    mockAppKeyStorage.save = vi.fn().mockResolvedValue(undefined);
    mockDelegationStorage.find = vi.fn().mockResolvedValue(undefined);
    Ed25519KeyIdentity.generate = vi.fn().mockResolvedValue(generatedKey);

    await initialize({
      appKeyStorage: mockAppKeyStorage,
      delegationStorage: mockDelegationStorage,
      onSuccess,
      onError,
      onFinally,
    });

    expect(mockAppKeyStorage.find).toHaveBeenCalled();
    expect(Ed25519KeyIdentity.generate).toHaveBeenCalled();
    expect(mockAppKeyStorage.save).toHaveBeenCalledWith(generatedKey);
    expect(mockDelegationStorage.find).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalled();
  });

  it('should call onSuccess when both appKey and delegation are found', async () => {
    const appKey = {} as unknown as Ed25519KeyIdentity;
    const delegation = {} as unknown as DelegationChain;

    mockAppKeyStorage.find = vi.fn().mockResolvedValue(appKey);
    mockDelegationStorage.find = vi.fn().mockResolvedValue(delegation);

    await initialize({
      appKeyStorage: mockAppKeyStorage,
      delegationStorage: mockDelegationStorage,
      onSuccess,
      onError,
      onFinally,
    });

    expect(mockAppKeyStorage.find).toHaveBeenCalled();
    expect(mockDelegationStorage.find).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalled();
  });

  it('should call onError when an error occurs', async () => {
    const error = new Error('Test error');

    mockAppKeyStorage.find = vi.fn().mockRejectedValue(error);
    mockDelegationStorage.find = vi.fn().mockResolvedValue(undefined);

    await initialize({
      appKeyStorage: mockAppKeyStorage,
      delegationStorage: mockDelegationStorage,
      onSuccess,
      onError,
      onFinally,
    });

    expect(mockAppKeyStorage.find).toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(error);
    expect(onFinally).toHaveBeenCalled();
  });
});
