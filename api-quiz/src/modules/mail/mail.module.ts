import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {Module} from '@nestjs/common';
import {MailService} from './mail.service';
import {join} from 'path';
import {readConfig} from '../common/config.provider';
import {OAuth2Client} from 'google-auth-library';

async function getToken() {
  try {
    const myOAuth2Client = new OAuth2Client(
      readConfig('mailConfig.auth.clientId'),
      readConfig('mailConfig.auth.clientSecret'),
    );
    // Set Refresh Token to OAuth2Client Credentials
    myOAuth2Client.setCredentials({
      refresh_token: readConfig('mailConfig.auth.refreshToken'),
    });
    const response = await myOAuth2Client.getAccessToken();
    /* tslint:disable */
    console.log('get token send mail ===============>', response?.token);
    return response?.token;
  } catch (error) {
    /* tslint:disable */
    console.log('error get token send mail ===============>', error);
    return 'get token failed';
  }
}

async function getMailerOptions() {
  return {
    // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
    // or
    transport: {
      service: readConfig('mailConfig.service'),
      auth: {
        type: readConfig('mailConfig.auth.type') as any,
        user: readConfig('mailConfig.auth.user'),
        clientId: readConfig('mailConfig.auth.clientId'),
        clientSecret: readConfig('mailConfig.auth.clientSecret'),
        refreshToken: readConfig('mailConfig.auth.refreshToken'),
        accessToken: await getToken(),
      },
    },
    defaults: {
      from: '"Quiz" <noreply@example.com>',
    },
    template: {
      dir: join(__dirname, 'templates'),
      adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
      options: {
        strict: true,
      },
    },
  };
}

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (): Promise<Record<string, any>> => {
        return getMailerOptions();
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // export for DI
})
export class MailModule {}
