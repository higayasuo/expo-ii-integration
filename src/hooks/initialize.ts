import { Ed25519KeyIdentityValueStorageWrapper } from '../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../storage/DelegationChainValueStorageWrapper';
import { Ed25519KeyIdentity } from '@dfinity/identity';

/**
 * Parameters for the initialize function.
 */
type InitializeParams = {
  appKeyStorage: Ed25519KeyIdentityValueStorageWrapper;
  delegationStorage: DelegationChainValueStorageWrapper;
  onSuccess: () => void;
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
    const appKey = await appKeyStorage.find();

    if (!appKey) {
      const key = await Ed25519KeyIdentity.generate();
      await appKeyStorage.save(key);
      console.log('Generated new app key');
      return;
    }

    const delegation = await delegationStorage.find();

    if (appKey && delegation) {
      onSuccess();
    }
  } catch (error) {
    onError(error);
  } finally {
    onFinally();
  }
};
