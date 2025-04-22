import { Storage, StorageWrapper } from 'expo-storage-universal';
import { DelegationChain } from '@dfinity/identity';

/**
 * A storage wrapper implementation for DelegationChain that handles serialization, deserialization, and validation.
 * This wrapper provides a type-safe way to store and retrieve DelegationChain instances in a storage system,
 * with automatic validation of delegation chains to ensure they are still valid.
 */
export class DelegationChainValueStorageWrapper
  implements StorageWrapper<DelegationChain>
{
  private storage: Storage;
  private key: string;

  /**
   * Creates a new instance of DelegationChainValueStorageWrapper.
   * @param storage - The storage implementation to use for persistence
   * @param key - The key under which the DelegationChain will be stored
   */
  constructor(storage: Storage, key: string) {
    this.storage = storage;
    this.key = key;
  }

  /**
   * Attempts to find and retrieve a DelegationChain from storage.
   * If the stored delegation chain is invalid, it will be automatically removed from storage.
   * @returns A Promise that resolves to the found DelegationChain or undefined if not found or invalid
   */
  async find(): Promise<DelegationChain | undefined> {
    const storedValue = await this.storage.find(this.key);

    if (!storedValue) {
      return undefined;
    }

    return DelegationChain.fromJSON(storedValue);
  }

  /**
   * Retrieves a DelegationChain from storage, throwing an error if not found or invalid.
   * @returns A Promise that resolves to the found and valid DelegationChain
   * @throws {Error} If no valid DelegationChain is found for the configured key
   */
  async retrieve(): Promise<DelegationChain> {
    const value = await this.find();

    if (!value) {
      throw new Error(`No value found for key ${this.key}`);
    }

    return value;
  }

  /**
   * Saves a DelegationChain to storage.
   * @param value - The DelegationChain to save
   * @returns A Promise that resolves when the save operation is complete
   */
  async save(value: DelegationChain): Promise<void> {
    return this.storage.save(this.key, JSON.stringify(value.toJSON()));
  }

  /**
   * Removes the stored DelegationChain from storage.
   * @returns A Promise that resolves when the removal operation is complete
   */
  async remove(): Promise<void> {
    return this.storage.remove(this.key);
  }
}
