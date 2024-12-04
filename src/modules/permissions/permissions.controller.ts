import { Controller } from '@nestjs/common';
import { PermissionsService } from 'src/modules/permissions/permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}
}
