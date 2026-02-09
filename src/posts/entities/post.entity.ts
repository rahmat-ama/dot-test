import { ApiProperty } from '@nestjs/swagger';
import { Category, Post, User } from 'prisma/client/client';

class AuthorInPost implements Pick<User, 'id' | 'name'> {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Budi' })
  name: string;
}

class CategoryInPost implements Pick<Category, 'id' | 'name'> {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Education' })
  name: string;
}

export class PostEntity implements Pick<Post, 'id' | 'title' | 'content'> {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Indonesia Lack of Education' })
  title: string;

  @ApiProperty({
    example: 'The current condition of Education in Indonesia is pretty bad',
  })
  content: string;

  @ApiProperty({ type: AuthorInPost })
  author: AuthorInPost;

  @ApiProperty({ type: CategoryInPost })
  category: CategoryInPost;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}
