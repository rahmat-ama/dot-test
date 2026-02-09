import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from './entities/user.entity';
import { Prisma, User } from 'prisma/client/client';
import handlePrismaError from 'src/common/prisma-error-check.helper';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  private baseSelect = {
    id: true,
    email: true,
    name: true,
  };

  private postSelect = {
    select: {
      id: true,
      title: true,
      content: true,
      category: { select: { id: true, name: true } },
      createdAt: true,
    },
  };

  async getWithPass(
    email: string,
  ): Promise<Pick<User, 'id' | 'email' | 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      select: { id: true, email: true, password: true },
    });

    return user;
  }

  async checkExist(email: string): Promise<Pick<User, 'id' | 'email'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      select: { id: true, email: true },
    });

    return user;
  }

  async create(
    createData: Prisma.UserUncheckedCreateInput,
  ): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.create({
        data: createData,
        select: {
          ...this.baseSelect,
          createdAt: true,
        },
      });

      return user;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async getOne(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        ...this.baseSelect,
        post: {
          ...this.postSelect,
        },
        createdAt: true,
      },
    });

    return user;
  }

  async update(
    id: number,
    updateData: Prisma.UserUncheckedUpdateInput,
  ): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.update({
        where: { id: id },
        data: updateData,
        select: {
          ...this.baseSelect,
          post: { ...this.postSelect },
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async getPosts(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        ...this.baseSelect,
        post: {
          ...this.postSelect,
        },
      },
    });

    return user;
  }

  async delete(id: number): Promise<UserEntity> {
    try {
      return await this.prisma.user.delete({
        where: { id: id },
        select: {
          ...this.baseSelect,
        },
      });
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}
