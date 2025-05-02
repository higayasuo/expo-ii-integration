import { parseURL } from 'expo-icp-frontend-helpers';

/**
 * Represents the hash parameters extracted from a URL.
 * @property {string | undefined} delegation - The delegation parameter from the URL's hash.
 */
type HashParams = {
  delegation?: string;
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
export const parseDelegationFromURL = (url: string): string | undefined => {
  const { hashParams } = parseURL<never, HashParams>(url);

  return hashParams.delegation;
};
