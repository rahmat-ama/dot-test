import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from 'prisma/client/client';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private userRepo: UserRepository) {}

  async getUserWithPass(
    email: string,
  ): Promise<Pick<User, 'id' | 'email' | 'password'> | null> {
    const userWithPass = await this.userRepo.getWithPass(email);
    return userWithPass;
  }

  async checkExistingUser(email: string): Promise<boolean> {
    const user = await this.userRepo.checkExist(email);
    const isUserExist = user !== null ? true : false;

    return isUserExist;
  }

  async createUser(
    createUserData: Prisma.UserUncheckedCreateInput,
  ): Promise<UserEntity> {
    const hashedPass = await bcrypt.hash(createUserData.password, 10);
    createUserData.password = hashedPass;
    const user = await this.userRepo.create(createUserData);

    return user;
  }

  async getUser(id: number): Promise<UserEntity | null> {
    const user = await this.userRepo.getOne(id);

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return user;
  }

  async updateUser(
    id: number,
    updateUserData: UpdateUserDto,
  ): Promise<UserEntity> {
    // hash password if exist in request
    if (updateUserData.password) {
      const hashedPass = await bcrypt.hash(updateUserData.password, 10);
      updateUserData.password = hashedPass;
    }

    const user = await this.userRepo.update(id, updateUserData);

    return user;
  }

  async getUserPosts(id: number): Promise<UserEntity> {
    const user = await this.userRepo.getPosts(id);

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return user;
  }

  async deleteUser(id: number): Promise<object> {
    await this.userRepo.delete(id);

    return {
      status: true,
      message: 'User deleted successfully',
    };
  }
}
