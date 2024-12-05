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
import { PermissionDto } from 'src/modules/permissions/dto/permission-dto';
import { RoleDto } from 'src/modules/roles/dto/role-dto';
import { RolesService } from 'src/modules/roles/roles.service';

@Controller('api/v1/roles')
@ApiTags('Roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  createRole(@Body() role: RoleDto) {
    return this.rolesService.createRole(role);
  }

  @Get()
  getRoles(@Query('name') name: string) {
    return this.rolesService.getRoles(name);
  }

  @Put('/:name')
  updateRole(@Param('name') name: string, @Body() role: RoleDto) {
    return this.rolesService.updateRole(name, role);
  }

  @Patch('/add-permission/:name')
  addPermission(
    @Param('name') name: string,
    @Body() permission: PermissionDto,
  ) {
    return this.rolesService.addPermission(name, permission);
  }

  @Patch('/remove-permission/:name')
  removePermission(
    @Param('name') name: string,
    @Body() permission: PermissionDto,
  ) {
    return this.rolesService.removePermission(name, permission);
  }

  @Delete('/:name')
  deleteRole(@Param('name') name: string) {
    return this.rolesService.deleteRole(name);
  }
}
