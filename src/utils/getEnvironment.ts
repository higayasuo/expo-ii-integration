import Constants, { ExecutionEnvironment } from 'expo-constants';

/**
 * Get the current environment based on the execution environment and frontend canister ID.
 *
 * @param {string} frontendCanisterId - The ID of the frontend canister.
 * @returns {string} - The current environment ('icp', 'bare', 'storeClient' or 'standalone').
 */
export const getEnvironment = (frontendCanisterId: string): string => {
  console.log('Constants.executionEnvironment', Constants.executionEnvironment);

  if (Constants.executionEnvironment === ExecutionEnvironment.Bare) {
    console.log('window.location.href', window.location.href);
    console.log('frontendCanisterId', frontendCanisterId);
    if (window.location.href.includes(frontendCanisterId)) {
      return 'icp';
    }
    return 'bare';
  }

  return Constants.executionEnvironment;
};
