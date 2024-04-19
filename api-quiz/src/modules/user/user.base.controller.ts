import {Controller} from '@nestjs/common';
import {UsersService} from './user.service';

@Controller()
export class UsersBaseController {
  constructor(protected readonly usersService: UsersService) {}
}
