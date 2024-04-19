import {Global, Module, CACHE_MANAGER, CacheModuleOptions, DynamicModule} from '@nestjs/common';
import {CACHE_MODULE_OPTIONS} from '@nestjs/common/cache/cache.constants';

@Module({
  providers: [
    {
      provide: CACHE_MANAGER,
      // tslint:disable-next-line:no-empty
      useFactory: () => ({set: () => {}, get: () => {}}),
    },
  ],
  exports: [CACHE_MANAGER],
})
export class CacheModule {
  static register(options: CacheModuleOptions = {}): DynamicModule {
    return {
      module: CacheModule,
      providers: [{provide: CACHE_MODULE_OPTIONS, useValue: options}],
    };
  }
}

const RedisCacheModule = CacheModule.register({});

@Global()
@Module({
  imports: [RedisCacheModule],
  exports: [RedisCacheModule],
})
export class CachingModule {}
