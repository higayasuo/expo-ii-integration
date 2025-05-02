import { DelegationStorage } from '../storage/DelegationStorage';

/**
 * Parameters for the logout function.
 * @property {DelegationStorage} delegationStorage - The delegation storage instance.
 * @property {() => void} onFinally - Callback function to be called after logout attempt, regardless of success or failure.
 */
type LogoutParams = {
  delegationStorage: DelegationStorage;
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
  console.log('Logging out');
  try {
    await delegationStorage.remove();
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  } finally {
    onFinally();
  }
};
