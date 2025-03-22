import { DelegationChainValueStorageWrapper } from './DelegationChainValueStorageWrapper';
import { Storage } from 'expo-storage-universal';

/**
 * The storage key used to identify the DelegationChain in storage.
 */
const DELEGATION_KEY = 'delegation';

/**
 * A specialized storage wrapper for managing the application's DelegationChain.
 * This class extends DelegationChainValueStorageWrapper to provide a dedicated
 * storage location for the delegation chain using a predefined storage key.
 * It includes automatic validation of stored delegation chains and cleanup of invalid ones.
 */
export class DelegationStorage extends DelegationChainValueStorageWrapper {
  /**
   * Creates a new instance of DelegationStorage.
   * @param storage - The storage implementation to use for persistence
   */
  constructor(storage: Storage) {
    super(storage, DELEGATION_KEY);
  }
}
