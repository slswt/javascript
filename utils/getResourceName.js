import crypto from 'crypto';
import requiredParam from '@slswt/utils/requiredParam';
import get from 'lodash/get';
import { join } from 'path';

const md5 = (what) =>
  crypto
    .createHash('md5')
    .update(what)
    .digest('hex');

export default (fn, relativePath) => {
  const params = [
    'project',
    'platform',
    'account',
    'region',
    'environment',
    'version',
    'path',
  ];


  const servicePath = join(get(process.env, 'dir'), relativePath);
  console.log(get(process.env, 'dir'), relativePath);

  const path = servicePath
    .replace(process.env.root, '')
    .replace(/^\//, '')
    .replace(/\/$/, '');

  const keys = fn({ ...process.env, path });

  const {
    project,
    platform,
    account,
    region,
    environment,
    version,
  } = params.reduce(
    (curr, key) => ({
      ...curr,
      [key]: keys[key] ? keys[key].toString() : '_',
    }),
    {}
  );

  /* path cannot be modified */
  const slswtPath = `.Live/${project}/${platform}/${account}/${region}/${environment}/${version}/${path}`;

  return { name: md5(slswtPath), slswtPath };
};
