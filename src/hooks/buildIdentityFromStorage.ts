import { DelegationIdentity, Ed25519KeyIdentity } from '@dfinity/identity';

import { DelegationChainValueStorageWrapper } from '../storage/DelegationChainValueStorageWrapper';
import { Ed25519KeyIdentityValueStorageWrapper } from '../storage/Ed25519KeyIdentityValueStorageWrapper';
import {
  buildIdentity,
  isAuthenticationExpiredError,
} from 'expo-icp-frontend-helpers';

/**
 * Represents the arguments required to build an identity from storage.
 * @property {DelegationChainValueStorageWrapper} delegationStorage - The storage wrapper for the delegation chain.
 * @property {Ed25519KeyIdentityValueStorageWrapper} appKeyStorage - The storage wrapper for the app key.
 */
type BuildIdentityFromStorageArgs = {
  delegationStorage: DelegationChainValueStorageWrapper;
  appKeyStorage: Ed25519KeyIdentityValueStorageWrapper;
};

/**
 * Builds a DelegationIdentity from storage.
 *
 * This function retrieves the app key and delegation chain from their respective storage wrappers.
 * If both are found, it builds and returns a DelegationIdentity. If the app key is not found,
 * it generates a new one, saves it, and removes any existing delegation chain.
 *
 * @param {BuildIdentityFromStorageArgs} args - The arguments required to build the identity.
 * @returns {Promise<DelegationIdentity | undefined>} A promise that resolves to the constructed DelegationIdentity or undefined if the app key is not found.
 */
export const buildIdentityFromStorage = async ({
  appKeyStorage,
  delegationStorage,
}: BuildIdentityFromStorageArgs): Promise<DelegationIdentity | undefined> => {
  const appKey = await appKeyStorage.find();
  const delegationChain = await delegationStorage.find();

  if (appKey && delegationChain) {
    try {
      const identity = await buildIdentity({
        appKey,
        delegationChain,
      });

      return identity;
    } catch (error) {
      if (isAuthenticationExpiredError(error)) {
        await delegationStorage.remove();
        console.log('Authentication expired, removing delegation chain');
        return undefined;
      }

      throw error;
    }
  } else if (!appKey) {
    const appKey = Ed25519KeyIdentity.generate();
    await appKeyStorage.save(appKey);
    await delegationStorage.remove();
  }

  return undefined;
};
