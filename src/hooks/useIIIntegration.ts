import { useState, useEffect, useRef } from 'react';
import { toHex } from '@dfinity/agent';
import { DelegationIdentity } from '@dfinity/identity';
import * as WebBrowser from 'expo-web-browser';
import { useURL } from 'expo-linking';
import { usePathname, useRouter } from 'expo-router';

import { Ed25519KeyIdentityValueStorageWrapper } from '../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../storage/DelegationChainValueStorageWrapper';

import { buildIIIntegrationURL } from './buildIIIntegrationURL';
import { initialize } from './initialize';
import { handleURL } from './handleURL';
import { getLoginInternal } from './loginInternal';

/**
 * Represents the parameters required for the useIIIntegration hook.
 * @property localIPAddress - The local IP address for the integration
 * @property dfxNetwork - The DFX network to use for the integration
 * @property easDeepLinkType - The type of deep link to use for the integration, if any
 * @property deepLink - The deep link URL for the integration
 * @property frontendCanisterId - The canister ID for the frontend
 * @property iiIntegrationCanisterId - The canister ID for the II integration
 * @property appKeyStorage - The storage wrapper for the app key
 * @property delegationStorage - The storage wrapper for the delegation chain
 * @property platform - The platform on which the integration is happening
 */
type UseIIIntegrationParams = {
  localIPAddress: string;
  dfxNetwork: string;
  easDeepLinkType: string | undefined;
  deepLink: string;
  frontendCanisterId: string;
  iiIntegrationCanisterId: string;
  appKeyStorage: Ed25519KeyIdentityValueStorageWrapper;
  delegationStorage: DelegationChainValueStorageWrapper;
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
 * @param params - The parameters required for the II integration
 * @returns An object containing the current identity, readiness state, authentication state, login function, logout function, and authentication error
 */
export function useIIIntegration({
  localIPAddress,
  dfxNetwork,
  easDeepLinkType,
  deepLink,
  frontendCanisterId,
  iiIntegrationCanisterId,
  appKeyStorage,
  delegationStorage,
  platform,
}: UseIIIntegrationParams) {
  const url = useURL();
  const router = useRouter();
  const [identity, setIdentity] = useState<DelegationIdentity | undefined>(
    undefined,
  );
  const [authError, setAuthError] = useState<unknown | undefined>(undefined);
  const [isReady, setIsReady] = useState(false);

  // Login path management
  const currentPath = usePathname();
  const redirectPathRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    initialize({
      appKeyStorage,
      delegationStorage,
      onSuccess: setIdentity,
      onError: setAuthError,
      onFinally: () => {
        setIsReady(true);
      },
    });
  }, []);

  // Handle URL changes for login callback
  useEffect(() => {
    if (identity || !url) {
      return;
    }

    handleURL({
      url,
      delegationStorage,
      appKeyStorage,
      onSuccess: (id: DelegationIdentity) => {
        setIdentity(id);
        WebBrowser.dismissBrowser();
        const path = redirectPathRef.current;
        if (path) {
          router.replace(path);
        }
      },
      onError: setAuthError,
    });
  }, [url]);

  const loginInternal = getLoginInternal({
    platform,
    appKeyStorage,
    delegationStorage,
    onSuccess: setIdentity,
    onError: setAuthError,
  });

  const login = async (args: LoginArgs = {}) => {
    try {
      console.log('Logging in');

      if (args.hasOwnProperty('redirectPath')) {
        redirectPathRef.current = args.redirectPath;
      } else {
        redirectPathRef.current = currentPath;
      }

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
      });

      await loginInternal(iiIntegrationURL);
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
    isReady,
    isAuthenticated: !!identity,
    login,
    logout,
    authError,
  };
}
