import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { CategoryEntity } from './entities/category.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth('token')
@ApiTags('Categories')
@UseGuards(AuthGuard('jwt'))
@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  // Get All Category
  @ApiOperation({ summary: 'Get all categories' })
  @ApiOkResponse({
    description: 'List of all category',
    type: [CategoryEntity],
  })
  @Get()
  async getCategories(): Promise<CategoryEntity[]> {
    const categories = await this.categoryService.getCategories();

    return categories;
  }

  // Create Category
  @ApiOperation({ summary: 'Create a new category' })
  @ApiCreatedResponse({
    description: 'Category created successfully',
    type: CategoryEntity,
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post()
  async createCategory(
    @Body() createCategoryData: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const category =
      await this.categoryService.createCategory(createCategoryData);

    return category;
  }

  // Get Category By Id
  @ApiOperation({ summary: 'Get a category by Id' })
  @ApiOkResponse({ description: 'Category found', type: CategoryEntity })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @Get(':id')
  async getCategoryById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategoryEntity> {
    const category = await this.categoryService.getOneCategory(id);

    return category;
  }

  // Update Category
  @ApiOperation({ summary: 'Update a category' })
  @ApiOkResponse({
    description: 'Category updated successfully',
    type: CategoryEntity,
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Put(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryData: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.categoryService.updateCategory(
      id,
      updateCategoryData,
    );

    return category;
  }

  // Delete Category
  @ApiOperation({ summary: 'Delete a category' })
  @ApiOkResponse({
    description: 'Category deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Category deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.deleteCategory(id);
  }
}
