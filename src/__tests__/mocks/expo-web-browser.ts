import { vi } from 'vitest';

export const WebBrowserResultType = {
  CANCEL: 'cancel',
  DISMISS: 'dismiss',
  OPENED: 'opened',
  LOCKED: 'locked',
} as const;

export const openBrowserAsync = vi.fn();
export const dismissBrowser = vi.fn();

export default {
  WebBrowserResultType,
  openBrowserAsync,
  dismissBrowser,
};
