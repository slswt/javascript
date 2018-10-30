import get from 'lodash/get';
export default (fn) => async (event) => {
  const Message = get(event, 'Records[0].Sns.Message');
  if (typeof Message === 'undefined') {
    console.log('Cannot get Records[0].Sns.Message from: ', JSON.stringify(event, null, 2));
    return null;
  }

  let json = [];
  try {
    json = JSON.parse(Message);
  } catch (err) {
    console.log('failed to parse message', Message);
  }
  if (!Array.isArray(json)) {
    console.log(Message);
    throw new Error('Input json not Array, aborting');
  }
  await fn(...json);
  return null;
};
