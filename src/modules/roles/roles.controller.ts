import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesService } from 'src/modules/roles/roles.service';

@Controller('api/v1/roles')
@ApiTags('Roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}
}
