import { toHex } from '@dfinity/agent';
import { Ed25519KeyIdentityValueStorageWrapper } from '../storage/Ed25519KeyIdentityValueStorageWrapper';
import { RedirectPathStorage } from '../storage/RedirectPathStorage';
import { buildIIIntegrationURL } from './buildIIIntegrationURL';
import { openBrowser } from './openBrowser';
import { LoginOuterParams } from '../types';
import { saveRedirectPath } from './saveRedirectPath';
import { Ed25519KeyIdentity } from '@dfinity/identity';
/**
 * Represents the parameters required for the login function.
 * @property {string} localIPAddress - The local IP address.
 * @property {string} dfxNetwork - The DFX network.
 * @property {string | undefined} easDeepLinkType - The EAS deep link type.
 * @property {string} deepLink - The deep link.
 * @property {string} frontendCanisterId - The frontend canister ID.
 * @property {string} iiIntegrationCanisterId - The II integration canister ID.
 * @property {string} authPath - The authentication path.
 * @property {Ed25519KeyIdentityValueStorageWrapper} appKeyStorage - The storage wrapper for app key.
 * @property {RedirectPathStorage} redirectPathStorage - The storage wrapper for redirect path.
 * @property {string} currentPath - The current path.
 * @property {LoginOuterParams} loginOuterParams - The outer parameters for the login function.
 */
type LoginParams = {
  localIPAddress: string;
  dfxNetwork: string;
  easDeepLinkType: string | undefined;
  deepLink: string;
  frontendCanisterId: string;
  iiIntegrationCanisterId: string;
  appKeyStorage: Ed25519KeyIdentityValueStorageWrapper;
  redirectPathStorage: RedirectPathStorage;
  currentPath: string;
  loginOuterParams: LoginOuterParams;
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
  localIPAddress,
  dfxNetwork,
  easDeepLinkType,
  deepLink,
  frontendCanisterId,
  iiIntegrationCanisterId,
  appKeyStorage,
  redirectPathStorage,
  currentPath,
  loginOuterParams,
}: LoginParams): Promise<void> => {
  try {
    console.log('Logging in');

    saveRedirectPath({
      loginOuterParams,
      currentPath,
      redirectPathStorage,
    });

    const appKey = await Ed25519KeyIdentity.generate();
    await appKeyStorage.save(appKey);
    const pubkey = toHex(appKey.getPublicKey().toDer());

    const iiIntegrationURL = buildIIIntegrationURL({
      pubkey,
      localIPAddress,
      dfxNetwork,
      easDeepLinkType,
      deepLink,
      frontendCanisterId,
      iiIntegrationCanisterId,
    });

    await openBrowser(iiIntegrationURL);
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
