/**
 * Arguments for determining the deep link type.
 *
 * @typedef {Object} GetDeepLinkTypeArgs
 * @property {string} [easDeepLinkType] - The optional EAS deep link type (legacy or modern).
 * @property {string} deepLink - The deep link to determine the type.
 * @property {string} frontendCanisterId - The frontend canister ID.
 */
type GetDeepLinkTypeArgs = {
  easDeepLinkType: string | undefined;
  deepLink: string;
  frontendCanisterId: string;
};

/**
 * Determines the deep link type based on the provided arguments.
 *
 * @param {GetDeepLinkTypeArgs} args - The arguments to determine the deep link type.
 * @param {string} [args.easDeepLinkType] - The optional EAS deep link type (legacy or modern).
 * @param {string} args.deepLink - The deep link to determine the type.
 * @param {string} args.frontendCanisterId - The frontend canister ID.
 * @returns {string} - The determined deep link type (legacy, modern, expo-go, dev-server, or icp).
 * @throws {Error} - Throws an error if the deep link type cannot be determined.
 */
export const getDeepLinkType = ({
  easDeepLinkType,
  deepLink,
  frontendCanisterId,
}: GetDeepLinkTypeArgs): string => {
  if (easDeepLinkType) {
    return easDeepLinkType;
  }

  if (deepLink.startsWith('exp://')) {
    return 'expo-go';
  } else if (deepLink.startsWith('http://localhost:8081')) {
    return 'dev-server';
  } else if (deepLink.includes(frontendCanisterId)) {
    return 'icp';
  }

  throw new Error(
    'Could not determine deep link type:' +
      JSON.stringify(
        { easDeepLinkType, deepLink, frontendCanisterId },
        undefined,
        2,
      ),
  );
};
