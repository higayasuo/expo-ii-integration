import { parseDelegationFromURL } from './parseDelegationFromURL';
import { setupIdentityFromDelegation } from './setupIdentityFromDelegation';
import { DelegationIdentity } from '@dfinity/identity';
import { Ed25519KeyIdentityValueStorageWrapper } from '../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../storage/DelegationChainValueStorageWrapper';

type HandleURLParams = {
  url: string;
  delegationStorage: DelegationChainValueStorageWrapper;
  appKeyStorage: Ed25519KeyIdentityValueStorageWrapper;
  onSuccess: (identity: DelegationIdentity) => void;
  onError: (error: unknown) => void;
};

/**
 * Handles URL processing and delegation setup.
 * @param params - Parameters for URL handling
 */
export async function handleURL({
  url,
  delegationStorage,
  appKeyStorage,
  onSuccess,
  onError,
}: HandleURLParams): Promise<void> {
  try {
    const delegation = parseDelegationFromURL(url);
    console.log('Delegation from URL:', delegation ? 'present' : 'not present');

    if (delegation) {
      await setupIdentityFromDelegation({
        delegation,
        delegationStorage,
        appKeyStorage,
        onSuccess,
        onError,
      });
    }
  } catch (error) {
    console.error('Failed to handle URL:', error);
    onError(error);
  }
}
