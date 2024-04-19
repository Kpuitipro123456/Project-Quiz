import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import {Injectable, BadRequestException, NotFoundException} from '@nestjs/common';
import {UsersRepository} from './user.repository';
import {UpdateUsersInput, CreateUserInput, UsersFilter} from './user.dto';
import {
  saltRounds,
  UsersStatus,
  filtersText,
  RandomReferralCharacters,
  MinimumReferralLength,
} from './user.constant';
import {IUsersCondition} from './user.interface';
import {generateToken} from '../../shared/jwt.helpers';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';
import {filterMongooseText} from 'acd-util-help';
import {IPagination} from '../../adapters/pagination/pagination.interface';
import {MailService} from './../mail/mail.service';
import {generateRandomString, generateRandomNumbersArray} from '../../shared/helpers';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly paginationHeaderHelper: PaginationHeaderHelper,
  ) {}

  private async _hashPassword(password: string) {
    const encrypt = await bcrypt.hash(password, saltRounds);
    return encrypt;
  }

  async indexUsers(usersFilter: UsersFilter, pagination?: IPagination) {
    const findParams: any = filterMongooseText(
      {
        _deleted: {
          $ne: true,
        },
      },
      usersFilter,
      filtersText,
    );
    if (usersFilter.members && Array.isArray(usersFilter.members)) {
      findParams._id = {
        $in: usersFilter.members,
      };
    }
    if (usersFilter?.hasOwnProperty('isAdmin')) {
      findParams.isAdmin = usersFilter.isAdmin;
    }

    const [indexUsers, count] = await Promise.all([
      this.usersRepository.find(findParams, {
        ...(pagination && {skip: pagination.startIndex}),
        ...(pagination && {limit: pagination.perPage}),
        sort: '-createdAt',
      }),
      this.usersRepository.count(findParams),
    ]);
    const responseHeaders = this.paginationHeaderHelper.getHeaders(pagination, count);
    return {
      items: indexUsers,
      headers: responseHeaders,
    };
  }

  async findUserByConditions(condition: IUsersCondition | any) {
    return this.usersRepository.findOne(condition);
  }

  async findUser(userId: string) {
    try {
      return await this.readUser(userId);
    } catch (error) {
      return null;
    }
  }

  async readUser(userId: string) {
    const findUser = await this.usersRepository.findById(userId);
    if (!findUser) {
      throw new NotFoundException('User not found');
    }
    return findUser;
  }

  async indexPublicUsersInfo(usersFilter: UsersFilter, pagination?: IPagination, userId?: string) {
    const findParams: any = filterMongooseText(
      {
        _deleted: {
          $ne: true,
        },
        status: {
          $nin: [UsersStatus.DRAFT],
        },
      },
      usersFilter,
      filtersText,
    );
    if (usersFilter.members && Array.isArray(usersFilter.members)) {
      findParams._id = {
        $in: usersFilter.members,
      };
    }
    if (usersFilter?.hasOwnProperty('isAdmin')) {
      findParams.isAdmin = usersFilter.isAdmin;
    }
    let sortDefault = '-createdAt';
    if (usersFilter?.sortPointDesc) {
      sortDefault = '-totalPoint';
    }

    const [indexUsers, count] = await Promise.all([
      this.usersRepository.find(findParams, {
        ...(pagination && {skip: pagination.startIndex}),
        ...(pagination && {limit: pagination.perPage}),
        sort: sortDefault,
      }),
      this.usersRepository.count(findParams),
    ]);
    const responseHeaders = this.paginationHeaderHelper.getHeaders(pagination, count);

    const users = indexUsers.map((user) => {
      return {
        id: user.id,
        name: user.name,
        userName: user.userName,
        imageUrl: user.imageUrl,
        phoneNumber: `${user.phoneNumber.slice(0, -3)}***`,
        email: user.email ? `***@${user.email.split('@')[1]}` : '',
      };
    });
    return {
      items: users,
      headers: responseHeaders,
    };
  }

  async readPublicUserInfo(userId: string, selfUserId?: string) {
    const findUser = await this.readUser(userId);
    if (selfUserId && selfUserId === userId) {
      return findUser;
    }
    return {
      id: findUser.id,
      name: findUser.name,
      userName: findUser.userName,
      imageUrl: findUser.imageUrl,
      phoneNumber: `${findUser.phoneNumber.slice(0, -3)}***`,
      email: findUser.email ? `***@${findUser.email.split('@')[1]}` : '',
    };
  }

  private async _syncReferralCode(): Promise<string> {
    let referralCode: string;
    while (true) {
      referralCode = generateRandomString(
        generateRandomNumbersArray(RandomReferralCharacters.length, MinimumReferralLength),
        RandomReferralCharacters,
      );
      const checkExist = await this.findUserByConditions({referralCode});
      if (!checkExist) break;
    }
    return referralCode;
  }

  async createUser(createUserInput: CreateUserInput) {
    const findUser = await this.findUserByConditions({phoneNumber: createUserInput.phoneNumber});
    if (findUser) {
      throw new BadRequestException(
        `The phone number ${createUserInput.phoneNumber} was registered!`,
      );
    }
    const findUserByEmail = await this.findUserByConditions({email: createUserInput.email});
    if (findUserByEmail) {
      throw new BadRequestException(`The email ${createUserInput.email} was registered!`);
    }
    const newUser = await this.usersRepository.create({
      ...createUserInput,
      ...(!createUserInput?.imageUrl && {
        imageUrl: 'https://www.studyphim.vn/system/movies/486/thumbnails/medium/Untitled.png',
      }),
      isAdmin: false,
      status: UsersStatus.ACTIVE,
      password: {
        bcrypt: await this._hashPassword(createUserInput.password),
      },
    });

    // TODO: process referral code

    const accessToken = (await generateToken(newUser)).toString();
    newUser.password.tokens = [
      {
        ts: new Date(),
        accessToken,
      },
    ];
    await newUser.save();

    // send email require to active account
    // await this.mailService.sendEmailConfirmation({
    //     email: newUser.email,
    //     // otp: newUser.email,
    //     name: newUser.name,
    //     contactUrl: '',
    //     emailUrl: '',
    // });

    return {
      ...newUser.toJSON(),
      accessToken,
    };
  }

  async updateUser(userId: string, updateUserInput: UpdateUsersInput, selfUserId?: string) {
    if (selfUserId && selfUserId !== userId) {
      throw new BadRequestException(`You don't have permission to update the user`);
    }
    // update exam if update user information here..
    return this.usersRepository.updateById(userId, {
      ...updateUserInput,
      ...(updateUserInput?.password && {
        password: {
          bcrypt: await this._hashPassword(updateUserInput.password),
        },
      }),
    });
  }

  async deletedUser(userId: string) {
    return this.usersRepository.deleteById(userId);
  }

  async lastLoginAt(userId: string) {
    return this.usersRepository.updateById(userId, {lastLoginAt: new Date()});
  }
}
