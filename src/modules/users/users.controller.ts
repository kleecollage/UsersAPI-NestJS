import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/modules/users/users.service';

@Controller('/api/v1/users')
@ApiTags('Users')
export class UsersController {
  constructor(private userService: UsersService) {}
}
