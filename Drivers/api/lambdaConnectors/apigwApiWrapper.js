import get from 'lodash/get';

const returnExecuteApiResults = (input) => {
  let body = JSON.stringify(
    {
      error: 'Could not stringify the input',
    },
    null,
    2
  );
  try {
    body = JSON.stringify(input, null, 2);
  } catch (err) {
    console.log('Cloud not stringify the input', input);
  }
  return {
    statusCode: 200,
    body,
  };
};

export default (fn) => async (...args) => {
  const event = args[0];
  if (process.env.SLSWT_LOCAL_INVOKE) {
    return fn(...args);
  };
  const body = get(event, 'body');
  if (typeof body === 'undefined') {
    console.log(
      'Cannot get events.body from: ',
      JSON.stringify(event, null, 2)
    );
    return null;
  }
  let json = [];
  try {
    json = JSON.parse(body);
  } catch (err) {
    console.log('failed to parse body', body);
  }
  /* json should be array */
  if (!Array.isArray(json)) {
    console.log(body);
    throw new Error('Input json not Array, aborting');
  }
  const result = await fn(...json);
  return returnExecuteApiResults(result);
};
