import Constants, { ExecutionEnvironment } from 'expo-constants';

/**
 * Get the current environment based on the execution environment and frontend canister ID.
 *
 * @param {string} frontendCanisterId - The ID of the frontend canister.
 * @returns {string} - The current environment ('icp', 'bare', 'storeClient' or 'standalone').
 */
export const getEnvironment = (frontendCanisterId: string): string => {
  if (Constants.executionEnvironment === ExecutionEnvironment.Bare) {
    if (window.location.href.includes(frontendCanisterId)) {
      return 'icp';
    }
    return 'bare';
  }

  return Constants.executionEnvironment;
};
