import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Education', description: 'Category name' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'About system and condition of education' })
  @IsNotEmpty({ message: 'Please fill the description of this category' })
  @IsString()
  description: string;
}
