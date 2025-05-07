import { Storage, StringValueStorageWrapper } from 'expo-storage-universal';

/**
 * Storage key for the app's session ID.
 */
const SESSION_ID_KEY = 'expo-ii-integration/sessionId';

/**
 * Specialized storage wrapper for the application's session ID.
 * Provides a dedicated storage location for the app's session ID.
 */
export class SessionIdStorage extends StringValueStorageWrapper {
  /**
   * Creates a new instance of SessionIdStorage.
   * @param storage - The storage implementation to use
   */
  constructor(storage: Storage) {
    super(storage, SESSION_ID_KEY);
  }
}
