import { AnonymousIdentity, Identity } from '@dfinity/agent';
import { Ed25519KeyIdentityValueStorageWrapper } from '../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../storage/DelegationChainValueStorageWrapper';
import { buildIdentityFromStorage } from './buildIdentityFromStorage';

/**
 * Represents the parameters required to get the identity.
 * @property {Ed25519KeyIdentityValueStorageWrapper} appKeyStorage - The storage wrapper for app key.
 * @property {DelegationChainValueStorageWrapper} delegationStorage - The storage wrapper for delegation chain.
 * @property {(error: unknown) => void} onError - The callback function to handle errors.
 */
type GetIdentityParams = {
  appKeyStorage: Ed25519KeyIdentityValueStorageWrapper;
  delegationStorage: DelegationChainValueStorageWrapper;
  onError: (error: unknown) => void;
};

/**
 * Asynchronously retrieves the identity from storage.
 *
 * This function attempts to build an identity from the provided storage wrappers. If successful, it returns the identity. If not, it returns an AnonymousIdentity. In case of an error, it calls the onError callback and throws the error.
 *
 * @param {GetIdentityParams} params - The parameters required to get the identity.
 * @returns {Promise<Identity>} A promise that resolves to the identity or throws an error if an error occurs.
 */
export const getIdentity = async ({
  appKeyStorage,
  delegationStorage,
  onError,
}: GetIdentityParams): Promise<Identity> => {
  try {
    const id = await buildIdentityFromStorage({
      appKeyStorage,
      delegationStorage,
    });

    if (!id) {
      return new AnonymousIdentity();
    }

    return id;
  } catch (error) {
    console.error('Get identity failed:', error);
    onError(error);
    throw error;
  }
};
