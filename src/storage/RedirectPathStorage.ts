import { Storage, StringValueStorageWrapper } from 'expo-storage-universal';

/**
 * Storage key for the app's redirect path.
 */
const REDIRECT_PATH_KEY = 'redirectPath';

/**
 * Specialized storage wrapper for the application's redirect path.
 * Provides a dedicated storage location for the app's redirect path.
 */
export class RedirectPathStorage extends StringValueStorageWrapper {
  /**
   * Creates a new instance of RedirectPathStorage.
   * @param storage - The storage implementation to use
   */
  constructor(storage: Storage) {
    super(storage, REDIRECT_PATH_KEY);
  }
}
