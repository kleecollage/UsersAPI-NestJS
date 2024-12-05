import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PermissionDto } from 'src/modules/permissions/dto/permission-dto';
import { UpdatePermissionDto } from 'src/modules/permissions/dto/permission-update-dto';
import { Permission } from 'src/modules/permissions/schemas/permission.schema';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) {}

  //** ---------------------------------------- CREATE PERMISSIONS ---------------------------------------- **//
  async createPermission(permission: PermissionDto) {
    const permissionExists = await this.permissionModel.findOne({
      name: permission.name,
    });

    if (permissionExists)
      throw new ConflictException('Permission already exists');

    const p = new this.permissionModel(permission);

    return p.save();
  }

  //** ---------------------------------------- GET PERMISSIONS WITH QUERYS ---------------------------------------- **//
  getPermissions(name: string) {
    const filter = {};
    if (name) {
      filter['name'] = {
        $regex: name.trim(),
        $options: 'i',
      };
    }
    return this.permissionModel.find(filter);
  }

  //** ---------------------------------------- UPDATE PERMISSIONS ---------------------------------------- **//
  async updatePermission(updatePermission: UpdatePermissionDto) {
    const permissionExists = await this.permissionModel.findOne({
      name: updatePermission.originalName,
    });

    const newPermissionExists = await this.permissionModel.findOne({
      name: updatePermission.newName,
    });

    if (permissionExists && !newPermissionExists) {
      await permissionExists.updateOne({
        name: updatePermission.newName,
      });

      return this.permissionModel.findById(permissionExists._id);
    } else if (!permissionExists) {
      const permission = new PermissionDto();
      permission.name = updatePermission.originalName;

      return this.createPermission(permission);
    } else {
      throw new ConflictException('This permission is not updatable');
    }
  }

  //** ---------------------------------------- DELETE PERMISSION ---------------------------------------- **//
  async deletePermission(name: string) {
    const permissionExists = await this.permissionModel.findOne({ name });

    if (permissionExists) {
      return permissionExists.deleteOne();
    } else {
      throw new ConflictException('This permission not exists');
    }
  }
}
