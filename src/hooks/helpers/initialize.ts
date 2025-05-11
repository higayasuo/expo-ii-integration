import { Ed25519KeyIdentityValueStorageWrapper } from '../../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../../storage/DelegationChainValueStorageWrapper';

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
