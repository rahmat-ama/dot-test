import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'prisma/client/client';
import handlePrismaError from 'src/common/prisma-error-check.helper';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(private prisma: PrismaService) {}

  private baseSelect = {
    id: true,
    name: true,
    description: true,
  };

  private postSelect = {
    id: true,
    title: true,
    content: true,
    author: {
      select: {
        id: true,
        name: true,
      },
    },
  };

  async getAll(): Promise<CategoryEntity[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { updatedAt: 'desc' },
      select: {
        ...this.baseSelect,
        post: {
          select: {
            ...this.postSelect,
            createdAt: true,
          },
        },
        updatedAt: true,
      },
    });

    return categories;
  }

  async create(
    createData: Prisma.CategoryUncheckedCreateInput,
  ): Promise<CategoryEntity> {
    try {
      const category = await this.prisma.category.create({
        data: createData,
        select: {
          ...this.baseSelect,
          post: {
            select: {
              ...this.postSelect,
              createdAt: true,
            },
          },
          createdAt: true,
        },
      });

      return category;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async getOne(id: number): Promise<CategoryEntity | null> {
    const category = await this.prisma.category.findUnique({
      where: { id: id },
      select: {
        ...this.baseSelect,
        post: {
          select: {
            ...this.postSelect,
            createdAt: true,
          },
        },
        createdAt: true,
      },
    });

    return category;
  }

  async update(
    id: number,
    updateData: Prisma.CategoryUncheckedUpdateInput,
  ): Promise<CategoryEntity> {
    try {
      const category = await this.prisma.category.update({
        where: { id: id },
        data: updateData,
        select: {
          ...this.baseSelect,
          post: {
            select: {
              ...this.postSelect,
              createdAt: true,
            },
          },
          updatedAt: true,
        },
      });

      return category;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async delete(id: number): Promise<CategoryEntity> {
    try {
      return await this.prisma.category.delete({
        where: { id: id },
        select: {
          ...this.baseSelect,
          post: {
            select: {
              ...this.postSelect,
            },
          },
        },
      });
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}
