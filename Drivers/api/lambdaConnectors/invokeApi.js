import AWS from 'aws-sdk';
import snakeCase from 'lodash/snakeCase';
import get from 'lodash/get';
import setAwsRegion from '../../setAwsRegion';

setAwsRegion(AWS);
const crypto = require('crypto');

const invokeApi = (lambdaPath, entry, ...args) => {
  const lambda = new AWS.Lambda();

  const longName = `${process.env.LAMBDA_NAME_PREFIX}_${snakeCase(
    lambdaPath
  )}_${entry}`;

  const FunctionName = crypto
    .createHash('md5')
    .update(longName)
    .digest('hex');

  console.log({
    longName, FunctionName, lambdaPath, entry, args,
  });

  const async = get(args, '0.async', false);

  const Payload = JSON.stringify(args, null, 2);

  console.log('Payload', Payload);

  return new Promise((resolve, reject) => {
    lambda.invoke(
      {
        FunctionName,
        InvocationType: async ? 'Event' : 'RequestResponse',
        Payload,
      },
      (err, response) => {
        const responsePayload = get(response, 'Payload');
        const functionError = get(response, 'FunctionError');
        if (err) {
          console.log('Error in invoked function, see next log');
          console.log(err);
          reject(err);
          return;
        }
        if (functionError) {
          console.log('Error in invoked function, see next log');
          console.log(functionError, responsePayload);
          reject(
            new Error(
              JSON.stringify({ functionError, responsePayload }, null, 2)
            )
          );
          return;
        }
        if (!async) {
          resolve(`invoked ${FunctionName}`);
          return;
        }
        resolve(JSON.parse(responsePayload));
      }
    );
  });
};

export default invokeApi;
