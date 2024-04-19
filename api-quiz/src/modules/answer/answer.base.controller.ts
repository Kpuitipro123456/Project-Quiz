import {Controller} from '@nestjs/common';
import {AnswersService} from './answer.service';
import {AnswersAdminService} from './answer.admin.service';

@Controller()
export class AnswersBaseController {
  constructor(
    protected readonly answersService: AnswersService,
    protected readonly answersAdminService: AnswersAdminService,
  ) {}
}
