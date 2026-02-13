import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'prisma/client/client';
import { PostRepository } from './post.repository';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(private postRepo: PostRepository) {}

  async getPosts(): Promise<PostEntity[]> {
    const posts = await this.postRepo.getAll();

    return posts;
  }

  async createPost(
    createPostData: Prisma.PostUncheckedCreateInput,
  ): Promise<PostEntity> {
    const post = await this.postRepo.create(createPostData);

    return post;
  }

  async getOnePost(id: number): Promise<PostEntity> {
    const post = await this.postRepo.getOne(id);

    if (!post) {
      throw new NotFoundException('User not found');
    }

    return post;
  }

  async updatePost(
    id: number,
    updatePostData: Prisma.PostUncheckedUpdateInput,
  ): Promise<PostEntity> {
    const post = await this.postRepo.update(id, updatePostData);

    return post;
  }

  async deletePost(id: number): Promise<PostEntity> {
    const deletedPost = await this.postRepo.delete(id);

    return deletedPost;
  }
}
