import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Indonesia Lack of Education', required: true })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MaxLength(100, { message: 'Title has maximum 100 characters' })
  title: string;

  @ApiProperty({ example: 1, required: true })
  @IsInt({ message: 'User ID must be a valid integer' })
  authorId: number;

  @ApiProperty({ example: 1, required: true })
  @IsInt({ message: 'Category ID must be a valid integer' })
  categoryId: number;

  @ApiProperty({
    example: 'The current condition of Education in Indonesia is pretty bad',
    required: true,
  })
  @IsNotEmpty({ message: 'Please fill the Post description' })
  @IsString()
  content: string;
}
