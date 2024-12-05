import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { UpdatePermissionDto } from 'src/modules/permissions/dto/permission-update-dto';
import { PermissionsService } from 'src/modules/permissions/permissions.service';

@Controller('/api/v1/permissions')
@ApiTags('Permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}
  //** ---------------------------------------- CREATE PERMISSIONS ---------------------------------------- **//
  @Post()
  @ApiOperation({
    description: 'Create new permission',
  })
  @ApiBody({
    description: 'Create a new permission using PermissionDto',
    type: PermissionDto,
    examples: {
      example1: {
        value: {
          name: 'CEATE',
        },
      },
      example2: {
        value: {
          name: 'DELETE',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Permission created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Permission already exists',
  })
  createPermission(@Body() permission: PermissionDto) {
    return this.permissionsService.createPermission(permission);
  }
  //** ---------------------------------------- GET PERMISSIONS ---------------------------------------- **//
  @Get()
  @ApiOperation({
    description: 'Returns all permissions, given a name, filters them',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description:
      'Given a name, returns the filtered permissions, otherwise, returns all permissions',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions returned correctly',
  })
  getPermissions(@Query('name') name: string) {
    return this.permissionsService.getPermissions(name);
  }
  //** ---------------------------------------- UPDATE PERMISSIONS ---------------------------------------- **//
  @Put()
  @ApiOperation({
    description: 'Update a permiss',
  })
  @ApiBody({
    description: 'Update a permiss ussing UpdatePermissionDto',
    type: UpdatePermissionDto,
    examples: {
      example1: {
        value: {
          originalName: 'CREATE',
          newName: 'DELETE',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Permission updated successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Both permissions exists',
  })
  updatePermission(@Body() updatePermission: UpdatePermissionDto) {
    return this.permissionsService.updatePermission(updatePermission);
  }
  //** ---------------------------------------- DELETE PERMISSIONS ---------------------------------------- **//
  @Delete('/:name')
  @ApiOperation({
    description: 'Given the name, remove the permission with it',
  })
  @ApiParam({
    name: 'name',
    required: true,
    description: 'Name of permission to delete',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Permission deleted correctly',
  })
  @ApiResponse({
    status: 409,
    description: 'Permission not exists',
  })
  deletePermission(@Param('name') name: string) {
    return this.permissionsService.deletePermission(name);
  }
}
