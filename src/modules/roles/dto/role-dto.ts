import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PermissionDto } from 'src/modules/permissions/dto/permission-dto';

export class RoleDto {
  @ApiProperty({
    name: 'name',
    type: String,
    required: true,
    description: 'Role name',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    name: 'permission',
    type: PermissionDto,
    isArray: true,
    required: false,
    description: 'Permissions array',
  })
  @IsArray()
  @IsOptional()
  @Type(() => PermissionDto)
  permissions?: PermissionDto[] = [];
}
