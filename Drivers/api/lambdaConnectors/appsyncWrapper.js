import get from 'lodash/get';

const appsyncWrapper = (fn) => async (event) => {
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
