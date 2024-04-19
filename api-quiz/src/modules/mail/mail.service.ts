import {MailerService} from '@nestjs-modules/mailer';
import {Injectable} from '@nestjs/common';

@Injectable()
export class MailService {
  private OTP_LIVE_TIME: number = 100;
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailConfirmation(infos: Record<string, any>) {
    const createMail = {
      to: infos.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: '[Confirmation Otp]',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: infos.name,
        otp: infos.otp,
        otpLiveTime: this.OTP_LIVE_TIME,
        url: '',
        contactUrl: '',
        emailUrl: '',
      },
    };
    await this.mailerService.sendMail(createMail);
  }
}
