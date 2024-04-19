import {Injectable} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';

@Injectable()
export class NewsScript {
  constructor() {}

  // @Cron(CronExpression.EVERY_5_SECONDS)
  // handleCron() {
  // }
}
