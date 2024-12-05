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
import { PermissionDto } from 'src/modules/permissions/dto/permission-dto';
import { UpdatePermissionDto } from 'src/modules/permissions/dto/permission-update-dto';
import { PermissionsService } from 'src/modules/permissions/permissions.service';

@Controller('/api/v1/permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @Post()
  createPermission(@Body() permission: PermissionDto) {
    return this.permissionsService.createPermission(permission);
  }

  @Get()
  getPermissions(@Query('name') name: string) {
    return this.permissionsService.getPermissions(name);
  }

  @Put()
  updatePermission(@Body() updatePermission: UpdatePermissionDto) {
    return this.permissionsService.updatePermission(updatePermission);
  }

  @Delete('/:name')
  deletePermission(@Param('name') name: string) {
    return this.permissionsService.deletePermission(name);
  }
}
