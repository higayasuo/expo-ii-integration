import { parseDelegationFromURL } from './parseDelegationFromURL';
import { buildIdentityFromDelegation } from './buildIdentityFromDelegation';
import { StringValueStorageWrapper } from 'expo-storage-universal';
import { Ed25519KeyIdentityValueStorageWrapper } from '../../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../../storage/DelegationChainValueStorageWrapper';
/**
 * Represents the parameters required for handling a URL.
 *
 * @property {string} url - The URL to be handled.
 * @property {DelegationStorage} delegationStorage - The storage wrapper for delegation chain values.
 * @property {AppKeyStorage} appKeyStorage - The storage wrapper for Ed25519 key identity values.
 * @property {SessionIdStorage} sessionIdStorage - The storage for session IDs.
 * @property {() => void} onSuccess - The callback function to be executed on successful URL handling.
 * @property {(error: unknown) => void} onError - The callback function to be executed on error during URL handling.
 */
type HandleURLParams = {
  url: string;
  delegationStorage: DelegationChainValueStorageWrapper;
  appKeyStorage: Ed25519KeyIdentityValueStorageWrapper;
  sessionIdStorage: StringValueStorageWrapper;
  onSuccess: () => void;
  onError: (error: unknown) => void;
};

/**
 * Handles URL processing and delegation setup.
 * @param params - Parameters for URL handling
 */
export const handleURL = async ({
  url,
  delegationStorage,
  appKeyStorage,
  sessionIdStorage,
  onSuccess,
  onError,
}: HandleURLParams): Promise<void> => {
  try {
    const sessionId = await sessionIdStorage.find();

    if (!sessionId) {
      console.log('No session ID found');
      return;
    }

    const delegation = parseDelegationFromURL({
      url,
      sessionId,
    });
    console.log('Delegation from URL:', delegation ? 'present' : 'not present');

    if (delegation) {
      await buildIdentityFromDelegation({
        delegation,
        delegationStorage,
        appKeyStorage,
      });

      console.log('Authenticated from delegation');
      onSuccess();
    }
  } catch (error) {
    console.error('Failed to handle URL:', error);
    onError(error);
  }
};
