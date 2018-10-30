export default (AWS) => AWS.config.update({ region: process.env.AWS_REGION });
