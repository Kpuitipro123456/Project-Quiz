import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';
import {Cache} from 'cache-manager';
import {PRE_FIX} from './caching.constant';

@Injectable()
export class CachingService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get(`${PRE_FIX}${key}`);
  }

  async set<T>(key: string, data: T): Promise<T> {
    return this.cacheManager.set(`${PRE_FIX}${key}`, data);
  }

  // expiration time in seconds
  async setExpirationTime<T>(key: string, data: T, ttl: number): Promise<T> {
    return this.cacheManager.set(`${PRE_FIX}${key}`, data, ttl);
  }

  async del<T>(key: string): Promise<any> {
    return this.cacheManager.del(`${PRE_FIX}${key}`);
  }
}
