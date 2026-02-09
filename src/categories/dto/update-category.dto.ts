import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Education' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ example: 'About system and condition of education' })
  @IsOptional()
  @IsString()
  description: string;
}
