import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesModule } from 'src/modules/roles/roles.module';
import { User, userSchema } from 'src/modules/users/schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
    RolesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}