import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionsModule } from 'src/modules/permissions/permissions.module';
import { Role, roleSchema } from 'src/modules/roles/schemas/role.schema';
import { UsersModule } from 'src/modules/users/users.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: roleSchema,
      },
    ]),
    PermissionsModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
