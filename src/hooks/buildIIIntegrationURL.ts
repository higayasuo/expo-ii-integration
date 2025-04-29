import { CanisterManager } from 'canister-manager';
import { getDeepLinkType } from 'expo-icp-frontend-helpers';

/**
 * Represents the arguments required to build an II Integration URL.
 * @property {string} pubkey - The public key to be used in the URL.
 * @property {string} localIPAddress - The local IP address to be used for the CanisterManager.
 * @property {string} dfxNetwork - The DFX network to be used for the CanisterManager.
 * @property {string | undefined} easDeepLinkType - The EAS deep link type, if any.
 * @property {string} deepLink - The deep link to be used for determining the deep link type.
 * @property {string} frontendCanisterId - The frontend canister ID to be used for determining the deep link type.
 * @property {string} iiIntegrationCanisterId - The II Integration canister ID to be used for building the URL.
 * @property {string} authPath - The II Integration path to be used for building the URL.
 */
type BuildIIIntegrationURLArgs = {
  pubkey: string;
  localIPAddress: string;
  dfxNetwork: string;
  easDeepLinkType: string | undefined;
  deepLink: string;
  frontendCanisterId: string;
  iiIntegrationCanisterId: string;
  authPath: string;
};

/**
 * Builds and returns the II Integration URL based on the provided arguments.
 *
 * This function constructs a CanisterManager instance using the provided dfxNetwork and localIPAddress.
 * It then uses the CanisterManager to get the URL for the II Integration canister.
 * The function also determines the deep link type based on the provided easDeepLinkType, deepLink, and frontendCanisterId.
 * Finally, it sets the pubkey and deep-link-type as query parameters in the URL and returns the constructed URL.
 *
 * @param {BuildIIIntegrationURLArgs} args - The arguments required to build the II Integration URL.
 * @returns {string} The constructed II Integration URL.
 */
export const buildIIIntegrationURL = ({
  pubkey,
  localIPAddress,
  dfxNetwork,
  easDeepLinkType,
  deepLink,
  frontendCanisterId,
  iiIntegrationCanisterId,
  authPath,
}: BuildIIIntegrationURLArgs): string => {
  const canisterManager = new CanisterManager({
    dfxNetwork,
    localIPAddress,
  });
  const iiIntegrationURL = canisterManager.getFrontendCanisterURL(
    iiIntegrationCanisterId,
  );
  const url = new URL(iiIntegrationURL);
  url.pathname = authPath;

  const deepLinkType = getDeepLinkType({
    easDeepLinkType,
    deepLink,
    frontendCanisterId,
  });

  url.searchParams.set('pubkey', pubkey);
  url.searchParams.set('deep-link-type', deepLinkType);

  return url.toString();
};
