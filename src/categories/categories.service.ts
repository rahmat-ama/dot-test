import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Prisma } from 'prisma/client/client';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(private categoryRepo: CategoryRepository) {}

  async getCategories(): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepo.getAll();

    return categories;
  }

  async createCategory(
    createCategoryData: Prisma.CategoryUncheckedCreateInput,
  ): Promise<CategoryEntity> {
    const category = await this.categoryRepo.create(createCategoryData);

    return category;
  }

  async getOneCategory(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepo.getOne(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async updateCategory(
    id: number,
    updateCategoryData: Prisma.CategoryUncheckedUpdateInput,
  ): Promise<CategoryEntity> {
    const category = await this.categoryRepo.update(id, updateCategoryData);

    return category;
  }

  async deleteCategory(id: number): Promise<CategoryEntity> {
    const deletedCategory = await this.categoryRepo.delete(id);

    return deletedCategory;
  }
}
