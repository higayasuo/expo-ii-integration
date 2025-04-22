import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  DelegationIdentity,
  Ed25519KeyIdentity,
  DelegationChain,
} from '@dfinity/identity';
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
  let mockAppKeyStorage: Ed25519KeyIdentityValueStorageWrapper;
  let mockDelegationStorage: DelegationChainValueStorageWrapper;
  let mockAppKey: Ed25519KeyIdentity;
  let mockDelegationChain: DelegationChain;
  let mockDelegationIdentity: DelegationIdentity;

  beforeEach(() => {
    mockAppKey = Ed25519KeyIdentity.generate();
    mockDelegationChain = {} as DelegationChain;
    mockDelegationIdentity = {} as DelegationIdentity;

    mockAppKeyStorage = {
      find: vi.fn(),
      save: vi.fn(),
    } as unknown as Ed25519KeyIdentityValueStorageWrapper;

    mockDelegationStorage = {
      find: vi.fn(),
      remove: vi.fn(),
    } as unknown as DelegationChainValueStorageWrapper;

    vi.mocked(buildIdentity).mockResolvedValue(mockDelegationIdentity);
    vi.mocked(isAuthenticationExpiredError).mockReturnValue(false);
  });

  it('should return DelegationIdentity when both app key and delegation chain exist', async () => {
    vi.mocked(mockAppKeyStorage.find).mockResolvedValue(mockAppKey);
    vi.mocked(mockDelegationStorage.find).mockResolvedValue(
      mockDelegationChain,
    );

    const result = await buildIdentityFromStorage({
      appKeyStorage: mockAppKeyStorage,
      delegationStorage: mockDelegationStorage,
    });

    expect(result).toBe(mockDelegationIdentity);
    expect(buildIdentity).toHaveBeenCalledWith({
      appKey: mockAppKey,
      delegationChain: mockDelegationChain,
    });
  });

  it('should generate and save new app key and remove delegation chain when app key does not exist', async () => {
    vi.mocked(mockAppKeyStorage.find).mockResolvedValue(undefined);
    vi.mocked(mockDelegationStorage.find).mockResolvedValue(
      mockDelegationChain,
    );

    const result = await buildIdentityFromStorage({
      appKeyStorage: mockAppKeyStorage,
      delegationStorage: mockDelegationStorage,
    });

    expect(result).toBeUndefined();
    expect(mockAppKeyStorage.save).toHaveBeenCalled();
    expect(mockDelegationStorage.remove).toHaveBeenCalled();
  });

  it('should return undefined when delegation chain does not exist', async () => {
    vi.mocked(mockAppKeyStorage.find).mockResolvedValue(mockAppKey);
    vi.mocked(mockDelegationStorage.find).mockResolvedValue(undefined);

    const result = await buildIdentityFromStorage({
      appKeyStorage: mockAppKeyStorage,
      delegationStorage: mockDelegationStorage,
    });

    expect(result).toBeUndefined();
    expect(mockAppKeyStorage.save).not.toHaveBeenCalled();
    expect(mockDelegationStorage.remove).not.toHaveBeenCalled();
  });

  it('should remove delegation chain and return undefined when authentication is expired', async () => {
    vi.mocked(mockAppKeyStorage.find).mockResolvedValue(mockAppKey);
    vi.mocked(mockDelegationStorage.find).mockResolvedValue(
      mockDelegationChain,
    );
    vi.mocked(buildIdentity).mockRejectedValue('Authentication expired');
    vi.mocked(isAuthenticationExpiredError).mockReturnValue(true);

    const result = await buildIdentityFromStorage({
      appKeyStorage: mockAppKeyStorage,
      delegationStorage: mockDelegationStorage,
    });

    expect(result).toBeUndefined();
    expect(mockDelegationStorage.remove).toHaveBeenCalled();
  });

  it('should propagate error when non-authentication error occurs', async () => {
    vi.mocked(mockAppKeyStorage.find).mockResolvedValue(mockAppKey);
    vi.mocked(mockDelegationStorage.find).mockResolvedValue(
      mockDelegationChain,
    );
    vi.mocked(buildIdentity).mockRejectedValue('Some other error');
    vi.mocked(isAuthenticationExpiredError).mockReturnValue(false);

    await expect(
      buildIdentityFromStorage({
        appKeyStorage: mockAppKeyStorage,
        delegationStorage: mockDelegationStorage,
      }),
    ).rejects.toThrow('Some other error');
    expect(mockDelegationStorage.remove).not.toHaveBeenCalled();
  });
});
