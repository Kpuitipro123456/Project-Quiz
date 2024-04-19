import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserModule} from '../user/user.module';
import {OtpModule} from '../otp/otp.module';
import {MailModule} from '../mail/mail.module';

@Module({
  imports: [UserModule, OtpModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
