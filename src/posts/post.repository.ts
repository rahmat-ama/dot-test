import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'prisma/client/client';
import handlePrismaError from 'src/common/prisma-error-check.helper';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostRepository {
  constructor(private prisma: PrismaService) {}

  private baseSelect = {
    id: true,
    title: true,
    author: { select: { id: true, name: true } },
    category: { select: { id: true, name: true } },
    content: true,
  };

  async getAll(): Promise<PostEntity[]> {
    const posts = await this.prisma.post.findMany({
      orderBy: { updatedAt: 'desc' },
      select: {
        ...this.baseSelect,
        updatedAt: true,
      },
    });

    return posts;
  }

  async create(
    createData: Prisma.PostUncheckedCreateInput,
  ): Promise<PostEntity> {
    try {
      const post = await this.prisma.post.create({
        data: createData,
        select: {
          ...this.baseSelect,
          createdAt: true,
        },
      });

      return post;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async getOne(id: number): Promise<PostEntity | null> {
    const post = await this.prisma.post.findUnique({
      where: { id: id },
      select: {
        ...this.baseSelect,
        createdAt: true,
      },
    });

    return post;
  }

  async update(
    id: number,
    updateData: Prisma.PostUncheckedUpdateInput,
  ): Promise<PostEntity> {
    try {
      const post = await this.prisma.post.update({
        where: { id: id },
        data: updateData,
        select: {
          ...this.baseSelect,
          updatedAt: true,
        },
      });

      return post;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async delete(id: number): Promise<PostEntity> {
    try {
      return await this.prisma.post.delete({
        where: { id: id },
        select: this.baseSelect,
      });
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}
