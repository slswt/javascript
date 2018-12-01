import AWS from 'aws-sdk';
import snakeCase from 'lodash/snakeCase';
import get from 'lodash/get';
import setAwsRegion from '../../setAwsRegion';
import requiredParam from '@slswt/utils/requiredParam';
import crypto from 'crypto';

setAwsRegion(AWS);

const md5 = (what) =>
  crypto
    .createHash('md5')
    .update(what)
    .digest('hex');

const invokeApi = (entry, ...args) => {
  const lambda = new AWS.Lambda();

  const FunctionName = md5(entry);

  console.log({
    longName,
    FunctionName,
    lambdaPath,
    entry,
    args,
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
          try {
            resolve(JSON.parse(responsePayload));
          } catch (err) {
            resolve(responsePayload);
          }
        } else {
          resolve(response);
        }
      }
    );
  });
};

export default invokeApi;
