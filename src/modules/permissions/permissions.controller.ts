import { Body, Controller, Post } from '@nestjs/common';
import { PermissionDto } from 'src/modules/permissions/dto/permission-dto';
import { PermissionsService } from 'src/modules/permissions/permissions.service';

@Controller('/api/v1/permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @Post()
  createPermission(@Body() permission: PermissionDto) {
    return this.permissionsService.createPermission(permission);
  }
}
