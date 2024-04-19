import {Controller} from '@nestjs/common';
import {ExamQuestionsService} from './examQuestion.service';
import {ExamsService} from '../exam/exam.service';

@Controller()
export class ExamQuestionsBaseController {
  constructor(
    protected readonly examQuestionsService: ExamQuestionsService,
    protected readonly examsService: ExamsService,
  ) {}
}
