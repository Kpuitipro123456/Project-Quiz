import {Module, Global} from '@nestjs/common';
import {configProviders} from './config.provider';

@Global()
@Module({
  providers: [...configProviders],
  exports: [...configProviders],
})
export class CommonModule {}
