import publishToFuncCb from '../../services/sns/publishToFuncCb';

const withSnsCallback = (callbackEvent, fn) => {
  return async (...args) => {
    await fn(...args);
    await publishToFuncCb(callbackEvent, ...args);
  };
};

export default withSnsCallback;
