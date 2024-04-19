import {ApiProperty} from '@nestjs/swagger';

export class IndexHealthResponse {
  @ApiProperty({
    type: Boolean,
    description: 'healthy',
  })
  healthy: boolean;
}
