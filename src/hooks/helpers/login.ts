import { toHex } from '@dfinity/agent';
import { StringValueStorageWrapper } from 'expo-storage-universal';
import { openBrowser } from './openBrowser';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { CryptoModule } from 'expo-crypto-universal';
import { Ed25519KeyIdentityValueStorageWrapper } from '../../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DeepLinkType, updateParams } from 'expo-icp-frontend-helpers';

type LoginParams = {
  iiIntegrationUrl: string;
  deepLinkType: DeepLinkType;
  redirectPath: string | undefined;
  appKeyStorage: Ed25519KeyIdentityValueStorageWrapper;
  redirectPathStorage: StringValueStorageWrapper;
  sessionIdStorage: StringValueStorageWrapper;
  cryptoModule: CryptoModule;
};

/**
 * Handles the login process for II integration.
 *
 * This function saves the redirect path, retrieves the app key, builds the II integration URL,
 * and opens the browser for authentication.
 *
 * @param {LoginParams} params - The parameters required for login.
 * @returns {Promise<void>} A promise that resolves when the login process is complete.
 */
export const login = async ({
  iiIntegrationUrl,
  deepLinkType,
  redirectPath,
  appKeyStorage,
  redirectPathStorage,
  sessionIdStorage,
  cryptoModule,
}: LoginParams): Promise<void> => {
  try {
    console.log('Logging in');

    if (redirectPath) {
      await redirectPathStorage.save(redirectPath);
    } else {
      await redirectPathStorage.remove();
    }

    const appKey = await Ed25519KeyIdentity.generate();
    await appKeyStorage.save(appKey);
    const pubkey = toHex(appKey.getPublicKey().toDer());
    const sessionId = toHex((await cryptoModule.getRandomBytes(32)).buffer);
    await sessionIdStorage.save(sessionId);

    const url = new URL(iiIntegrationUrl);
    updateParams(url.searchParams, {
      pubkey,
      deepLinkType,
      sessionId,
    });

    await openBrowser(url.toString());
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
