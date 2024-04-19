import * as redisStore from 'cache-manager-ioredis';
import {Module, CacheModule as NestCacheModule, Global} from '@nestjs/common';
import {CacheModule as CacheModuleMock} from './__mocks__/caching.module';
import {getConfig, readConfig} from '../config.provider';
import {CachingService} from './caching.service';

const cacheTtl = Number(readConfig('cache.ttl'));
const cacheEnabled = Boolean(readConfig('cache.enabled'));
const redisEnabled = Boolean(readConfig('cache.redis'));
const redisHost = readConfig('redis.host');
const redisPort = readConfig('redis.port');
const clusterMode = Boolean(readConfig('redis.clusterMode'));

const connectionConfig = {
  host: redisHost,
  port: redisPort,
};

const cacheModuleOptions = redisEnabled
  ? {
      store: redisStore,
      ttl: cacheTtl,
      ...(!clusterMode && connectionConfig),
      ...(clusterMode && {
        clusterConfig: {
          nodes: [connectionConfig],
        },
      }),
    }
  : {ttl: cacheTtl};

const CacheModule = cacheEnabled
  ? NestCacheModule.register(cacheModuleOptions)
  : CacheModuleMock.register(cacheModuleOptions);

@Global()
@Module({
  imports: [CacheModule],
  providers: [CachingService],
  exports: [CacheModule, CachingService],
})
export class CachingModule {}
