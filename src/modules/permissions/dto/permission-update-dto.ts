import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePermissionDto {
  @ApiProperty({
    name: 'originalName',
    description: 'Name of permission to update',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  originalName: string;

  @ApiProperty({
    name: 'originalName',
    description: 'New name of permission to update',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  newName: string;
}
