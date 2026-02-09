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
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PostEntity } from './entities/post.entity';

@ApiBearerAuth('token')
@ApiTags('Post')
@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // get all post
  @ApiOperation({ summary: 'Get all Post data' })
  @ApiOkResponse({ description: 'Posts data found', type: [PostEntity] })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get()
  async getPosts(): Promise<PostEntity[]> {
    const posts = await this.postsService.getPosts();
    return posts;
  }

  // create post
  @ApiOperation({ summary: 'Create a new Post data' })
  @ApiCreatedResponse({
    description: 'Post created successfully',
    type: PostEntity,
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post()
  async createPost(@Body() createPostData: CreatePostDto): Promise<PostEntity> {
    const post = await this.postsService.createPost(createPostData);
    return post;
  }

  // get one post
  @ApiOperation({ summary: 'Get Post details by Id' })
  @ApiOkResponse({ description: 'Post data found', type: PostEntity })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @Get(':id')
  async getPostById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostEntity> {
    const post = await this.postsService.getOnePost(id);
    return post;
  }

  // update post
  @ApiOperation({ summary: 'Update Post data' })
  @ApiOkResponse({ description: 'Post updated successfully', type: PostEntity })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Put(':id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostData: UpdatePostDto,
  ): Promise<PostEntity> {
    const post = await this.postsService.updatePost(id, updatePostData);
    return post;
  }

  // delete post
  @ApiOperation({ summary: 'Delete Post data' })
  @ApiOkResponse({
    description: 'Post deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Post deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return await this.postsService.deletePost(id);
  }
}
