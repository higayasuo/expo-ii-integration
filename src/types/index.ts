import { Identity } from '@dfinity/agent';

/**
 * Represents the outer parameters for the login function.
 * @property {string} [redirectPath] - The path to redirect to after login, if any.
 */
export type LoginOuterParams = {
  redirectPath?: string;
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
