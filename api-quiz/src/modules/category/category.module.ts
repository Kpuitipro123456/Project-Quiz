import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {DbModel} from '../../shared/constants';
import {CategoriesAdminController} from './category.admin.controller';
import {CategoriesController} from './category.controller';
import {CategoriesService} from './category.service';
import {CategoriesRepository} from './category.repository';
import {CategoriesSchema} from './category.schema';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';

@Module({
  imports: [MongooseModule.forFeature([{name: DbModel.Categories, schema: CategoriesSchema}])],
  providers: [PaginationHeaderHelper, CategoriesRepository, CategoriesService],
  controllers: [CategoriesController, CategoriesAdminController],
  exports: [CategoriesRepository, CategoriesService],
})
export class CategoryModule {}
