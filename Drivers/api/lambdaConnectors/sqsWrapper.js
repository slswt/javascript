export default (fn) => async (...lambdaArgs) => {
  const event = lambdaArgs[0];
  if (process.env.SLSWT_LOCAL_INVOKE) {
    return fn(...lambdaArgs);
  }
  try {
    await Promise.all(
      event.Records.map(async ({ body }) => {
        const props = JSON.parse(body);
        return fn(props);
      })
    );
  } catch (err) {
    console.log(err);
  }
};
