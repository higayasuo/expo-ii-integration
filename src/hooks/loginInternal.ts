import { DelegationIdentity } from '@dfinity/identity';
import { DelegationChainValueStorageWrapper } from '../storage/DelegationChainValueStorageWrapper';
import { Ed25519KeyIdentityValueStorageWrapper } from '../storage/Ed25519KeyIdentityValueStorageWrapper';
import { setupIdentityFromDelegation } from './setupIdentityFromDelegation';
import { IIIntegrationMessenger } from '../messengers/IIIntegrationMessenger';
import * as WebBrowser from 'expo-web-browser';

/**
 * Represents a function that initiates the login process internally.
 * @param iiIntegrationURL - The URL for IIIntegration
 * @returns A promise that resolves when the login process is complete
 */
export type LoginInternal = (iiIntegrationURL: string) => Promise<void>;

/**
 * Parameters for getting the login internal function.
 * @property platform - The platform on which the login is happening
 * @property appKeyStorage - Storage for app key
 * @property delegationStorage - Storage for delegation chain
 * @property onSuccess - Callback for successful login
 * @property onError - Callback for login error
 */
export type GetLoginInternalParams = {
  platform: string;
  appKeyStorage: Ed25519KeyIdentityValueStorageWrapper;
  delegationStorage: DelegationChainValueStorageWrapper;
  onSuccess: (id: DelegationIdentity) => void;
  onError: (error: unknown) => void;
};

/**
 * Returns a function that initiates the login process internally based on the platform.
 * @param params - Parameters for getting the login internal function
 * @returns A function that initiates the login process
 */
export const getLoginInternal = ({
  platform,
  appKeyStorage,
  delegationStorage,
  onSuccess,
  onError,
}: GetLoginInternalParams): LoginInternal => {
  if (platform === 'web') {
    return async (iiIntegrationURL: string) => {
      const messenger = new IIIntegrationMessenger();
      messenger.on('success', async (response) => {
        console.log('IIIntegration success');
        await setupIdentityFromDelegation({
          delegation: response.delegation,
          delegationStorage,
          appKeyStorage,
          onSuccess: (id) => {
            onSuccess(id);
            messenger.close();
          },
          onError,
        });
      });

      await messenger.open({
        url: iiIntegrationURL,
      });
    };
  }

  return async (iiIntegrationURL: string) => {
    await WebBrowser.openBrowserAsync(iiIntegrationURL);
  };
};
