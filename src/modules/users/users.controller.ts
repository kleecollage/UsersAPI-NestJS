import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/modules/users/dto/user-dto';
import { UsersService } from 'src/modules/users/users.service';
import { GreaterZeroPipe } from 'src/pipes/greater-zero/greater-zero.pipe';

@Controller('/api/v1/users')
@ApiTags('Users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  createUser(@Body() user: UserDto) {
    return this.userService.createUser(user);
  }

  @Get()
  getUsers(
    @Query('page', GreaterZeroPipe) page: number,
    @Query('size', GreaterZeroPipe) size: number,
    @Query('sortBy') sortBy: string,
    @Query('sort') sort: string,
  ) {
    return this.userService.getUsers(page, size, sortBy, sort);
  }

  @Put('/:usercode')
  updateUser(@Param('usercode') usercode: number, @Body() user: UserDto) {
    return this.userService.updateUser(usercode, user);
  }
}
