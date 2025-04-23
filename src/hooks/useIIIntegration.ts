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
  const pathWhenLoginRef = useRef<string | undefined>(undefined);

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
        const path = pathWhenLoginRef.current;
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

  const login = async () => {
    try {
      console.log('Logging in');

      pathWhenLoginRef.current = currentPath;

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
