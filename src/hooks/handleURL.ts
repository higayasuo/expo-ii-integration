import { parseDelegationFromURL } from './parseDelegationFromURL';
import { Ed25519KeyIdentityValueStorageWrapper } from '../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../storage/DelegationChainValueStorageWrapper';
import { buildIdentityFromDelegation } from './buildIdentityFromDelegation';

type HandleURLParams = {
  url: string;
  delegationStorage: DelegationChainValueStorageWrapper;
  appKeyStorage: Ed25519KeyIdentityValueStorageWrapper;
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
  onSuccess,
  onError,
}: HandleURLParams): Promise<void> => {
  try {
    const delegation = parseDelegationFromURL(url);
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
