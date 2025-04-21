import { describe, it, expect, vi } from 'vitest';
import {
  DelegationChain,
  DelegationIdentity,
  Ed25519KeyIdentity,
  ECDSAKeyIdentity,
} from '@dfinity/identity';
import { buildIdentityFromDelegation } from '../buildIdentityFromDelegation';
import { DelegationChainValueStorageWrapper } from '../../storage/DelegationChainValueStorageWrapper';
import { Ed25519KeyIdentityValueStorageWrapper } from '../../storage/Ed25519KeyIdentityValueStorageWrapper';

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

    const identity = await buildIdentityFromDelegation({
      delegation: JSON.stringify(delegationChain.toJSON()),
      delegationStorage,
      appKeyStorage,
    });

    expect(identity).toBeInstanceOf(DelegationIdentity);
    expect(delegationStorage.save).toHaveBeenCalledWith(delegationChain);
    expect(appKeyStorage.retrieve).toHaveBeenCalled();
  });

  it('should throw error when public keys do not match', async () => {
    // Create app key and a different key for delegation
    const appKey = Ed25519KeyIdentity.generate();
    const differentKey = await ECDSAKeyIdentity.generate(); // Use ECDSAKeyIdentity instead

    const appKeyStorage = {
      retrieve: vi.fn().mockResolvedValue(appKey),
    } as unknown as Ed25519KeyIdentityValueStorageWrapper;

    // Create delegation chain with appKey's public key
    const delegationKey = Ed25519KeyIdentity.generate();
    const delegationChain = await DelegationChain.create(
      delegationKey,
      differentKey.getPublicKey(), // Use appKey's public key
      new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day from now
    );
    const delegationStorage = {
      save: vi.fn().mockResolvedValue(undefined),
    } as unknown as DelegationChainValueStorageWrapper;

    await expect(
      buildIdentityFromDelegation({
        delegation: JSON.stringify(delegationChain.toJSON()),
        delegationStorage,
        appKeyStorage,
      }),
    ).rejects.toThrow('Last delegation public key does not match app key');
  });

  it('should throw error when delegation is invalid', async () => {
    const appKeyStorage = {
      retrieve: vi.fn().mockResolvedValue(Ed25519KeyIdentity.generate()),
    } as unknown as Ed25519KeyIdentityValueStorageWrapper;

    const delegationStorage = {
      save: vi.fn().mockResolvedValue(undefined),
    } as unknown as DelegationChainValueStorageWrapper;

    await expect(
      buildIdentityFromDelegation({
        delegation: 'invalid-json',
        delegationStorage,
        appKeyStorage,
      }),
    ).rejects.toThrow();
  });
});
