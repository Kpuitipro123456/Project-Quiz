export enum UsersStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}

export const saltRounds = 10;

export enum UserPermission {
  ReadUser = 'read_user',
  CreateUser = 'create_user',
  UpdateUser = 'update_user',
  DeleteUser = 'delete_user',
}

export const filtersText: string[] = ['name', 'username'];

export enum Genders {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export const LIMIT_USERS_JOINED = 6;

export const RandomReferralCharacters = [
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // letters uppercase
  'abcdefghijklmnopqrstuvwxyz', // letters lowercase
  '0123456789', // numbers
  // '!@#$%^&', // either
];

export const MinimumReferralLength = 6;
