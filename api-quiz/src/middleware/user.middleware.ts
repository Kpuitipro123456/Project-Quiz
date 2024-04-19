import * as _ from 'lodash';
import * as config from 'config';
import * as httpContext from 'express-http-context';
import {Injectable, NestMiddleware, RequestMethod} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';
import {RouteInfo} from '@nestjs/common/interfaces';
import {EXCLUDED_USER_MIDDLEWARE_ROUTES} from '../shared/constants';
import {IJwtPayload} from '../modules/auth/auth.interface';
import {verifyToken} from '../shared/jwt.helpers';
import {extractToken} from '../shared/helpers';

const baseUrl = config.get('service.baseUrl');

@Injectable()
export class UserMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const routeIsExcluded = EXCLUDED_USER_MIDDLEWARE_ROUTES.some((excludedRoute: RouteInfo) => {
      return (
        req.originalUrl.includes(`${baseUrl}${excludedRoute.path}`) &&
        excludedRoute.method === RequestMethod[req.method as string]
      );
    });

    if (!routeIsExcluded) {
      const user = await this.getUserSession(req);
      if (user) {
        _.set(req, 'user', user);
        httpContext.set('userId', user.id);
        httpContext.set('user', user);
      }
    }
    next();
  }

  async getUserSession(req): Promise<IJwtPayload | null> {
    const accessToken = extractToken(req.headers.authorization || '');
    if (!accessToken) {
      return null;
    }
    const user: IJwtPayload = await verifyToken(accessToken);
    return user;
  }
}

export function getUserId() {
  return httpContext.get('userId');
}

export function getUserData(key?: keyof IJwtPayload) {
  if (!key) {
    return httpContext.get('user');
  }
  return httpContext.get('user') ? (httpContext.get('user') as IJwtPayload)[key] : null;
}
