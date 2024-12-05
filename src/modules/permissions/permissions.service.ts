import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PermissionDto } from 'src/modules/permissions/dto/permission-dto';
import { Permission } from 'src/modules/permissions/schemas/permission.schema';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) {}

  async createPermission(permission: PermissionDto) {
    const permissionExists = await this.permissionModel.findOne({
      name: permission.name,
    });

    if (permissionExists) {
      throw new ConflictException('Permission already exists');
    }

    const p = new this.permissionModel(permission);

    return p.save();
  }
}
