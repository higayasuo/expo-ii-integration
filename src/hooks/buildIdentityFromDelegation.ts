import { DelegationChain, DelegationIdentity } from '@dfinity/identity';

import { DelegationChainValueStorageWrapper } from '../storage/DelegationChainValueStorageWrapper';
import { Ed25519KeyIdentityValueStorageWrapper } from '../storage/Ed25519KeyIdentityValueStorageWrapper';
import { buildIdentity } from 'expo-icp-frontend-helpers';

/**
 * Represents the arguments required to build an identity from a delegation.
 * @property {string} delegation - The delegation chain as a JSON string.
 * @property {DelegationChainValueStorageWrapper} delegationStorage - The storage wrapper for the delegation chain.
 * @property {Ed25519KeyIdentityValueStorageWrapper} appKeyStorage - The storage wrapper for the app key.
 */
type BuildIdentityFromDelegationArgs = {
  delegation: string;
  delegationStorage: DelegationChainValueStorageWrapper;
  appKeyStorage: Ed25519KeyIdentityValueStorageWrapper;
};

/**
 * Builds a DelegationIdentity from a given delegation and app key.
 *
 * This function takes a delegation chain as a JSON string, saves it to the delegation storage,
 * retrieves the app key from the app key storage, and then compares the last delegation's public key
 * with the app key. If they match, it returns a DelegationIdentity constructed from the app key and
 * the delegation chain. If they do not match, it throws an error.
 *
 * @param {BuildIdentityFromDelegationArgs} args - The arguments required to build the identity.
 * @returns {Promise<DelegationIdentity>} A promise that resolves to the constructed DelegationIdentity.
 */
export const buildIdentityFromDelegation = async ({
  delegation,
  delegationStorage,
  appKeyStorage,
}: BuildIdentityFromDelegationArgs): Promise<DelegationIdentity> => {
  const delegationChain = DelegationChain.fromJSON(delegation);
  const appKey = await appKeyStorage.retrieve();

  const id = await buildIdentity({
    appKey,
    delegationChain,
  });
  await delegationStorage.save(delegationChain);

  return id;
};
