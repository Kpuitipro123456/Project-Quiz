import {Controller, Get, HttpStatus} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {IndexHealthResponse} from './health.dto';
import {HealthCheck} from '@nestjs/terminus';
import {HealthService} from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  // Stop serve requests if cannot ping to any dependencies
  // recommend threshold: 1
  @Get()
  @ApiOperation({
    operationId: 'healthCheck',
    summary: 'Health Check For Service Statuses',
    description: 'Health Check For Service Statuses',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: IndexHealthResponse,
  })
  @HealthCheck()
  healthCheck() {
    return this.healthService.healthCheck();
  }
}
