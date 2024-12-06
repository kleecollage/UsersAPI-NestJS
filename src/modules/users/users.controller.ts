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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from 'src/modules/users/dto/user-dto';
import { UserRoleDto } from 'src/modules/users/dto/user-role-dto';
import { UsersService } from 'src/modules/users/users.service';
import { GreaterZeroPipe } from 'src/pipes/greater-zero/greater-zero.pipe';

@Controller('/api/v1/users')
@ApiTags('Users')
export class UsersController {
  constructor(private userService: UsersService) {}
  //** ---------------------------------------- CREATE USER ---------------------------------------- **//
  @Post()
  @ApiOperation({
    description: 'Create a new user',
  })
  @ApiBody({
    type: UserDto,
    description: 'Create a user using UserDto',
    examples: {
      example1: {
        value: {
          name: 'John Doe',
          email: 'j.doe@mail.com',
          birthdate: '1953-03-16',
          role: {
            name: 'ADMIN',
          },
        },
      },
      example2: {
        value: {
          name: 'Jane Smith',
          email: 'j.smith@mail.com',
          birthdate: '1990-02-23',
          role: null,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: 409,
    description: /* html */ ` User email already exists <br />
                              Role not allowed `,
  })
  createUser(@Body() user: UserDto) {
    return this.userService.createUser(user);
  }
  //** ---------------------------------------- GET USERS ---------------------------------------- **//
  @Get()
  @ApiOperation({
    description: 'Resturn all users',
  })
  @ApiQuery({
    name: 'page',
    type: String,
    required: false,
    description: 'Current page',
  })
  @ApiQuery({
    name: 'size',
    type: String,
    required: false,
    description: 'Count of registers per page',
  })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    description: 'Property to sort by',
  })
  @ApiQuery({
    name: 'sort',
    type: String,
    required: false,
    description: 'Sorting mode (ASC or DESC)',
  })
  @ApiResponse({
    status: 201,
    description: 'Users returned successfully',
  })
  getUsers(
    @Query('page', GreaterZeroPipe) page: number,
    @Query('size', GreaterZeroPipe) size: number,
    @Query('sortBy') sortBy: string,
    @Query('sort') sort: string,
  ) {
    return this.userService.getUsers(page, size, sortBy, sort);
  }
  //** ---------------------------------------- GET DELETED USERS ---------------------------------------- **//
  @Get('/deleted')
  @ApiOperation({
    description: 'Return al users with status deleted: true',
  })
  @ApiQuery({
    name: 'page',
    type: String,
    required: false,
    description: 'Current page',
  })
  @ApiQuery({
    name: 'size',
    type: String,
    required: false,
    description: 'Count of registers per page',
  })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    description: 'Property to sort by',
  })
  @ApiQuery({
    name: 'sort',
    type: String,
    required: false,
    description: 'Sorting mode (ASC or DESC)',
  })
  @ApiResponse({
    status: 201,
    description: 'Users returned successfully',
  })
  getUsersDeleted(
    @Query('page', GreaterZeroPipe) page: number,
    @Query('size', GreaterZeroPipe) size: number,
    @Query('sortBy') sortBy: string,
    @Query('sort') sort: string,
  ) {
    return this.userService.getUsers(page, size, sortBy, sort, true);
  }
  //** ---------------------------------------- GET ACTIVE USERS ---------------------------------------- **//
  @Get('/active')
  @ApiOperation({
    description: 'Return al users with status deleted: false',
  })
  @ApiQuery({
    name: 'size',
    type: String,
    required: false,
    description: 'Count of registers per page',
  })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    description: 'Property to sort by',
  })
  @ApiQuery({
    name: 'sort',
    type: String,
    required: false,
    description: 'Sorting mode (ASC or DESC)',
  })
  @ApiResponse({
    status: 201,
    description: 'Users returned successfully',
  })
  getUsersActive(
    @Query('page', GreaterZeroPipe) page: number,
    @Query('size', GreaterZeroPipe) size: number,
    @Query('sortBy') sortBy: string,
    @Query('sort') sort: string,
  ) {
    return this.userService.getUsers(page, size, sortBy, sort, false);
  }
  //** ---------------------------------------- UPDATE USER ---------------------------------------- **//
  @Put('/:usercode')
  @ApiOperation({
    description:
      'Updates an existing user, if the user does not exist, creates it',
  })
  @ApiParam({
    name: 'usercode',
    type: Number,
    required: true,
    description: 'User code',
  })
  @ApiBody({
    type: UserDto,
    description: 'Update/Crate one user using UserDto',
    examples: {
      example1: {
        value: {
          name: 'JohnDoe2',
          email: 'j.doe.updated@mail.com',
          birthdate: '1990-05-24',
          role: null,
        },
      },
      example2: {
        value: {
          name: 'J.Smith2',
          email: 'jane_updated@mail.com',
          birthdate: '2000-03-01',
          role: {
            name: 'ADMIN',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: 409,
    description: /* html */ ` User email already exists <br />
                              Role not allowed `,
  })
  updateUser(@Param('usercode') usercode: number, @Body() user: UserDto) {
    return this.userService.updateUser(usercode, user);
  }
  //** ---------------------------------------- ADD ROLE ---------------------------------------- **//
  @Patch('/add-role')
  @ApiOperation({
    description: 'Add an existing role to user',
  })
  @ApiBody({
    type: UserRoleDto,
    description: 'Add an existing role UserRoleDto',
    examples: {
      example1: {
        value: {
          name: 'ADMIN',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Role added correctly',
  })
  @ApiResponse({
    status: 409,
    description: /* html */ ` User not exists <br />
                              Role not allowed
                              User has already one role `,
  })
  addRole(@Body() userRole: UserRoleDto) {
    return this.userService.addRole(userRole);
  }
  //** ---------------------------------------- REMOVE ROLE ---------------------------------------- **//
  @Patch('/remove-role/:usercode')
  @ApiOperation({
    description: 'Remove the role from the user',
  })
  @ApiParam({
    name: 'usercode',
    type: Number,
    required: true,
    description: 'User code',
  })
  @ApiResponse({
    status: 201,
    description: 'User role removed successfully',
  })
  @ApiResponse({
    status: 409,
    description: /* html */ ` User not exists <br />
                              Role not allowed
                              User has already one role `,
  })
  removeRole(@Param('usercode') usercode: number) {
    return this.userService.removeRole(usercode);
  }
  //** ---------------------------------------- RESTORE USER ---------------------------------------- **//
  @Patch('/restore/:usercode')
  @ApiOperation({
    description: 'Given the user code, change their delete status to false ',
  })
  @ApiParam({
    name: 'usercode',
    type: Number,
    required: true,
    description: 'User code',
  })
  @ApiResponse({
    status: 201,
    description: 'User deleted status changed successfully',
  })
  @ApiResponse({
    status: 409,
    description: /* html */ ` User is not marked as deleted <br />
                              User not exists `,
  })
  restoreUser(@Param('usercode') usercode: number) {
    return this.userService.restoreUser(usercode);
  }
  //** ---------------------------------------- DELETE USER ---------------------------------------- **//
  @Delete('/:usercode')
  @ApiOperation({
    description: 'Given the user code, change their delete status to true ',
  })
  @ApiParam({
    name: 'usercode',
    type: Number,
    required: true,
    description: 'User code',
  })
  @ApiResponse({
    status: 201,
    description: 'User deleted status changed successfully',
  })
  @ApiResponse({
    status: 409,
    description: /* html */ ` User is already marked as deleted <br />
                              User not exists `,
  })
  deleteUser(@Param('usercode') usercode: number) {
    return this.userService.deleteUser(usercode);
  }
}
