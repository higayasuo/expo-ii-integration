import { describe, it, expect, vi } from 'vitest';
import {
  DelegationChain,
  DelegationIdentity,
  Ed25519KeyIdentity,
} from '@dfinity/identity';
import { buildIdentityFromDelegation } from '../buildIdentityFromDelegation';
import { DelegationChainValueStorageWrapper } from '../../storage/DelegationChainValueStorageWrapper';
import { Ed25519KeyIdentityValueStorageWrapper } from '../../storage/Ed25519KeyIdentityValueStorageWrapper';
import { buildIdentity } from 'expo-icp-frontend-helpers';

// Mock the buildIdentity function
vi.mock('expo-icp-frontend-helpers', () => ({
  buildIdentity: vi.fn(),
}));

describe('buildIdentityFromDelegation', () => {
  it('should build identity from valid delegation', async () => {
    // Create test app key
    const appKey = Ed25519KeyIdentity.generate();
    const appKeyStorage = {
      retrieve: vi.fn().mockResolvedValue(appKey),
    } as unknown as Ed25519KeyIdentityValueStorageWrapper;

    // Create test delegation chain
    const delegationKey = Ed25519KeyIdentity.generate();
    const delegationChain = await DelegationChain.create(
      delegationKey,
      appKey.getPublicKey(),
      new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day from now
    );
    const delegationStorage = {
      save: vi.fn().mockResolvedValue(undefined),
    } as unknown as DelegationChainValueStorageWrapper;

    // Mock the buildIdentity function to return a DelegationIdentity
    const mockIdentity = DelegationIdentity.fromDelegation(
      appKey,
      delegationChain,
    );
    vi.mocked(buildIdentity).mockResolvedValue(mockIdentity);

    const identity = await buildIdentityFromDelegation({
      delegation: JSON.stringify(delegationChain.toJSON()),
      delegationStorage,
      appKeyStorage,
    });

    expect(identity).toBeInstanceOf(DelegationIdentity);
    expect(delegationStorage.save).toHaveBeenCalledWith(delegationChain);
    expect(appKeyStorage.retrieve).toHaveBeenCalled();
    expect(buildIdentity).toHaveBeenCalledWith({
      appKey,
      delegationChain,
    });
  });
});
