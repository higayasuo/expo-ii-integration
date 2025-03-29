export const getEnvironment = (
  executionEnvironment: string,
  frontendCanisterId: string,
): string => {
  console.log('executionEnvironment', executionEnvironment);

  if (executionEnvironment === 'bare') {
    if (window.location.href.includes(frontendCanisterId)) {
      return 'icp';
    }
    return 'bare';
  }

  return executionEnvironment;
};
