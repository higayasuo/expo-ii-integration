import { parseParams } from 'expo-icp-frontend-helpers';

/**
 * Represents the hash parameters extracted from a URL.
 * @property {string | undefined} delegation - The delegation parameter from the URL's hash.
 * @property {string | undefined} 'session-id' - The session ID parameter from the URL's hash.
 */
type HashParams = {
  delegation?: string;
  sessionId?: string;
};

/**
 * Represents the parameters required for parsing delegation from a URL.
 * @property {string} url - The URL from which to parse the delegation.
 * @property {string} sessionId - The session ID to match against the URL's hash parameters.
 */
type ParseDelegationFromURLParams = {
  url: string;
  sessionId: string;
};

/**
 * Parses the delegation from a given URL.
 *
 * This function takes a URL and expected path as parameters, parses the URL to extract hash parameters,
 * and returns the delegation parameter from the hash if it exists.
 *
 * @param {ParseDelegationFromURLParams} params - The parameters required for parsing delegation from a URL.
 * @returns {string | undefined} The delegation parameter from the URL's hash, or undefined if not found.
 */
export const parseDelegationFromURL = ({
  url,
  sessionId,
}: ParseDelegationFromURLParams): string | undefined => {
  const hashParams = parseParams<HashParams>(new URL(url).hash);

  if (hashParams.sessionId === sessionId) {
    return hashParams.delegation;
  }

  return undefined;
};
