import {Injectable} from '@nestjs/common';
import {OtpsRepository} from './otp.repository';
import {CreateOtpInput, UpdateOtpInput} from './otp.dto';
import {OtpsStatus, OTP_LENGTH} from './otp.constant';
import {randomOtp} from '../../shared/helpers';
import {IPagination} from '../../adapters/pagination/pagination.interface';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';
import {filterMongooseText} from 'acd-util-help';

@Injectable()
export class OtpsService {
  constructor(
    private readonly otpsRepository: OtpsRepository,
    private readonly paginationHeaderHelper: PaginationHeaderHelper,
  ) {}
  async indexOtps(pagination?: IPagination) {
    const findParams: any = filterMongooseText(
      {
        _deleted: {
          $ne: true,
        },
      },
      {},
      [],
    );
    const [languages, count] = await Promise.all([
      this.otpsRepository.find(findParams, {
        ...(pagination && {skip: pagination.startIndex}),
        ...(pagination && {limit: pagination.perPage}),
        sort: '-createdAt',
      }),
      this.otpsRepository.count(findParams),
    ]);
    const responseHeaders = this.paginationHeaderHelper.getHeaders(pagination, count);
    return {
      items: languages,
      headers: responseHeaders,
    };
  }

  async createOtp(createOtpInput: CreateOtpInput) {
    return this.otpsRepository.create({
      ...createOtpInput,
      otp: createOtpInput?.otp || randomOtp(OTP_LENGTH),
      status: createOtpInput?.status || OtpsStatus.VALID,
      createdAt: new Date(),
    });
  }

  async readOtp(otpId: string) {
    return this.otpsRepository.findById(otpId);
  }

  async lastOtp(conditions: any) {
    return this.otpsRepository.findOne(conditions, {sort: '-createdAt'});
  }

  async updateOtp(otpId: string, updateOtpInput: UpdateOtpInput) {
    return this.otpsRepository.updateById(otpId, updateOtpInput);
  }

  async updateOtpByConditions(conditions: any, updateOtpInput: UpdateOtpInput) {
    return this.otpsRepository.updateMany(conditions, updateOtpInput);
  }

  async deleteOtp(otpId: string) {
    return this.otpsRepository.deleteById(otpId);
  }
}
