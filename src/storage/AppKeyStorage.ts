import { Ed25519KeyIdentityValueStorageWrapper } from './Ed25519KeyIdentityValueStorageWrapper';
import { Storage } from 'expo-storage-universal';

/**
 * Storage key for the app's Ed25519KeyIdentity.
 */
const APP_KEY_KEY = 'appKey';

/**
 * Specialized storage wrapper for the application's Ed25519KeyIdentity.
 * Provides a dedicated storage location for the app's key identity.
 */
export class AppKeyStorage extends Ed25519KeyIdentityValueStorageWrapper {
  /**
   * Creates a new instance of AppKeyStorage.
   * @param storage - The storage implementation to use
   */
  constructor(storage: Storage) {
    super(storage, APP_KEY_KEY);
  }
}
