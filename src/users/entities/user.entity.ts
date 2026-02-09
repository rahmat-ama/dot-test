import { ApiProperty } from '@nestjs/swagger';
import { Category, Post, User } from 'prisma/client/client';

class CategoryInPost implements Pick<Category, 'id' | 'name'> {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Education' })
  name: string;
}

class PostInUser implements Pick<Post, 'id' | 'title' | 'content'> {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Indonesia Lack of Education' })
  title: string;

  @ApiProperty({
    example: 'The current condition of Education in Indonesia is pretty bad',
  })
  content: string;

  @ApiProperty({ type: CategoryInPost })
  category: CategoryInPost;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}

export class UserEntity implements Pick<User, 'id' | 'email' | 'name'> {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'budi@email.com' })
  email: string;

  @ApiProperty({ name: 'Budi' })
  name: string;

  @ApiProperty({ type: [PostInUser] })
  post?: PostInUser[];

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}
