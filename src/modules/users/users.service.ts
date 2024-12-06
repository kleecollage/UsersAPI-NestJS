import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RolesService } from 'src/modules/roles/roles.service';
import { UserDto } from 'src/modules/users/dto/user-dto';
import { User } from 'src/modules/users/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
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
  //** ---------------------------------------- CREATE USER ---------------------------------------- **//
  async createUser(user: UserDto) {
    const userExists = await this.findUserByEmail(user.email);

    if (userExists) {
      throw new ConflictException(
        `User with email: ${user.email}. Already exists`,
      );
    }

    if (user.role) {
      const roleExists = await this.roleService.findRoleByName(user.role.name);
      if (!roleExists)
        throw new ConflictException(`Role: ${user.role.name} not allowed`);
      else user.role = roleExists;
    }

    const nUsers = await this.userModel.countDocuments();
    const u = new this.userModel({
      userCode: nUsers + 1,
      ...user,
    });

    await u.save();

    return this.findUserByEmail(user.email);
  }
  //** ---------------------------------------- GET USERS ---------------------------------------- **//
  async getUsers(page: number, size: number, sortBy: string, sort: string) {
    const skip = (page - 1) * size;
    const total = await this.userModel.countDocuments();
    const totalPages = Math.ceil(total / size);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1 && page <= totalPages;
    const nextPage = hasNextPage ? page + 1 : null;
    const pevPage = hasPrevPage ? page - 1 : null;
    const sortOptions = {};

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
      .find()
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
}
