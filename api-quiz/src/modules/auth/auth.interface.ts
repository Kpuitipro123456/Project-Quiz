export interface IJwtPayload {
  id?: string;
  name?: string;
  userName?: string;
  phoneNumber?: string;
  email?: string;
  imageUrl?: string;
  roles?: any;

  lastLoginAt?: Date;
  createdAt?: Date;
}
