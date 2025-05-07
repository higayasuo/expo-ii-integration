import { toHex } from '@dfinity/agent';
import { RedirectPathStorage } from '../storage/RedirectPathStorage';
import { buildIIIntegrationURL } from './buildIIIntegrationURL';
import { openBrowser } from './openBrowser';
import { LoginOuterParams } from '../types';
import { saveRedirectPath } from './saveRedirectPath';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { CryptoModule } from 'expo-crypto-universal';
import { SessionIdStorage } from '../storage/SessionIdStorage';
import { AppKeyStorage } from '../storage/AppKeyStorage';
/**
 * Represents the parameters required for the login function.
 * @property {string} localIPAddress - The local IP address.
 * @property {string} dfxNetwork - The DFX network.
 * @property {string | undefined} easDeepLinkType - The EAS deep link type.
 * @property {string} deepLink - The deep link.
 * @property {string} frontendCanisterId - The frontend canister ID.
 * @property {string} iiIntegrationCanisterId - The II integration canister ID.
 * @property {string} authPath - The authentication path.
 * @property {AppKeyStorage} appKeyStorage - The storage wrapper for app key.
 * @property {RedirectPathStorage} redirectPathStorage - The storage wrapper for redirect path.
 * @property {SessionIdStorage} sessionIdStorage - The storage wrapper for session ID.
 * @property {string} currentPath - The current path.
 * @property {LoginOuterParams} loginOuterParams - The outer parameters for the login function.
 * @property {CryptoModule} cryptoModule - The crypto module.
 */
type LoginParams = {
  localIPAddress: string;
  dfxNetwork: string;
  easDeepLinkType: string | undefined;
  deepLink: string;
  frontendCanisterId: string;
  iiIntegrationCanisterId: string;
  appKeyStorage: AppKeyStorage;
  redirectPathStorage: RedirectPathStorage;
  sessionIdStorage: SessionIdStorage;
  currentPath: string;
  loginOuterParams: LoginOuterParams;
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
  localIPAddress,
  dfxNetwork,
  easDeepLinkType,
  deepLink,
  frontendCanisterId,
  iiIntegrationCanisterId,
  appKeyStorage,
  redirectPathStorage,
  sessionIdStorage,
  currentPath,
  loginOuterParams,
  cryptoModule,
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
    const sessionId = toHex((await cryptoModule.getRandomBytes(32)).buffer);
    await sessionIdStorage.save(sessionId);

    const iiIntegrationURL = buildIIIntegrationURL({
      pubkey,
      localIPAddress,
      dfxNetwork,
      easDeepLinkType,
      deepLink,
      frontendCanisterId,
      iiIntegrationCanisterId,
      sessionId,
    });

    await openBrowser(iiIntegrationURL);
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
