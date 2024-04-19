import {Module} from '@nestjs/common';
import {NewsScript} from './news.script';
import {ScheduleModule} from '@nestjs/schedule';
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [NewsScript],
  controllers: [],
  exports: [],
})
export class TaskSchedulingModule {}
