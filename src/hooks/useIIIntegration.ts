import { useState, useEffect } from 'react';
import * as Linking from 'expo-linking';
import { router, usePathname } from 'expo-router';

import { initialize } from './initialize';
import { handleURL } from './handleURL';
import { Storage } from 'expo-storage-universal';
import { AppKeyStorage } from '../storage/AppKeyStorage';
import { DelegationStorage } from '../storage/DelegationStorage';
import { RedirectPathStorage } from '../storage/RedirectPathStorage';
import { getIdentity } from './getIdentity';
import { login } from './login';
import { LoginOuterParams } from '../types';
import { logout } from './logout';
import { IIIntegrationType } from '../types';
import { dismissBrowser } from './dismissBrowser';
/**
 * Represents the parameters required for the II integration.
 * @property {string} localIPAddress - The local IP address.
 * @property {string} dfxNetwork - The DFX network.
 * @property {string | undefined} easDeepLinkType - The EAS deep link type.
 * @property {string} deepLink - The deep link.
 * @property {string} frontendCanisterId - The frontend canister ID.
 * @property {string} iiIntegrationCanisterId - The II integration canister ID.
 * @property {string} authPath - The authentication path.
 * @property {Storage} secureStorage - The secure storage.
 * @property {Storage} regularStorage - The regular storage.
 * @property {string} platform - The platform.
 */
type UseIIIntegrationParams = {
  localIPAddress: string;
  dfxNetwork: string;
  easDeepLinkType: string | undefined;
  deepLink: string;
  frontendCanisterId: string;
  iiIntegrationCanisterId: string;
  secureStorage: Storage;
  regularStorage: Storage;
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
}: UseIIIntegrationParams): IIIntegrationType => {
  const url = Linking.useURL();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<unknown | undefined>(undefined);

  // Login path management
  const currentPath = usePathname();

  const appKeyStorage = new AppKeyStorage(secureStorage);
  const delegationStorage = new DelegationStorage(secureStorage);
  const redirectPathStorage = new RedirectPathStorage(regularStorage);

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
      onSuccess: async () => {
        setIsAuthenticated(true);
        const path = await redirectPathStorage.find();

        if (path) {
          router.replace(path);
          // Small delay to ensure navigation starts
          setTimeout(() => {
            dismissBrowser();
          }, 500);
        } else {
          dismissBrowser();
        }
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
        currentPath,
        loginOuterParams,
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
