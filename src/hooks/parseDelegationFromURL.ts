/**
 * Parses a delegation from a URL's hash fragment.
 * @param url - The URL to parse
 * @returns The delegation string if found, undefined otherwise
 * @throws Error if the URL is invalid or the hash fragment is malformed
 */
export function parseDelegationFromURL(url: string): string | undefined {
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
