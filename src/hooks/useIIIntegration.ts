import { useState, useEffect, useRef, useCallback } from 'react';
import { toHex } from '@dfinity/agent';
import {
  DelegationChain,
  DelegationIdentity,
  Ed25519KeyIdentity,
} from '@dfinity/identity';
import * as WebBrowser from 'expo-web-browser';
import { useURL } from 'expo-linking';
import { usePathname } from 'expo-router';

import { CanisterManager } from 'canister-manager';

import { IIIntegrationMessenger } from '../messengers/IIIntegrationMessenger';
import { Ed25519KeyIdentityValueStorageWrapper } from '../storage/Ed25519KeyIdentityValueStorageWrapper';
import { DelegationChainValueStorageWrapper } from '../storage/DelegationChainValueStorageWrapper';
import { getDeepLinkType } from '../utils/getDeepLinkType';
import { arrayBufferEquals } from '../utils/arrayBufferEquals';

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
  const [identity, setIdentity] = useState<DelegationIdentity | undefined>(
    undefined,
  );
  const [authError, setAuthError] = useState<unknown | undefined>(undefined);
  const iiIntegrationMessengerRef = useRef<IIIntegrationMessenger | undefined>(
    undefined,
  );

  // Login path management
  const currentPath = usePathname();
  const pathWhenLoginRef = useRef<string | undefined>(undefined);

  const savePathWhenLogin = useCallback(() => {
    console.log('Saving path when login:', currentPath);

    if (!currentPath) {
      return;
    }

    pathWhenLoginRef.current = currentPath;
  }, [currentPath]);

  const clearPathWhenLogin = useCallback(() => {
    console.log('Clearing path when login:', pathWhenLoginRef.current);

    pathWhenLoginRef.current = undefined;
  }, []);

  // Initialize auth state
  useEffect(() => {
    if (isReady) {
      console.log('skipping first useEffect');
      return;
    }

    if (identity) {
      console.log('skipping first useEffect because identity is already set');
      return;
    }

    (async () => {
      try {
        const appKey = await appKeyStorage.find();
        const delegation = await delegationStorage.find();

        if (appKey && delegation) {
          const identity = DelegationIdentity.fromDelegation(
            appKey,
            delegation,
          );
          setIdentity(identity);
        } else if (!appKey) {
          const appKey = Ed25519KeyIdentity.generate();
          await appKeyStorage.save(appKey);
          await delegationStorage.remove();
        }
      } catch (error) {
        setAuthError(error);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const setupIdentityFromDelegation = async (delegation: string) => {
    console.log('Processing delegation');
    const delegationChain = DelegationChain.fromJSON(delegation);
    await delegationStorage.save(delegationChain);
    const appKey = await appKeyStorage.retrieve();

    // Get the last delegation's public key from the chain and compare
    const delegations = delegationChain.delegations;
    const lastDelegation = delegations[delegations.length - 1];

    if (
      !arrayBufferEquals(
        lastDelegation.delegation.pubkey,
        appKey.getPublicKey().toDer(),
      )
    ) {
      throw new Error('Last delegation public key does not match app key');
    }

    const id = DelegationIdentity.fromDelegation(appKey, delegationChain);
    setIdentity(id);
    console.log('identity set from delegation');
  };

  // Handle URL changes for login callback
  useEffect(() => {
    if (identity || !url) {
      return;
    }

    const search = new URLSearchParams(url?.split('#')[1]);
    const delegation = search.get('delegation');
    console.log('Delegation from URL:', delegation ? 'present' : 'not present');

    if (delegation) {
      (async () => {
        try {
          await setupIdentityFromDelegation(delegation);
          WebBrowser.dismissBrowser();
        } catch (error) {
          setAuthError(error);
        }
      })();
    }
  }, [url]);

  const login = async () => {
    try {
      console.log('Logging in');
      // Save the current path before login
      savePathWhenLogin();

      const appKey = await appKeyStorage.retrieve();
      const pubkey = toHex(appKey.getPublicKey().toDer());

      const canisterManager = new CanisterManager({
        dfxNetwork,
        localIPAddress,
      });

      const iiIntegrationURL = canisterManager.getFrontendCanisterURL(
        iiIntegrationCanisterId,
      );
      console.log('iiIntegrationURL', iiIntegrationURL);

      const deepLinkType = getDeepLinkType({
        easDeepLinkType,
        deepLink,
        frontendCanisterId,
      });
      console.log('deepLinkType', deepLinkType);

      const url = new URL(iiIntegrationURL);

      url.searchParams.set('pubkey', pubkey);
      url.searchParams.set('deep-link-type', deepLinkType);

      if (platform === 'web') {
        const messenger = new IIIntegrationMessenger();
        iiIntegrationMessengerRef.current = messenger;
        messenger.on('success', async (response) => {
          console.log('IIIntegration success');
          await setupIdentityFromDelegation(response.delegation);
          messenger.close();
          iiIntegrationMessengerRef.current = undefined;
        });

        await messenger.open({
          url: url.toString(),
        });
      } else {
        await WebBrowser.openBrowserAsync(url.toString());
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
    pathWhenLogin: pathWhenLoginRef.current,
    clearPathWhenLogin,
    authError,
  };
}
