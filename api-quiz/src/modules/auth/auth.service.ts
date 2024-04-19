import * as bcrypt from 'bcrypt';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {UsersService} from '../user/user.service';
import {
  CredentialAuthDto,
  AuthForgotPasswordDto,
  AuthVerifyOtpDto,
  AuthResetPasswordDto,
} from './auth.dto';
import {UsersStatus} from '../user/user.constant';
import {generateToken, verifyToken, generateTokenCommon} from '../../shared/jwt.helpers';
import {OtpsStatus, OTP_LIVE_TIME} from '../otp/otp.constant';
import {CreateUserInput} from '../user/user.dto';
import * as momentTz from 'moment-timezone';
import * as moment from 'moment';
import {MailService} from './../mail/mail.service';
import {OtpsService} from '../otp/otp.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpsService: OtpsService,
    private readonly mailService: MailService,
  ) {}

  async register(createUserInput: CreateUserInput) {
    return this.usersService.createUser(createUserInput);
  }

  async readUser(userId: string) {
    return this.usersService.readUser(userId);
  }

  async login(credentialAuthDto: CredentialAuthDto) {
    const findUser = await this.usersService.findUserByConditions({
      $or: [
        {phoneNumber: credentialAuthDto.phoneNumberOrEmail},
        {email: credentialAuthDto.phoneNumberOrEmail},
      ],
    });
    if (!findUser) {
      throw new NotFoundException('User not found');
    }
    if (findUser.status !== UsersStatus.ACTIVE) {
      throw new BadRequestException(
        `The user isn't ${UsersStatus.ACTIVE}. Currently, the user is ${findUser.status}`,
      );
    }
    const confirmPassword = await bcrypt.compare(
      credentialAuthDto.password,
      findUser.password.bcrypt,
    );
    if (!confirmPassword) {
      throw new BadRequestException('Phone number / email or password is incorrect');
    }
    const accessToken = (
      await generateToken({
        ...findUser.toJSON(),
      })
    ).toString();
    this.usersService.lastLoginAt(findUser.id);
    return {
      success: true,
      data: {
        ...findUser.toJSON(),
        accessToken,
      },
    };
  }

  async forgotPassword(authForgotPasswordDto: AuthForgotPasswordDto) {
    const findUserByEmail = await this.usersService.findUserByConditions({
      email: authForgotPasswordDto.email,
    });
    if (!findUserByEmail) {
      throw new BadRequestException(`Email ${authForgotPasswordDto.email} isn't register!`);
    }
    if (findUserByEmail.status !== UsersStatus.ACTIVE) {
      throw new BadRequestException(
        `The user isn't ${UsersStatus.ACTIVE}. Currently, the user is ${findUserByEmail.status}`,
      );
    }

    // invalid all otps of user
    await this.otpsService.updateOtpByConditions(
      {
        email: authForgotPasswordDto.email,
        status: OtpsStatus.VALID,
      },
      {
        status: OtpsStatus.INVALID,
      },
    );

    // create otp
    const createOtp = await this.otpsService.createOtp({
      email: authForgotPasswordDto.email,
    });

    // sending otp via email
    await this.mailService.sendEmailConfirmation({
      email: findUserByEmail.email,
      otp: createOtp.otp,
      name: findUserByEmail.name,
      contactUrl: '',
      emailUrl: '',
    });

    return {
      isSendOtp: true,
      email: authForgotPasswordDto.email,
      ...(authForgotPasswordDto.url && {url: authForgotPasswordDto.url}),
    };
  }

  async verifyOtp(authVerifyOtpDto: AuthVerifyOtpDto) {
    const lastOtp = await this.otpsService.lastOtp(authVerifyOtpDto);
    if (!lastOtp || lastOtp.status === OtpsStatus.INVALID) {
      throw new BadRequestException(`Otp is invalid`);
    }
    const token = await generateTokenCommon(authVerifyOtpDto);
    // update status to invalid otp
    await this.otpsService.updateOtp(lastOtp.id, {status: OtpsStatus.INVALID});
    return {
      token,
    };
  }

  async resetPassword(authResetPasswordDto: AuthResetPasswordDto) {
    const nonUser: any = await verifyToken(authResetPasswordDto.token);
    if (!nonUser || !nonUser?.email || !nonUser?.createdAt) {
      throw new BadRequestException('Token is invalid');
    }
    if (momentTz(new Date()).isAfter(moment(nonUser.createdAt).add(OTP_LIVE_TIME, 'minute'))) {
      throw new BadRequestException('Token is expired');
    }
    const findUserByEmail = await this.usersService.findUserByConditions({email: nonUser.email});
    if (!findUserByEmail) {
      throw new BadRequestException(`Email ${nonUser.email} isn't register!`);
    }
    if (findUserByEmail.status !== UsersStatus.ACTIVE) {
      throw new BadRequestException(
        `The user isn't ${UsersStatus.ACTIVE}. Currently, the user is ${findUserByEmail.status}`,
      );
    }
    const updateUser = await this.usersService.updateUser(findUserByEmail.id, {
      password: authResetPasswordDto.password,
    });
    if (updateUser) {
      const accessToken = (await generateToken(updateUser)).toString();
      updateUser.password.tokens = [
        {
          ts: new Date(),
          accessToken,
        },
      ];
      await updateUser.save();
      return {
        ...updateUser.toJSON(),
        accessToken,
      };
    }
    throw new InternalServerErrorException('Reset password failed');
  }
}
