import {Controller} from '@nestjs/common';
import {QuestionStatisticsService} from './questionStatistic.service';

@Controller()
export class QuestionStatisticsBaseController {
  constructor(protected readonly questionStatisticsService: QuestionStatisticsService) {}
}
