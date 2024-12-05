import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PermissionDto } from 'src/modules/permissions/dto/permission-dto';
import { PermissionsService } from 'src/modules/permissions/permissions.service';
import { RoleDto } from 'src/modules/roles/dto/role-dto';
import { Role } from 'src/modules/roles/schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private permissionService: PermissionsService,
  ) {}
  //** ---------------------------------------- FIND ROLE BY NAME ---------------------------------------- **//
  findRoleByName(name: string) {
    return this.roleModel.findOne({ name });
  }
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
  //** ---------------------------------------- GET ROLES WITH QUERIES ---------------------------------------- **//
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
  //** ---------------------------------------- UPDATE ROLE ---------------------------------------- **//
  async updateRole(name: string, role: RoleDto) {
    const roleExists = await this.findRoleByName(name);
    if (roleExists) {
      const newRoleExists = await this.findRoleByName(role.name);
      if (newRoleExists && newRoleExists.name != name)
        throw new ConflictException(
          `Role ${newRoleExists.name} already exists`,
        );

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

        await roleExists.updateOne({
          name: role.name,
          permissions: permissionsRole,
        });

        return this.findRoleByName(role.name);
      } else return this.createRole(role);
    }
  }
  //** ---------------------------------------- ADD PERMISSIONS ---------------------------------------- **//
  async addPermission(name: string, permission: PermissionDto) {
    const roleExists = await this.findRoleByName(name);

    if (roleExists) {
      const permissionExists =
        await this.permissionService.findPermissionByName(permission.name);

      if (permissionExists) {
        const permissionRoleExists = await this.roleModel.findOne({
          name: roleExists.name,
          permissions: {
            $in: permissionExists._id,
          },
        });

        if (!permissionRoleExists) {
          await roleExists.updateOne({
            $push: {
              permissions: permissionExists._id,
            },
          });

          return this.findRoleByName(name);
        } else
          throw new ConflictException('Permission already exists on this role');
      } else throw new ConflictException('Permission not exists');
    } else throw new ConflictException('Role not exists');
  }
}
