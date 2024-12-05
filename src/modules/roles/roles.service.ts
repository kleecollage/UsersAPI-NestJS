import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PermissionsService } from 'src/modules/permissions/permissions.service';
import { Role } from 'src/modules/roles/schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private permissionService: PermissionsService,
  ) {}
}
