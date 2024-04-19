import {Controller} from '@nestjs/common';
import {QuestionsService} from './question.service';
import {QuestionsAdminService} from './question.admin.service';

@Controller()
export class QuestionsBaseController {
  constructor(
    protected readonly questionsService: QuestionsService,
    protected readonly questionsAdminService: QuestionsAdminService,
  ) {}
}
