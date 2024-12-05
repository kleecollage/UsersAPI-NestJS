import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PermissionsService } from 'src/modules/permissions/permissions.service';
import { RoleDto } from 'src/modules/roles/dto/role-dto';
import { Role } from 'src/modules/roles/schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private permissionService: PermissionsService,
  ) {}

  //** ---------------------------------------- CREATE ROLE ---------------------------------------- **//
  async createRole(role: RoleDto) {
    const roleExists = await this.roleModel.findOne({ name: role.name });
    if (roleExists) throw new ConflictException('Role already exists');

    const permissionsRole: Types.ObjectId[] = [];

    if (role.permissions && role.permissions.length > 0) {
      for (const permission of role.permissions) {
        const permissionsFound =
          await this.permissionService.findPermissionByName(permission.name);

        if (!permissionsFound) {
          throw new ConflictException(
            `Permission ${permission.name} not exists`,
          );
        }
        permissionsRole.push(permissionsFound._id);
      }
    }

    const r = new this.roleModel({
      name: role.name,
      permissions: permissionsRole,
    });

    return r.save();
  }

  //** ---------------------------------------- CREATE ROLE ---------------------------------------- **//
  getRoles(name: string) {
    const filter = {};

    if (name) {
      filter['name'] = {
        $regex: name.trim(),
        $options: 'i', // i = ignore
      };
    }

    return this.roleModel.find(filter).populate('permissions'); // populate return the entire object
  }
}
