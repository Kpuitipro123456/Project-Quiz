import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {DbModel} from '../../shared/constants';
import {QuestionStatisticsRepository} from './questionStatistic.repository';
import {QuestionStatisticsSchema} from './questionStatistic.schema';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';
import {QuestionStatisticsController} from './questionStatistic.controller';
import {QuestionStatisticsService} from './questionStatistic.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: DbModel.QuestionStatistics, schema: QuestionStatisticsSchema},
    ]),
  ],
  providers: [QuestionStatisticsRepository, PaginationHeaderHelper, QuestionStatisticsService],
  controllers: [QuestionStatisticsController],
  exports: [QuestionStatisticsRepository, QuestionStatisticsService],
})
export class QuestionStatisticsModule {}
