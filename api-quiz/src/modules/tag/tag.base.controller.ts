import {Controller} from '@nestjs/common';
import {TagsService} from './tag.service';

@Controller()
export class TagsBaseController {
  constructor(protected readonly tagsService: TagsService) {}
}
