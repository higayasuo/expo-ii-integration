import { useState, useEffect } from 'react';
import { toHex } from '@dfinity/agent';
import { DelegationIdentity } from '@dfinity/identity';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { usePathname, useRouter } from 'expo-router';

import { buildIIIntegrationURL } from './buildIIIntegrationURL';
import { initialize } from './initialize';
import { handleURL } from './handleURL';
import { Storage } from 'expo-storage-universal';
import { AppKeyStorage } from '../storage/AppKeyStorage';
import { DelegationStorage } from '../storage/DelegationStorage';
import { RedirectPathStorage } from '../storage/RedirectPathStorage';

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
  authPath: string;
  secureStorage: Storage;
  regularStorage: Storage;
  platform: string;
};

/**
 * Represents the arguments for the login function.
 * @property redirectPath - The path to redirect to after login, if any
 */
type LoginArgs = {
  redirectPath?: string;
};

/**
 * Hook for managing II integration.
 *
 * This hook initializes the II integration process, handles URL changes for login callbacks,
 * and provides functions for logging in and out. It also manages the redirect path after login.
 *
 * @param {UseIIIntegrationParams} params - The parameters required for the II integration.
 * @returns An object containing the current identity, authentication status, login function, logout function, and any authentication error.
 */
export function useIIIntegration({
  localIPAddress,
  dfxNetwork,
  easDeepLinkType,
  deepLink,
  frontendCanisterId,
  iiIntegrationCanisterId,
  authPath,
  secureStorage,
  regularStorage,
  platform,
}: UseIIIntegrationParams) {
  const url = Linking.useURL();
  const router = useRouter();
  const [identity, setIdentity] = useState<DelegationIdentity | undefined>(
    undefined,
  );
  const [authError, setAuthError] = useState<unknown | undefined>(undefined);

  // Login path management
  const currentPath = usePathname();

  const appKeyStorage = new AppKeyStorage(secureStorage);
  const delegationStorage = new DelegationStorage(secureStorage);
  const redirectPathStorage = new RedirectPathStorage(regularStorage);

  useEffect(() => {
    initialize({
      appKeyStorage,
      delegationStorage,
      onSuccess: setIdentity,
      onError: setAuthError,
    });
  }, []);

  // Handle URL changes for login callback
  useEffect(() => {
    if (identity || !url) {
      return;
    }

    const dismissBrowser = () => {
      if (platform === 'ios') {
        WebBrowser.dismissBrowser();
      }
    };

    handleURL({
      url,
      authPath,
      delegationStorage,
      appKeyStorage,
      onSuccess: async (id: DelegationIdentity) => {
        setIdentity(id);
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

  const saveRedirectPath = async (args: LoginArgs) => {
    if (args.hasOwnProperty('redirectPath')) {
      if (args.redirectPath) {
        await redirectPathStorage.save(args.redirectPath);
      } else {
        await redirectPathStorage.remove();
      }
    } else {
      await redirectPathStorage.save(currentPath);
    }
  };

  const login = async (args: LoginArgs = {}) => {
    try {
      console.log('Logging in');
      await saveRedirectPath(args);

      const appKey = await appKeyStorage.retrieve();
      const pubkey = toHex(appKey.getPublicKey().toDer());

      const iiIntegrationURL = buildIIIntegrationURL({
        pubkey,
        localIPAddress,
        dfxNetwork,
        easDeepLinkType,
        deepLink,
        frontendCanisterId,
        iiIntegrationCanisterId,
        authPath,
      });

      await WebBrowser.openBrowserAsync(iiIntegrationURL, {
        windowName: '_self',
      });
    } catch (error) {
      console.error('Login failed:', error);
      setAuthError(error);
    }
  };

  const logout = async () => {
    console.log('Logging out');
    try {
      await delegationStorage.remove();
      setIdentity(undefined);
      console.log('identity set to undefined after logout');
    } catch (error) {
      setAuthError(error);
    }
  };

  return {
    identity,
    isAuthenticated: !!identity,
    login,
    logout,
    authError,
  };
}
