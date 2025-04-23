import { DelegationChainValueStorageWrapper } from './DelegationChainValueStorageWrapper';
import { Storage } from 'expo-storage-universal';

/**
 * Storage key for the DelegationChain.
 */
const DELEGATION_KEY = 'delegation';

/**
 * Specialized storage wrapper for the application's DelegationChain.
 * Provides a dedicated storage location for the delegation chain.
 */
export class DelegationStorage extends DelegationChainValueStorageWrapper {
  /**
   * Creates a new instance of DelegationStorage.
   * @param storage - The storage implementation to use
   */
  constructor(storage: Storage) {
    super(storage, DELEGATION_KEY);
  }
}
