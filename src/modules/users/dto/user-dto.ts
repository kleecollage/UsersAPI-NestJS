import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { RoleDto } from 'src/modules/roles/dto/role-dto';

export class UserDto {
  @ApiProperty({
    name: 'name',
    type: String,
    required: true,
    description: 'User name',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    name: 'email',
    type: String,
    required: true,
    description: 'User email',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    name: 'birthdate',
    type: Date,
    required: true,
    description: 'User birthdate',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  birthdate!: Date;

  @ApiProperty({
    name: 'role',
    type: RoleDto,
    required: false,
    description: 'User role',
  })
  @Type(() => RoleDto)
  @IsOptional()
  @IsObject()
  role?: RoleDto;
}
