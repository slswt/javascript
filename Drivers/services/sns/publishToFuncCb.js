import AWS from 'aws-sdk';
import snakeCase from 'lodash/snakeCase';
import setAwsRegion from '../../setAwsRegion';

const publishToFuncCb = (topicName, ...message) => {
  setAwsRegion(AWS);
  const sns = new AWS.SNS({ apiVersion: '2010-03-31' });
  const TopicArn = `arn:aws:sns:${process.env.AWS_REGION}:${
    process.env.AWS_ACCOUNT_ID
  }:callback_${snakeCase(topicName)}_${process.env.DEPLOYMENT_ENV}`;

  const Message = JSON.stringify(message);

  console.log({
    TopicArn,
    Message,
  });

  return new Promise((resolve) => {
    sns.publish(
      {
        TopicArn,
        Message,
      },
      (err, data) => {
        if (err) {
          resolve();
        } else {
          resolve(data);
        }
      }
    );
  });
};

export default publishToFuncCb;
