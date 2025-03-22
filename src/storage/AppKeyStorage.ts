import { Ed25519KeyIdentityValueStorageWrapper } from './Ed25519KeyIdentityValueStorageWrapper';
import { Storage } from 'expo-storage-universal';

/**
 * The storage key used to identify the app's Ed25519KeyIdentity in storage.
 */
const APP_KEY_KEY = 'appKey';

/**
 * A specialized storage wrapper for managing the application's Ed25519KeyIdentity.
 * This class extends Ed25519KeyIdentityValueStorageWrapper to provide a dedicated
 * storage location for the app's key identity using a predefined storage key.
 */
export class AppKeyStorage extends Ed25519KeyIdentityValueStorageWrapper {
  /**
   * Creates a new instance of AppKeyStorage.
   * @param storage - The storage implementation to use for persistence
   */
  constructor(storage: Storage) {
    super(storage, APP_KEY_KEY);
  }
}
