import { DelegationIdentity } from '@dfinity/identity';
import { Ed25519KeyIdentityValueStorageWrapper } from '../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../storage/DelegationChainValueStorageWrapper';
import { buildIdentityFromDelegation } from './buildIdentityFromDelegation';

type SetupIdentityFromDelegationParams = {
  delegation: string;
  delegationStorage: DelegationChainValueStorageWrapper;
  appKeyStorage: Ed25519KeyIdentityValueStorageWrapper;
  onSuccess: (identity: DelegationIdentity) => void;
  onError: (error: unknown) => void;
};

/**
 * Sets up identity from a delegation chain.
 * @param delegation - The delegation chain string
 * @param delegationStorage - Storage for delegation chain
 * @param appKeyStorage - Storage for app key
 * @param onSuccess - Callback when identity is successfully set up
 * @param onError - Callback when an error occurs
 */
export async function setupIdentityFromDelegation({
  delegation,
  delegationStorage,
  appKeyStorage,
  onSuccess,
  onError,
}: SetupIdentityFromDelegationParams): Promise<void> {
  try {
    console.log('Processing delegation');

    const id = await buildIdentityFromDelegation({
      delegation,
      delegationStorage,
      appKeyStorage,
    });

    onSuccess(id);
    console.log('identity set from delegation');
  } catch (error) {
    onError(error);
  }
}
