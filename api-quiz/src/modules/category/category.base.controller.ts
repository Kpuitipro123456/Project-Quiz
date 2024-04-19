import {Controller} from '@nestjs/common';
import {CategoriesService} from './category.service';

@Controller()
export class CategoriesBaseController {
  constructor(protected readonly categoriesService: CategoriesService) {}
}
