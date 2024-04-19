import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {DbModel} from '../../shared/constants';
import {OtpsAdminController} from './otp.admin.controller';
import {OtpsService} from './otp.service';
import {OtpsRepository} from './otp.repository';
import {OtpsSchema} from './otp.schema';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';

@Module({
  imports: [MongooseModule.forFeature([{name: DbModel.Otps, schema: OtpsSchema}])],
  providers: [PaginationHeaderHelper, OtpsRepository, OtpsService],
  controllers: [OtpsAdminController],
  exports: [OtpsRepository, OtpsService],
})
export class OtpModule {}
