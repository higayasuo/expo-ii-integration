import { DelegationChainValueStorageWrapper } from '../../storage/DelegationChainValueStorageWrapper';

/**
 * Parameters for the logout function.
 * @property {DelegationChainValueStorageWrapper} delegationStorage - The delegation storage instance.
 * @property {() => void} onFinally - Callback function to be called after logout attempt, regardless of success or failure.
 */
type LogoutParams = {
  delegationStorage: DelegationChainValueStorageWrapper;
  onFinally: () => void;
};

/**
 * Logs out the user by removing the delegation from storage.
 * @param {LogoutParams} params - The parameters for the logout function.
 * @returns {Promise<void>}
 */
export const logout = async ({
  delegationStorage,
  onFinally,
}: LogoutParams): Promise<void> => {
  try {
    await delegationStorage.remove();
  } finally {
    onFinally();
  }
};
