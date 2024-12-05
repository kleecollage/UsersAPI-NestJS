import { Body, Controller, Get, Post } from '@nestjs/common';
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
  getRoles() {
    return this.rolesService.getRoles();
  }
}
