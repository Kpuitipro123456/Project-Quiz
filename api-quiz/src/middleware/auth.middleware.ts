import * as _ from 'lodash';
import {Injectable, NestMiddleware, UnauthorizedException} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';
import {extractToken} from '../shared/helpers';
import {verifyToken} from '../shared/jwt.helpers';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req, res: Response, next: NextFunction) {
    const token = extractToken(req.headers.authorization || '');
    try {
      const decodedToken = await verifyToken(token);
      next();
    } catch (error) {
      if (_.get(error, 'name', '') === 'TokenExpiredError') {
        throw new UnauthorizedException('Token Expired');
      }
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
