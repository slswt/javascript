export default (fn) => async (...lambdaArgs) => {
  /* args is an array of arguments which will be passed to the handler as arguments */
  const args = lambdaArgs[0];
  if (process.env.SLSWT_LOCAL_INVOKE) {
    return fn(...lambdaArgs);
  }
  if (!Array.isArray(args)) {
    console.log(args);
    throw new Error('Input args not Array, aborting');
  }
  console.log(args);
  await fn(...args);
  return null;
};
