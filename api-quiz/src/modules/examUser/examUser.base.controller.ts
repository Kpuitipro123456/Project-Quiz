import {Controller} from '@nestjs/common';
import {ExamUsersService} from './examUser.service';
import {ExamsService} from '../exam/exam.service';

@Controller()
export class ExamUsersBaseController {
  constructor(
    protected readonly examUsersService: ExamUsersService,
    protected readonly examsService: ExamsService,
  ) {}
}
