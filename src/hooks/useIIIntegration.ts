import { useState, useEffect } from 'react';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';

import { initialize } from './helpers/initialize';
import { Storage } from 'expo-storage-universal';
import { Ed25519KeyIdentityValueStorageWrapper } from '../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../storage/DelegationChainValueStorageWrapper';
import { StringValueStorageWrapper } from 'expo-storage-universal';
import { getIdentity } from './helpers/getIdentity';
import { login } from './helpers/login';
import { logout } from './helpers/logout';
import { IIIntegrationType, LoginOuterParams } from '../types';
import { dismissBrowser, handleURL } from 'expo-icp-app-connect';
import { CryptoModule } from 'expo-crypto-universal';
import { DeepLinkType } from 'expo-icp-frontend-helpers';
import { ParamsWithSessionId } from 'expo-icp-app-connect-helpers';
import { buildIdentityFromDelegation } from './helpers/buildIdentityFromDelegation';

const NAMESPACE = 'expo-ii-integration';

/**
 * Parameters for the useIIIntegration hook.
 */
type UseIIIntegrationParams = {
  /**
   * The II integration URL.
   */
  iiIntegrationUrl: URL;
  /**
   * The deep link type.
   */
  deepLinkType: DeepLinkType;
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
 * Represents the result of handling a URL.
 *
 * This type extends ParamsWithSessionId and adds a delegation property.
 *
 * @property {string} delegation - The delegation string extracted from the URL.
 */
type HandleURLResult = ParamsWithSessionId & {
  delegation: string;
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
  iiIntegrationUrl,
  deepLinkType,
  secureStorage,
  regularStorage,
  cryptoModule,
}: UseIIIntegrationParams): IIIntegrationType => {
  const url = Linking.useURL();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<unknown | undefined>(undefined);

  const appKeyStorage = new Ed25519KeyIdentityValueStorageWrapper(
    secureStorage,
    `${NAMESPACE}.appKey`,
  );
  const delegationStorage = new DelegationChainValueStorageWrapper(
    regularStorage,
    `${NAMESPACE}.delegation`,
  );
  const redirectPathStorage = new StringValueStorageWrapper(
    regularStorage,
    `${NAMESPACE}.redirectPath`,
  );
  const sessionIdStorage = new StringValueStorageWrapper(
    regularStorage,
    `${NAMESPACE}.sessionId`,
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

    handleURL<HandleURLResult>({
      url: new URL(url),
      sessionIdStorage,
      onSuccess: async ({ delegation }) => {
        await buildIdentityFromDelegation({
          delegation,
          delegationStorage,
          appKeyStorage,
        });

        console.log('Authenticated from delegation');
        setIsAuthenticated(true);
        await sessionIdStorage.remove();
        const path = await redirectPathStorage.find();

        if (path) {
          console.log('Redirecting to', path);
          await redirectPathStorage.remove();
          router.replace(path);
        }

        dismissBrowser();
      },
      onError: setAuthError,
      // onFinally: async () => {
      //   await sessionIdStorage.remove();
      //   await redirectPathStorage.remove();
      // },
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
    login: ({ redirectPath, openBrowserOptions }: LoginOuterParams = {}) =>
      login({
        iiIntegrationUrl,
        deepLinkType,
        appKeyStorage,
        redirectPath,
        redirectPathStorage,
        sessionIdStorage,
        cryptoModule,
        openBrowserOptions,
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
