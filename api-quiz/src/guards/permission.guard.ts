import {CanActivate, ExecutionContext} from '@nestjs/common';
import * as httpContext from 'express-http-context';

export class BaseGuard implements CanActivate {
  private permission: string[];
  constructor(permission: string[]) {
    this.permission = permission;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const user = httpContext.get('user');
      if (!user) {
        return false;
      }
      for (const permission of user.permissions) {
        if (this.permission.includes(permission)) {
          return true;
        }
      }
      return false;
    } catch (error) {
      /* tslint:disable */
      console.log('BaseGuard.canActivate', error);
      return false;
    }
  }
}

export const PermissionGuard = (permission: string[]): CanActivate => {
  return new BaseGuard(permission);
};
