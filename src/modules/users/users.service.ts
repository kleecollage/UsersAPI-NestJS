import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RolesService } from 'src/modules/roles/roles.service';
import { UserDto } from 'src/modules/users/dto/user-dto';
import { UserRoleDto } from 'src/modules/users/dto/user-role-dto';
import { User } from 'src/modules/users/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => RolesService))
    private roleService: RolesService,
  ) {}
  //** ---------------------------------------- FIND USER BY EMAIL ---------------------------------------- **//
  findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).populate({
      path: 'role',
      populate: {
        path: 'permissions',
        model: 'Permission',
      },
    });
  }
  //** ---------------------------------------- FIND USER BY USERCODE ---------------------------------------- **//
  findUserByUsercode(usercode: number) {
    return this.userModel.findOne({ usercode }).populate({
      path: 'role',
      populate: {
        path: 'permissions',
        model: 'Permission',
      },
    });
  }
  //** ---------------------------------------- COUNT USERS WITH ROLE ---------------------------------------- **//
  async usersWithRole(roleName: string) {
    const usersWithRole = await this.userModel.aggregate([
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'roles',
        },
      },
      {
        $match: {
          'roles.name': roleName.trim().toUpperCase(),
        },
      },
      {
        $count: 'count',
      },
    ]);

    if (usersWithRole.length > 0) return usersWithRole[0].count;
    else return 0;
  }
  //** ---------------------------------------- CREATE USER ---------------------------------------- **//
  async createUser(user: UserDto) {
    const userExists = await this.findUserByEmail(user.email);

    if (userExists) {
      throw new ConflictException(
        `User with email: ${user.email}. Already exists`,
      );
    }

    let roleId: Types.ObjectId = null;
    if (user.role) {
      const roleExists = await this.roleService.findRoleByName(user.role.name);
      if (!roleExists)
        throw new ConflictException(`Role: ${user.role.name} not allowed`);
      else roleId = roleExists._id;
    }

    const nUsers = await this.userModel.countDocuments();
    const u = new this.userModel({
      ...user,
      usercode: nUsers + 1,
      role: roleId,
    });

    await u.save();

    return this.findUserByEmail(user.email);
  }
  //** ---------------------------------------- GET USERS ---------------------------------------- **//
  async getUsers(
    page: number,
    size: number,
    sortBy: string,
    sort: string,
    deleted?: boolean,
  ) {
    const findOptions = {};
    if (deleted != undefined) findOptions['deleted'] = deleted;

    const total = await this.userModel.countDocuments(findOptions);
    const totalPages = Math.ceil(total / size);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1 && page <= totalPages;
    const nextPage = hasNextPage ? page + 1 : null;
    const pevPage = hasPrevPage ? page - 1 : null;
    const sortOptions = {};
    const skip = (page - 1) * size;

    if (sortBy && sort) {
      switch (sort.toUpperCase()) {
        case 'ASC':
          sortOptions[sortBy] = 1;
          break;
        case 'DESC':
          sortOptions[sortBy] = -1;
          break;
      }
    } else if (sortBy) {
      sortOptions[sortBy] = 1;
    }

    const users: User[] = await this.userModel
      .find(findOptions)
      .sort(sortOptions)
      .skip(skip)
      .limit(size)
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
          model: 'Permission',
        },
      });

    return {
      content: users,
      page,
      size,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage,
      pevPage,
    };
  }
  //** ---------------------------------------- UPDATE USER ---------------------------------------- **//
  async updateUser(usercode: number, user: UserDto) {
    const userExists = await this.findUserByUsercode(usercode);

    if (userExists) {
      if (userExists.email != user.email) {
        const emailExists = await this.findUserByEmail(user.email);
        if (emailExists)
          throw new ConflictException(`Email: ${user.email}. Already exists`);
      }

      let roleId: Types.ObjectId = null;
      if (user.role) {
        const roleExists = await this.roleService.findRoleByName(
          user.role.name,
        );
        if (!roleExists)
          throw new ConflictException(`Role: ${user.role.name} not allowed`);
        else roleId = roleExists._id;
      }

      await userExists.updateOne({
        ...user,
        role: roleId,
      });

      return this.findUserByUsercode(usercode);
    } else return this.createUser(user);
  }
  //** ---------------------------------------- ADD ROLE ---------------------------------------- **//
  async addRole(userRole: UserRoleDto) {
    const userExists = await this.findUserByUsercode(userRole.usercode);
    if (userExists) {
      if (userExists.role) {
        throw new ConflictException(
          `User with usercode: ${userRole.usercode} already have a role`,
        );
      } else {
        const roleExist = await this.roleService.findRoleByName(
          userRole.roleName,
        );

        if (roleExist) {
          await userExists.updateOne({ role: roleExist._id });

          return this.findUserByUsercode(userRole.usercode);
        } else {
          throw new ConflictException(
            `Role ${userRole.roleName} is not aviable`,
          );
        }
      }
    } else {
      throw new ConflictException(
        `User with usercode ${userRole.usercode} not exists`,
      );
    }
  }
  //** ---------------------------------------- REMOVE ROLE ---------------------------------------- **//
  async removeRole(usercode: number) {
    const userExists = await this.findUserByUsercode(usercode);
    if (userExists) {
      if (userExists.role) {
        await userExists.updateOne({ role: null });

        return this.findUserByUsercode(usercode);
      } else {
        throw new ConflictException(
          `User with usercode: ${usercode}. Has no role assigned`,
        );
      }
    } else
      throw new ConflictException(`User with usercode ${usercode} not exists`);
  }
  //** ---------------------------------------- REMOVE USER ---------------------------------------- **//
  async deleteUser(usercode: number) {
    const userExists = await this.findUserByUsercode(usercode);
    if (userExists) {
      if (userExists.deleted) {
        throw new ConflictException(
          `User with usercode ${usercode} is already deleted`,
        );
      } else {
        await userExists.updateOne({ deleted: true });

        return this.findUserByUsercode(usercode);
      }
    } else
      throw new ConflictException(`User with usercode ${usercode} not exists`);
  }
  //** ---------------------------------------- RESTORE USER ---------------------------------------- **//
  async restoreUser(usercode: number) {
    const userExists = await this.findUserByUsercode(usercode);
    if (userExists) {
      if (!userExists.deleted) {
        throw new ConflictException(
          `User with usercode ${usercode} is not deleted`,
        );
      } else {
        await userExists.updateOne({ deleted: false });

        return this.findUserByUsercode(usercode);
      }
    } else
      throw new ConflictException(`User with usercode ${usercode} not exists`);
  }
}
