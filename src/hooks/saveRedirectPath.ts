import { StringValueStorageWrapper } from 'expo-storage-universal';

type SaveRedirectPathProps = {
  loginOuterParams: { redirectPath?: string };
  currentPath: string;
  redirectPathStorage: StringValueStorageWrapper;
};

/**
 * Asynchronously saves the redirect path.
 *
 * This function checks if a redirect path is provided in the arguments. If it is, it saves the redirect path to the storage. If not, it saves the current path to the storage.
 * If the redirect path is empty, it removes the redirect path from the storage.
 *
 * @param {SaveRedirectPathProps} props - The properties for saving the redirect path.
 * @returns {Promise<void>} A promise that resolves when the redirect path is saved or removed.
 */
export const saveRedirectPath = async ({
  loginOuterParams,
  currentPath,
  redirectPathStorage,
}: SaveRedirectPathProps): Promise<void> => {
  if (loginOuterParams.hasOwnProperty('redirectPath')) {
    if (loginOuterParams.redirectPath) {
      await redirectPathStorage.save(loginOuterParams.redirectPath);
    } else {
      await redirectPathStorage.remove();
    }
  } else {
    await redirectPathStorage.save(currentPath);
  }
};
