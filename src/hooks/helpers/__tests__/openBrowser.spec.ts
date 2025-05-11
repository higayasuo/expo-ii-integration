import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as WebBrowser from 'expo-web-browser';
import { openBrowser } from '../openBrowser';

vi.mock('expo-web-browser', () => ({
  openBrowserAsync: vi.fn(),
}));

describe('openBrowser', () => {
  const url = 'https://example.com';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should open browser with the specified URL', async () => {
    await openBrowser(url);

    expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith(url, {
      windowName: '_self',
    });
  });

  it('should throw error when browser opening fails', async () => {
    const error = new Error('Browser failed');
    vi.mocked(WebBrowser.openBrowserAsync).mockRejectedValue(error);

    await expect(openBrowser(url)).rejects.toThrow(error);
  });
});
