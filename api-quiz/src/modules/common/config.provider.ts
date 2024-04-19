import * as _ from 'lodash';
import {config as dotenvConfig} from 'dotenv';

function getConfigFileForEnvironment(env: string) {
  switch (env) {
    case 'local':
      return 'local';
    case 'development':
      return 'development';
    case 'staging':
      return 'staging';
    case 'production':
      return 'production';
    default:
      return '';
  }
}

dotenvConfig({
  path: `${getConfigFileForEnvironment(process.env.NODE_ENV)}.env`,
  debug: true,
  override: true,
});

import * as config from 'config';
import {Provider} from '@nestjs/common';

export const readConfig = (key: string) => {
  return key ? process.env[config.get(key)] : undefined;
};

export const isLocal = () => {
  const host = process.env.SERVER_HOST || readConfig('server.host');
  return host === 'localhost' || host === '127.0.0.1';
};

export const getServerHost = () => {
  return process.env.SERVER_HOST || readConfig('server.host');
};

export const getHost = () => {
  return (
    process.env.SERVER_HOSTNAME ||
    readConfig('server.hostname' || `${readConfig('server.host')}:${readConfig('server.port')}`)
  );
};

export const getPort = (): string => {
  return `${readConfig('server.port')}`;
};

export const getConfig = () => {
  return config;
};

export const configProviders: Provider[] = [
  {
    provide: 'configService',
    useFactory: (): config.IConfig => config,
  },
  {
    provide: 'hostName',
    useFactory: getHost,
  },
  {
    provide: 'readConfig',
    useFactory: (key: string) => readConfig(key),
  },
];
