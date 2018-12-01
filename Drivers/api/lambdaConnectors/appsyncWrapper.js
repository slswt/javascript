import get from 'lodash/get';

const appsyncWrapper = (fn) => async (...lambdaArgs) => {
  const event = lambdaArgs[0];
  if (process.env.SLSWT_LOCAL_INVOKE) {
    return fn(...lambdaArgs);
  }
  const { args, field } = event;

  const cognitoIdentityId = get(event, 'identity.cognitoIdentityId');

  return fn({
    cognitoIdentityId,
    args,
    field,
    event,
  });
};

export default appsyncWrapper;
