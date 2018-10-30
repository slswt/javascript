import AWS from 'aws-sdk';
import snakeCase from 'lodash/snakeCase';
import setAwsRegion from '../../setAwsRegion';

setAwsRegion(AWS);

const snsApi = (topicName, ...message) => {
  const sns = new AWS.SNS({ apiVersion: '2010-03-31' });
  const TopicArn = `arn:aws:sns:${process.env.AWS_REGION}:${
    process.env.AWS_ACCOUNT_ID
  }:invoke_function_${snakeCase(topicName)}_${process.env.DEPLOYMENT_ENV}`;

  const Message = JSON.stringify(message);

  console.log({
    TopicArn,
    Message,
  });

  return new Promise((resolve, reject) => {
    sns.publish(
      {
        TopicArn,
        Message,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

export default snsApi;
