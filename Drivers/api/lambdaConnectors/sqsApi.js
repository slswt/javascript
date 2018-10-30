import AWS from 'aws-sdk';
import snakeCase from 'lodash/snakeCase';
import setAwsRegion from '../../setAwsRegion';

setAwsRegion(setAwsRegion);

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const sqsApi = async (path, props) => {
  const queueKey = `SQS_QUEUE_${snakeCase(path)}`.toUpperCase();
  if (!process.env[queueKey]) {
    console.log('No Queue url found in envs for ', queueKey);
    return;
  }
  const QueueUrl = process.env[queueKey];
  const params = {
    MessageBody: JSON.stringify(props),
    QueueUrl,
  };

  await new Promise((resolve, reject) => {
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

export default sqsApi;
