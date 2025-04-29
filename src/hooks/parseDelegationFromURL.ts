/**
 * Parameters for parsing delegation from URL.
 * @property url - The URL to parse
 * @property authPath - The path to check if the URL is for this authentication flow
 */
type ParseDelegationFromURLParams = {
  url: string;
  authPath: string;
};

/**
 * Parses a delegation from a URL's hash fragment.
 * @param params - The parameters for parsing delegation from URL
 * @returns The delegation string if found and the path matches, undefined otherwise
 * @throws Error if the URL is invalid or the hash fragment is malformed
 */
export function parseDelegationFromURL({
  url,
  authPath,
}: ParseDelegationFromURLParams): string | undefined {
  const parsedUrl = new URL(url);
  const normalizedAuthPath = authPath.startsWith('/')
    ? authPath
    : `/${authPath}`;
  if (parsedUrl.pathname !== normalizedAuthPath) {
    return undefined;
  }

  const hash = url.split('#')[1];
  if (!hash) {
    return undefined;
  }

  const search = new URLSearchParams(hash);
  const delegation = search.get('delegation');

  if (!delegation) {
    return undefined;
  }

  return delegation;
}
