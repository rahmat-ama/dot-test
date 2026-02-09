import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ example: 'Indonesia Lack of Education', required: true })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Title has maximum 100 characters' })
  title: string;

  @ApiProperty({ example: 1, required: true })
  @IsOptional()
  @IsInt({ message: 'User Id must be a valid integer' })
  authorId: number;

  @ApiProperty({ example: 1, required: true })
  @IsOptional()
  @IsInt({ message: 'Category Id must be a valid integer' })
  categoryId: number;

  @ApiProperty({
    example: 'The current condition of Education in Indonesia is bad enough',
  })
  @IsOptional()
  @IsString()
  content: string;
}
