import requiredParam from '@slswt/utils/requiredParam';

export default (AWS = requiredParam('AWS')) => {
  const { AWS_REGION = requiredParam('AWS_REGION') } = process.env;
  AWS.config.update({ region: AWS_REGION });
};
