import { ApiProperty } from '@nestjs/swagger';
import { Category, Post, User } from 'prisma/client/client';

class PostAuthor implements Pick<User, 'id' | 'name'> {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Budi' })
  name: string;
}

class CategoryPost implements Pick<Post, 'id' | 'title' | 'content'> {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Indonesia Lack of Education' })
  title: string;

  @ApiProperty({
    example: 'The current condition of Education in Indonesia is pretty bad',
  })
  content: string;

  @ApiProperty({ type: PostAuthor })
  author: PostAuthor;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}

export class CategoryEntity implements Pick<
  Category,
  'id' | 'name' | 'description'
> {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Education' })
  name: string;

  @ApiProperty({
    example: 'Category about system and condition of education',
    required: true,
  })
  description: string;

  @ApiProperty({ type: [CategoryPost], required: false })
  post?: CategoryPost[];

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}
