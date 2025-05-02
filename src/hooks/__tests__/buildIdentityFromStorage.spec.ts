import { describe, it, expect, vi } from 'vitest';
import { DelegationIdentity, Ed25519KeyIdentity } from '@dfinity/identity';
import { buildIdentityFromStorage } from '../buildIdentityFromStorage';
import { DelegationChainValueStorageWrapper } from '../../storage/DelegationChainValueStorageWrapper';
import { Ed25519KeyIdentityValueStorageWrapper } from '../../storage/Ed25519KeyIdentityValueStorageWrapper';
import {
  buildIdentity,
  isAuthenticationExpiredError,
} from 'expo-icp-frontend-helpers';

vi.mock('expo-icp-frontend-helpers', () => ({
  buildIdentity: vi.fn(),
  isAuthenticationExpiredError: vi.fn(),
}));

describe('buildIdentityFromStorage', () => {
  it('should build identity when both app key and delegation exist', async () => {
    const appKey = Ed25519KeyIdentity.generate();
    const appKeyStorage = {
      find: vi.fn().mockResolvedValue(appKey),
    } as unknown as Ed25519KeyIdentityValueStorageWrapper;

    const delegationChain = {
      toJSON: vi.fn().mockReturnValue({ delegations: [] }),
    };
    const delegationStorage = {
      find: vi.fn().mockResolvedValue(delegationChain),
    } as unknown as DelegationChainValueStorageWrapper;

    const mockIdentity = {} as DelegationIdentity;
    vi.mocked(buildIdentity).mockResolvedValue(mockIdentity);

    const identity = await buildIdentityFromStorage({
      appKeyStorage,
      delegationStorage,
    });

    expect(identity).toBe(mockIdentity);
    expect(appKeyStorage.find).toHaveBeenCalled();
    expect(delegationStorage.find).toHaveBeenCalled();
    expect(buildIdentity).toHaveBeenCalledWith({
      appKey,
      delegationChain,
    });
  });

  it('should generate and save new app key when app key does not exist', async () => {
    const appKeyStorage = {
      find: vi.fn().mockResolvedValue(undefined),
      save: vi.fn().mockResolvedValue(undefined),
    } as unknown as Ed25519KeyIdentityValueStorageWrapper;

    const delegationStorage = {
      find: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined),
    } as unknown as DelegationChainValueStorageWrapper;

    const identity = await buildIdentityFromStorage({
      appKeyStorage,
      delegationStorage,
    });

    expect(identity).toBeUndefined();
    expect(appKeyStorage.find).toHaveBeenCalled();
    expect(appKeyStorage.save).toHaveBeenCalled();
    expect(delegationStorage.remove).toHaveBeenCalled();
  });

  it('should remove delegation and throw error when authentication is expired', async () => {
    const appKey = Ed25519KeyIdentity.generate();
    const appKeyStorage = {
      find: vi.fn().mockResolvedValue(appKey),
    } as unknown as Ed25519KeyIdentityValueStorageWrapper;

    const delegationChain = {
      toJSON: vi.fn().mockReturnValue({ delegations: [] }),
    };
    const delegationStorage = {
      find: vi.fn().mockResolvedValue(delegationChain),
      remove: vi.fn().mockResolvedValue(undefined),
    } as unknown as DelegationChainValueStorageWrapper;

    const error = new Error('Authentication expired');
    vi.mocked(buildIdentity).mockRejectedValue(error);
    vi.mocked(isAuthenticationExpiredError).mockReturnValue(true);

    await expect(
      buildIdentityFromStorage({
        appKeyStorage,
        delegationStorage,
      }),
    ).rejects.toThrow('Authentication expired');

    expect(delegationStorage.remove).toHaveBeenCalled();
  });

  it('should throw error without removing delegation when error is not authentication expired', async () => {
    const appKey = Ed25519KeyIdentity.generate();
    const appKeyStorage = {
      find: vi.fn().mockResolvedValue(appKey),
    } as unknown as Ed25519KeyIdentityValueStorageWrapper;

    const delegationChain = {
      toJSON: vi.fn().mockReturnValue({ delegations: [] }),
    };
    const delegationStorage = {
      find: vi.fn().mockResolvedValue(delegationChain),
      remove: vi.fn().mockResolvedValue(undefined),
    } as unknown as DelegationChainValueStorageWrapper;

    const error = new Error('Other error');
    vi.mocked(buildIdentity).mockRejectedValue(error);
    vi.mocked(isAuthenticationExpiredError).mockReturnValue(false);

    await expect(
      buildIdentityFromStorage({
        appKeyStorage,
        delegationStorage,
      }),
    ).rejects.toThrow('Other error');

    expect(delegationStorage.remove).not.toHaveBeenCalled();
  });
});
