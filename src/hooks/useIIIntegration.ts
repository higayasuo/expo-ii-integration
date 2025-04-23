import { useState, useEffect, useRef } from 'react';
import { toHex } from '@dfinity/agent';
import { DelegationIdentity } from '@dfinity/identity';
import * as WebBrowser from 'expo-web-browser';
import { useURL } from 'expo-linking';
import { usePathname, useRouter } from 'expo-router';

import { IIIntegrationMessenger } from '../messengers/IIIntegrationMessenger';
import { Ed25519KeyIdentityValueStorageWrapper } from '../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../storage/DelegationChainValueStorageWrapper';

import { buildIdentityFromDelegation } from './buildIdentityFromDelegation';
import { buildIdentityFromStorage } from './buildIdentityFromStorage';
import { buildIIIntegrationURL } from './buildIIIntegrationURL';

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
  const [isReady, setIsReady] = useState(false);
  const url = useURL();
  const router = useRouter();
  const [identity, setIdentity] = useState<DelegationIdentity | undefined>(
    undefined,
  );
  const [authError, setAuthError] = useState<unknown | undefined>(undefined);

  // Login path management
  const currentPath = usePathname();
  const pathWhenLoginRef = useRef<string | undefined>(undefined);

  const initializeIdentity = async () => {
    try {
      const id = await buildIdentityFromStorage({
        appKeyStorage,
        delegationStorage,
      });

      if (id) {
        setIdentity(id);
      }
    } catch (error) {
      setAuthError(error);
    } finally {
      setIsReady(true);
    }
  };

  // Initialize identity from storage
  useEffect(() => {
    if (isReady) {
      console.log('skipping initialization because isReady is true');
      return;
    }

    if (identity) {
      console.log('skipping initialization because identity is already set');
      return;
    }

    initializeIdentity();
  }, []);

  const setupIdentityFromDelegation = async (delegation: string) => {
    try {
      console.log('Processing delegation');

      const id = await buildIdentityFromDelegation({
        delegation,
        delegationStorage,
        appKeyStorage,
      });
      setIdentity(id);
      console.log('identity set from delegation');
    } catch (error) {
      setAuthError(error);
    }
  };

  const handleDelegation = async (delegation: string) => {
    try {
      await setupIdentityFromDelegation(delegation);
      WebBrowser.dismissBrowser();
      const path = pathWhenLoginRef.current;

      if (path) {
        router.replace(path);
      }
    } catch (error) {
      setAuthError(error);
    }
  };

  const handleURL = (url: string) => {
    const search = new URLSearchParams(url?.split('#')[1]);
    const delegation = search.get('delegation');
    console.log('Delegation from URL:', delegation ? 'present' : 'not present');

    if (delegation) {
      handleDelegation(delegation);
    }
  };

  // Handle URL changes for login callback
  useEffect(() => {
    if (identity || !url) {
      return;
    }

    try {
      handleURL(url);
    } catch (error) {
      setAuthError(error);
    }
  }, [url]);

  const webLogin = async (iiIntegrationURL: string) => {
    const messenger = new IIIntegrationMessenger();
    messenger.on('success', async (response) => {
      console.log('IIIntegration success');
      await setupIdentityFromDelegation(response.delegation);
      messenger.close();
    });

    await messenger.open({
      url: iiIntegrationURL,
    });
  };

  const nativeLogin = async (iiIntegrationURL: string) => {
    pathWhenLoginRef.current = currentPath;
    await WebBrowser.openBrowserAsync(iiIntegrationURL);
  };

  const login = async () => {
    try {
      console.log('Logging in');

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

      if (platform === 'web') {
        await webLogin(iiIntegrationURL);
      } else {
        await nativeLogin(iiIntegrationURL);
      }
    } catch (error) {
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
