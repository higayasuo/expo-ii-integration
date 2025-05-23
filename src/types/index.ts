import { Identity } from '@dfinity/agent';
import { OpenBrowserOptions } from 'expo-icp-app-connect';

/**
 * Represents the outer parameters for the login function.
 * @property {string} [redirectPath] - The path to redirect to after login, if any.
 */
export type LoginOuterParams = {
  redirectPath?: string;
  openBrowserOptions?: OpenBrowserOptions;
};

/**
 * Represents the return value of the useIIIntegration hook and IIIntegrationContext.
 */
export type IIIntegrationType = {
  isAuthReady: boolean;
  isAuthenticated: boolean;
  getIdentity: () => Promise<Identity>;
  login: (loginOuterParams?: LoginOuterParams) => Promise<void>;
  logout: () => Promise<void>;
  authError: unknown | undefined;
  clearAuthError: () => void;
};
