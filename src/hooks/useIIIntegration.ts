import { useState, useEffect } from 'react';
import * as Linking from 'expo-linking';
import { router, usePathname } from 'expo-router';

import { initialize } from './helpers/initialize';
import { handleURL } from './helpers/handleURL';
import { Storage } from 'expo-storage-universal';
import { Ed25519KeyIdentityValueStorageWrapper } from '../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../storage/DelegationChainValueStorageWrapper';
import { StringValueStorageWrapper } from 'expo-storage-universal';
import { getIdentity } from './helpers/getIdentity';
import { login } from './helpers/login';
import { LoginOuterParams } from '../types';
import { logout } from './helpers/logout';
import { IIIntegrationType } from '../types';
import { dismissBrowser } from './helpers/dismissBrowser';
import { CryptoModule } from 'expo-crypto-universal';

const NAMESPACE = 'expo-ii-integration';

/**
 * Parameters for the useIIIntegration hook.
 */
type UseIIIntegrationParams = {
  /**
   * The local IP address.
   */
  localIPAddress: string;
  /**
   * The DFX network.
   */
  dfxNetwork: string;
  /**
   * The EAS deep link type.
   */
  easDeepLinkType: string | undefined;
  /**
   * The deep link.
   */
  deepLink: string;
  /**
   * The frontend canister ID.
   */
  frontendCanisterId: string;
  /**
   * The II integration canister ID.
   */
  iiIntegrationCanisterId: string;
  /**
   * The secure storage.
   */
  secureStorage: Storage;
  /**
   * The regular storage.
   */
  regularStorage: Storage;
  /**
   * The crypto module.
   */
  cryptoModule: CryptoModule;
};

/**
 * Hook for managing II integration.
 *
 * This hook initializes the II integration process, handles URL changes for login callbacks,
 * and provides functions for logging in and out. It also manages the redirect path after login.
 *
 * @param {UseIIIntegrationParams} params - The parameters required for the II integration.
 * @returns {IIIntegrationType} An object containing the current identity, authentication status, login function, logout function, and any authentication error.
 */
export const useIIIntegration = ({
  localIPAddress,
  dfxNetwork,
  easDeepLinkType,
  deepLink,
  frontendCanisterId,
  iiIntegrationCanisterId,
  secureStorage,
  regularStorage,
  cryptoModule,
}: UseIIIntegrationParams): IIIntegrationType => {
  const url = Linking.useURL();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<unknown | undefined>(undefined);

  // Login path management
  const currentPath = usePathname();

  const appKeyStorage = new Ed25519KeyIdentityValueStorageWrapper(
    secureStorage,
    `${NAMESPACE}/appKey`,
  );
  const delegationStorage = new DelegationChainValueStorageWrapper(
    regularStorage,
    `${NAMESPACE}/delegation`,
  );
  const redirectPathStorage = new StringValueStorageWrapper(
    regularStorage,
    `${NAMESPACE}/redirectPath`,
  );
  const sessionIdStorage = new StringValueStorageWrapper(
    regularStorage,
    `${NAMESPACE}/sessionId`,
  );

  useEffect(() => {
    if (isAuthReady) {
      return;
    }

    initialize({
      appKeyStorage,
      delegationStorage,
      onSuccess: () => {
        setIsAuthenticated(true);
      },
      onError: setAuthError,
      onFinally: () => setIsAuthReady(true),
    });
  }, []);

  // Handle URL changes for login callback
  useEffect(() => {
    if (isAuthenticated || !url) {
      return;
    }

    handleURL({
      url,
      delegationStorage,
      appKeyStorage,
      sessionIdStorage,
      onSuccess: async () => {
        setIsAuthenticated(true);
        const path = await redirectPathStorage.find();

        if (path) {
          router.replace(path);
          // Small delay to ensure navigation starts
          // setTimeout(() => {
          //   dismissBrowser();
          // }, 500);
        }

        dismissBrowser();
      },
      onError: setAuthError,
    });
  }, [url]);

  return {
    isAuthReady,
    isAuthenticated,
    getIdentity: () =>
      getIdentity({
        appKeyStorage,
        delegationStorage,
        onError: () => setIsAuthenticated(false),
      }),
    login: (loginOuterParams: LoginOuterParams = {}) =>
      login({
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
      }),
    logout: () =>
      logout({
        delegationStorage,
        onFinally: () => setIsAuthenticated(false),
      }),
    authError,
    clearAuthError: () => setAuthError(undefined),
  };
};
