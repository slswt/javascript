import AWS from 'aws-sdk';
import axios from 'axios';
import { parse } from 'url';
import camelCase from 'lodash/camelCase';
import setAwsRegion from '../../setAwsRegion';

setAwsRegion(AWS);

const apigwApi = async (path, ...data) => {
  try {
    const url = `${process.env.GW_URL}/${process.env.DEPLOYMENT_ENV}/${camelCase(path)}`;
    const req = new AWS.HttpRequest(url, process.env.AWS_REGION);
    const { host } = parse(url);
    req.method = 'POST';
    req.headers.host = host;
    req.headers['Content-Type'] = 'application/json';
    req.body = JSON.stringify(data);
    const signer = new AWS.Signers.V4(req, 'execute-api', true);
    signer.addAuthorization(
      {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
      },
      AWS.util.date.getDate()
    );
    const result = await axios({
      method: 'post',
      url,
      data: req.body,
      headers: req.headers,
      responseType: 'json',
    });
    if (result) {
      console.log(result);
    }
    return result.data;
  } catch (err) {
    console.log(err);
  }
  return null;
};

export default apigwApi;
