import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
}
