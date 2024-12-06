import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/modules/users/dto/user-dto';
import { UserRoleDto } from 'src/modules/users/dto/user-role-dto';
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

  @Get('/deleted')
  getUsersDeleted(
    @Query('page', GreaterZeroPipe) page: number,
    @Query('size', GreaterZeroPipe) size: number,
    @Query('sortBy') sortBy: string,
    @Query('sort') sort: string,
  ) {
    return this.userService.getUsers(page, size, sortBy, sort, true);
  }

  @Get('/active')
  getUsersActive(
    @Query('page', GreaterZeroPipe) page: number,
    @Query('size', GreaterZeroPipe) size: number,
    @Query('sortBy') sortBy: string,
    @Query('sort') sort: string,
  ) {
    return this.userService.getUsers(page, size, sortBy, sort, false);
  }

  @Put('/:usercode')
  updateUser(@Param('usercode') usercode: number, @Body() user: UserDto) {
    return this.userService.updateUser(usercode, user);
  }

  @Patch('/add-role')
  addRole(@Body() userRole: UserRoleDto) {
    return this.userService.addRole(userRole);
  }

  @Patch('/remove-role/:usercode')
  removeRole(@Param('usercode') usercode: number) {
    return this.userService.removeRole(usercode);
  }

  @Patch('/restore/:usercode')
  restoreUser(@Param('usercode') usercode: number) {
    return this.userService.restoreUser(usercode);
  }

  @Delete('/:usercode')
  deleteUser(@Param('usercode') usercode: number) {
    return this.userService.deleteUser(usercode);
  }
}
