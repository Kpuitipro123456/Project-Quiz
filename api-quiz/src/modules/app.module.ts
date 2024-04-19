import {Module, NestModule, MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import {MongooseModule} from '@nestjs/mongoose';
import {createMongooseOptions} from '../shared/helpers';
import {LoggerMiddleware} from '../middleware/logger.middleware';
import {AuthMiddleware} from '../middleware/auth.middleware';
import {UserMiddleware} from '../middleware/user.middleware';
import {CommonModule} from '../modules/common/common.module';
import {QuestionModule} from '../modules/question/question.module';
import {ExamModule} from './exam/exam.module';
import {QuestionStatisticsModule} from '../modules/questionStatistic/questionStatistic.module';
import {HealthModule} from '../modules/health/health.module';
// import {AnswerModule} from '../modules/answer/answer.module';
import {ExamQuestionModule} from '../modules/examQuestion/examQuestion.module';

/* tslint:disable */
console.log("createMongooseOptions('mongodb.uri') === ", createMongooseOptions('mongodb.uri'));

@Module({
  imports: [
    HealthModule,
    CommonModule,
    MongooseModule.forRootAsync({
      useFactory: () => createMongooseOptions('mongodb.uri'),
    }),
    AuthModule,
    UserModule,
    ExamModule,
    QuestionModule,
    // AnswerModule,
    ExamQuestionModule,
  ],
})
export class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({path: '*', method: RequestMethod.ALL});
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'users*',
        method: RequestMethod.PUT,
      },
      // auth
      {
        path: 'auth/user',
        method: RequestMethod.GET,
      },
      // exam
      {
        path: 'exams*',
        method: RequestMethod.POST,
      },
      {
        path: 'exams*',
        method: RequestMethod.PUT,
      },
      {
        path: 'exams*',
        method: RequestMethod.DELETE,
      },
      // admin
      {
        path: 'admin/users*',
        method: RequestMethod.ALL,
      },
      {
        path: 'admin/categories*',
        method: RequestMethod.ALL,
      },
      {
        path: 'admin/tags*',
        method: RequestMethod.ALL,
      },
      {
        path: 'admin/questions*',
        method: RequestMethod.ALL,
      },
      {
        path: 'admin/exam*',
        method: RequestMethod.ALL,
      },
    );
    consumer.apply(UserMiddleware).forRoutes({path: '*', method: RequestMethod.ALL});
  }
}
