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
import { PermissionDto } from 'src/modules/permissions/dto/permission-dto';
import { RoleDto } from 'src/modules/roles/dto/role-dto';
import { RolesService } from 'src/modules/roles/roles.service';

@Controller('api/v1/roles')
@ApiTags('Roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}
  //** ---------------------------------------- CREATE ROLE ---------------------------------------- **//
  @Post()
  @ApiOperation({
    description: 'Creates a new role',
  })
  @ApiBody({
    type: RoleDto,
    description: 'Create a new role through a RoleDto',
    examples: {
      example1: {
        value: {
          name: 'admin',
        },
      },
      example2: {
        value: {
          name: 'user',
          permissions: [{ name: 'CREATE' }, { name: 'UPDATE' }],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
  })
  @ApiResponse({
    status: 409,
    description: /*html*/ ` Role not exists <br />
                            Permission not exists `,
  })
  createRole(@Body() role: RoleDto) {
    return this.rolesService.createRole(role);
  }
  //** ---------------------------------------- GET ROLES ---------------------------------------- **//
  @Get()
  @ApiOperation({
    description: 'Returns all roles, optionally filtering them by name',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter roles based on given name',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Roles returned successfully',
  })
  getRoles(@Query('name') name: string) {
    return this.rolesService.getRoles(name);
  }
  //** ---------------------------------------- UPDATE ROLE ---------------------------------------- **//
  @Put('/:name')
  @ApiOperation({
    description:
      'Updates an existing role, If it does not exist, it creates it',
  })
  @ApiParam({
    name: 'name',
    required: true,
    description: 'Role name to update',
    type: String,
  })
  @ApiBody({
    type: RoleDto,
    description: 'Update or Create one role through a RoleDto',
    examples: {
      example1: {
        value: {
          name: 'admin2',
        },
      },
      example2: {
        value: {
          name: 'superadmin',
          permissions: [{ name: 'CREATE' }],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Rol updated or creted successfully',
  })
  @ApiResponse({
    status: 409,
    description: /*html*/ ` New role alredy exists <br />
                            Permission is not accepted `,
  })
  updateRole(@Param('name') name: string, @Body() role: RoleDto) {
    return this.rolesService.updateRole(name, role);
  }
  //** ---------------------------------------- ADD PERMISSION ---------------------------------------- **//
  @Patch('/add-permission/:name')
  @ApiOperation({
    description: 'Add one permission to role',
  })
  @ApiParam({
    name: 'name',
    required: true,
    description: 'Role name to add permission',
    type: String,
  })
  @ApiBody({
    type: RoleDto,
    description: 'Add one permission to the declared rol trhough PermissionDto',
    examples: {
      example1: {
        value: {
          name: 'READ',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Permission added to role successfully',
  })
  @ApiResponse({
    status: 409,
    description: /*html*/ ` Role not exists <br />
                            Permission not exists <br />
                            Permission alredy exists on this role `,
  })
  addPermission(
    @Param('name') name: string,
    @Body() permission: PermissionDto,
  ) {
    return this.rolesService.addPermission(name, permission);
  }
  //** ---------------------------------------- REMOVE PERMISSION ---------------------------------------- **//
  @Patch('/remove-permission/:name')
  @ApiOperation({
    description: 'Remove one of the role permissions',
  })
  @ApiParam({
    name: 'name',
    required: true,
    description: 'Role name to remove permission',
    type: String,
  })
  @ApiBody({
    type: RoleDto,
    description: 'Removes a permission from the role',
    examples: {
      example1: {
        value: {
          name: 'READ',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Permission remove successfully ',
  })
  @ApiResponse({
    status: 409,
    description: /*html*/ ` Role not exists <br />
                            Permission not exists <br />
                            Permission not exists on this role `,
  })
  removePermission(
    @Param('name') name: string,
    @Body() permission: PermissionDto,
  ) {
    return this.rolesService.removePermission(name, permission);
  }
  //** ---------------------------------------- DELETE ROLE ---------------------------------------- **//
  @Delete('/:name')
  @ApiOperation({
    description: 'Deleted a role',
  })
  @ApiParam({
    name: 'name',
    required: true,
    description: 'Name of the role to delete',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Role deleted succesfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Role not exists',
  })
  deleteRole(@Param('name') name: string) {
    return this.rolesService.deleteRole(name);
  }
}
