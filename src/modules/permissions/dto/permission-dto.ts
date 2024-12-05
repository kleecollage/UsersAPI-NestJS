import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PermissionDto {
  @ApiProperty({
    name: 'name',
    type: String,
    description: 'Permission name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
