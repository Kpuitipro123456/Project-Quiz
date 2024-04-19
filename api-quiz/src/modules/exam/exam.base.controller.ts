import {Controller} from '@nestjs/common';
import {ExamsService} from './exam.service';
import {ExamsAdminService} from './exam.admin.service';

@Controller()
export class ExamsBaseController {
  constructor(
    protected readonly examsService: ExamsService,
    protected readonly examsAdminService: ExamsAdminService,
  ) {}
}
