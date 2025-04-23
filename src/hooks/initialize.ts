import { DelegationIdentity } from '@dfinity/identity';
import { Ed25519KeyIdentityValueStorageWrapper } from '../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../storage/DelegationChainValueStorageWrapper';
import { buildIdentityFromStorage } from './buildIdentityFromStorage';

/**
 * Parameters for the initialize function.
 */
type InitializeParams = {
  appKeyStorage: Ed25519KeyIdentityValueStorageWrapper;
  delegationStorage: DelegationChainValueStorageWrapper;
  onSuccess: (identity: DelegationIdentity) => void;
  onError: (error: unknown) => void;
  onFinally: () => void;
};

/**
 * Initializes the application by building an identity from storage.
 * @param params - The parameters for initialization
 */
export const initialize = async ({
  appKeyStorage,
  delegationStorage,
  onSuccess,
  onError,
  onFinally,
}: InitializeParams): Promise<void> => {
  try {
    const id = await buildIdentityFromStorage({
      appKeyStorage,
      delegationStorage,
    });

    if (id) {
      onSuccess(id);
    }
  } catch (error) {
    onError(error);
  } finally {
    onFinally();
  }
};
