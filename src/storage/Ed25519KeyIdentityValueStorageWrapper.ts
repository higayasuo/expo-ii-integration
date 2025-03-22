import { Storage, StorageWrapper } from 'expo-storage-universal';
import { Ed25519KeyIdentity } from '@dfinity/identity';

/**
 * A storage wrapper implementation for Ed25519KeyIdentity that handles serialization and deserialization.
 * This wrapper provides a type-safe way to store and retrieve Ed25519KeyIdentity instances in a storage system.
 */
export class Ed25519KeyIdentityValueStorageWrapper
  implements StorageWrapper<Ed25519KeyIdentity>
{
  private storage: Storage;
  private key: string;

  /**
   * Creates a new instance of Ed25519KeyIdentityValueStorageWrapper.
   * @param storage - The storage implementation to use for persistence
   * @param key - The key under which the Ed25519KeyIdentity will be stored
   */
  constructor(storage: Storage, key: string) {
    this.storage = storage;
    this.key = key;
  }

  /**
   * Attempts to find and retrieve an Ed25519KeyIdentity from storage.
   * @returns A Promise that resolves to the found Ed25519KeyIdentity or undefined if not found
   */
  async find(): Promise<Ed25519KeyIdentity | undefined> {
    const storedValue = await this.storage.find(this.key);

    if (!storedValue) {
      return undefined;
    }

    return Ed25519KeyIdentity.fromJSON(storedValue);
  }

  /**
   * Retrieves an Ed25519KeyIdentity from storage, throwing an error if not found.
   * @returns A Promise that resolves to the found Ed25519KeyIdentity
   * @throws {Error} If no Ed25519KeyIdentity is found for the configured key
   */
  async retrieve(): Promise<Ed25519KeyIdentity> {
    const value = await this.find();

    if (!value) {
      throw new Error(`No value found for key ${this.key}`);
    }

    return value;
  }

  /**
   * Saves an Ed25519KeyIdentity to storage.
   * @param value - The Ed25519KeyIdentity to save
   * @returns A Promise that resolves when the save operation is complete
   */
  async save(value: Ed25519KeyIdentity): Promise<void> {
    return this.storage.save(this.key, JSON.stringify(value.toJSON()));
  }

  /**
   * Removes the stored Ed25519KeyIdentity from storage.
   * @returns A Promise that resolves when the removal operation is complete
   */
  async remove(): Promise<void> {
    return this.storage.remove(this.key);
  }
}
