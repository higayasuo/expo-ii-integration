export const getEnvironment = (
  executionEnvironment: string,
  frontendCanisterId: string,
): string => {
  console.log('executionEnvironment', executionEnvironment);

  if (executionEnvironment === 'bare') {
    console.log('window.location.href', window.location.href);
    console.log('frontendCanisterId', frontendCanisterId);
    if (window.location.href.includes(frontendCanisterId)) {
      return 'icp';
    }
    return 'bare';
  }

  return executionEnvironment;
};
