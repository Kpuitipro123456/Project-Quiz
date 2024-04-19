import {Controller} from '@nestjs/common';
import {OtpsService} from './otp.service';

@Controller()
export class OtpsBaseController {
  constructor(protected readonly otpsService: OtpsService) {}
}
