import * as WebBrowser from 'expo-web-browser';

/**
 * Dismisses the web browser.
 */
export const dismissBrowser = (): void => {
  WebBrowser.dismissBrowser();
};
