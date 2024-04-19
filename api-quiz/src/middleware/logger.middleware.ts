import {Injectable, NestMiddleware, RequestMethod} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';
import {RouteInfo} from '@nestjs/common/interfaces';
import * as config from 'config';
import {EXCLUDED_LOGGER_MIDDLEWARE_ROUTES} from '../shared/constants';
const baseUrl = config.get('service.baseUrl');

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    /* tslint:disable */
    console.log(`${req.method} ${req.originalUrl}`);

    const routeIsExcluded = EXCLUDED_LOGGER_MIDDLEWARE_ROUTES.some((excludedRoute: RouteInfo) => {
      return (
        req.originalUrl.includes(`${baseUrl}${excludedRoute.path}`) &&
        excludedRoute.method === RequestMethod[req.method as string]
      );
    });

    if (!routeIsExcluded) {
    }
    next();
  }
}
