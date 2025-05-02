import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleURL } from '../handleURL';
import { Ed25519KeyIdentityValueStorageWrapper } from '../../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../../storage/DelegationChainValueStorageWrapper';
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

  const onSuccess = vi.fn();
  const onError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle URL successfully when delegation is present', async () => {
    const url = 'exp://192.168.0.210/--/dashboard#delegation=test-delegation';
    const identity = {} as unknown as DelegationIdentity;

    vi.mocked(parseDelegationFromURL).mockReturnValue('test-delegation');
    vi.mocked(buildIdentityFromDelegation).mockResolvedValue(identity);

    await handleURL({
      url,
      delegationStorage,
      appKeyStorage,
      onSuccess,
      onError,
    });

    expect(parseDelegationFromURL).toHaveBeenCalledWith(url);
    expect(buildIdentityFromDelegation).toHaveBeenCalledWith({
      delegation: 'test-delegation',
      delegationStorage,
      appKeyStorage,
    });
    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('should not proceed when delegation is not present', async () => {
    const url = 'exp://192.168.0.210/--/dashboard#other=value';

    vi.mocked(parseDelegationFromURL).mockReturnValue(undefined);

    await handleURL({
      url,
      delegationStorage,
      appKeyStorage,
      onSuccess,
      onError,
    });

    expect(parseDelegationFromURL).toHaveBeenCalledWith(url);
    expect(buildIdentityFromDelegation).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError when an error occurs', async () => {
    const url = 'exp://192.168.0.210/--/dashboard#delegation=test-delegation';
    const error = new Error('Test error');

    vi.mocked(parseDelegationFromURL).mockImplementation(() => {
      throw error;
    });

    await handleURL({
      url,
      delegationStorage,
      appKeyStorage,
      onSuccess,
      onError,
    });

    expect(parseDelegationFromURL).toHaveBeenCalledWith(url);
    expect(buildIdentityFromDelegation).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(error);
  });
});
