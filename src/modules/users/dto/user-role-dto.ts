import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUppercase,
} from 'class-validator';

export class UserRoleDto {
  @ApiProperty({
    name: 'usercode',
    type: Number,
    required: true,
    description: 'User code to add role',
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  usercode: number;

  @ApiProperty({
    name: 'roleName',
    type: Number,
    required: true,
    description: 'Role to add',
  })
  @IsString()
  @IsUppercase()
  @IsNotEmpty()
  roleName: string;
}
