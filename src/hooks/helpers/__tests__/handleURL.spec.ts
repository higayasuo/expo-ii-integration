import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleURL } from '../handleURL';
import { Ed25519KeyIdentityValueStorageWrapper } from '../../../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../../../storage/DelegationChainValueStorageWrapper';
import { StringValueStorageWrapper } from 'expo-storage-universal';
import { parseDelegationFromURL } from '../parseDelegationFromURL';
import { buildIdentityFromDelegation } from '../buildIdentityFromDelegation';
import { DelegationIdentity } from '@dfinity/identity';

vi.mock('../parseDelegationFromURL', () => ({
  parseDelegationFromURL: vi.fn(),
}));

vi.mock('../buildIdentityFromDelegation', () => ({
  buildIdentityFromDelegation: vi.fn(),
}));

describe('handleURL', () => {
  const delegationStorage = {
    save: vi.fn().mockResolvedValue(undefined),
  } as unknown as DelegationChainValueStorageWrapper;

  const appKeyStorage = {
    retrieve: vi.fn().mockResolvedValue({}),
  } as unknown as Ed25519KeyIdentityValueStorageWrapper;

  const sessionIdStorage = {
    find: vi.fn().mockResolvedValue('test-session-id'),
  } as unknown as StringValueStorageWrapper;

  const onSuccess = vi.fn();
  const onError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(sessionIdStorage.find).mockResolvedValue('test-session-id');
  });

  it('should handle URL successfully when delegation is present', async () => {
    const url =
      'exp://192.168.0.210/--/dashboard#delegation=test-delegation&session-id=test-session-id';
    const identity = {} as unknown as DelegationIdentity;

    vi.mocked(parseDelegationFromURL).mockReturnValue('test-delegation');
    vi.mocked(buildIdentityFromDelegation).mockResolvedValue(identity);

    await handleURL({
      url,
      delegationStorage,
      appKeyStorage,
      sessionIdStorage,
      onSuccess,
      onError,
    });

    expect(sessionIdStorage.find).toHaveBeenCalled();
    expect(parseDelegationFromURL).toHaveBeenCalledWith({
      url,
      sessionId: 'test-session-id',
    });
    expect(buildIdentityFromDelegation).toHaveBeenCalledWith({
      delegation: 'test-delegation',
      delegationStorage,
      appKeyStorage,
    });
    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('should not proceed when session ID is not found', async () => {
    const url =
      'exp://192.168.0.210/--/dashboard#delegation=test-delegation&session-id=test-session-id';

    vi.mocked(sessionIdStorage.find).mockResolvedValue(undefined);

    await handleURL({
      url,
      delegationStorage,
      appKeyStorage,
      sessionIdStorage,
      onSuccess,
      onError,
    });

    expect(sessionIdStorage.find).toHaveBeenCalled();
    expect(parseDelegationFromURL).not.toHaveBeenCalled();
    expect(buildIdentityFromDelegation).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('should not proceed when delegation is not present', async () => {
    const url =
      'exp://192.168.0.210/--/#other=value&session-id=test-session-id';

    vi.mocked(parseDelegationFromURL).mockReturnValue(undefined);

    await handleURL({
      url,
      delegationStorage,
      appKeyStorage,
      sessionIdStorage,
      onSuccess,
      onError,
    });

    expect(sessionIdStorage.find).toHaveBeenCalled();
    expect(parseDelegationFromURL).toHaveBeenCalledWith({
      url,
      sessionId: 'test-session-id',
    });
    expect(buildIdentityFromDelegation).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError when an error occurs', async () => {
    const url =
      'exp://192.168.0.210/--/dashboard#delegation=test-delegation&session-id=test-session-id';
    const error = new Error('Test error');

    vi.mocked(parseDelegationFromURL).mockImplementation(() => {
      throw error;
    });

    await handleURL({
      url,
      delegationStorage,
      appKeyStorage,
      sessionIdStorage,
      onSuccess,
      onError,
    });

    expect(sessionIdStorage.find).toHaveBeenCalled();
    expect(parseDelegationFromURL).toHaveBeenCalledWith({
      url,
      sessionId: 'test-session-id',
    });
    expect(buildIdentityFromDelegation).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(error);
  });
});
