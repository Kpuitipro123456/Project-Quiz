import {Injectable} from '@nestjs/common';
import {IndexHealthResponse} from './health.dto';
import {
  HealthCheckService,
  MongooseHealthIndicator,
  HealthCheckResult,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Injectable()
export class HealthService {
  async indexHealth(): Promise<IndexHealthResponse> {
    return {
      healthy: true,
    };
  }

  constructor(
    private readonly health: HealthCheckService,
    private readonly mongo: MongooseHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  async healthCheck(): Promise<HealthCheckResult> {
    return this.health.check([
      async () => this.mongo.pingCheck('mongo', {timeout: 3000}),
      // The process should not use more than 150MB memory
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
