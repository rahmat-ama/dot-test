import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { type ReqWithUser } from './types/request-with-user.type';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@ApiBearerAuth('token')
@ApiTags('User')
// need auth to access
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  // get profile / user
  @ApiOperation({ summary: 'Get current user data' })
  @ApiOkResponse({ description: 'User found', type: UserEntity })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('profile')
  @ResponseMessage('Current User data fetched successfully')
  @HttpCode(HttpStatus.OK)
  async getUserProfile(@Req() req: ReqWithUser): Promise<UserEntity | null> {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const user = await this.userService.getUser(req.user.id);

    return user;
  }

  // update user
  @ApiOperation({ summary: 'Update user data' })
  @ApiOkResponse({ description: 'User updated successfully', type: UserEntity })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Put('edit')
  @ResponseMessage('User updated successfully')
  async updateUser(
    @Req() req: ReqWithUser,
    @Body() updateUserData: UpdateUserDto,
  ): Promise<UserEntity> {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const updatedUser = await this.userService.updateUser(
      req.user.id,
      updateUserData,
    );

    return updatedUser;
  }

  // get user posts
  @ApiOperation({ summary: 'Get user with list of post' })
  @ApiOkResponse({ description: 'User with Post found', type: UserEntity })
  @ApiResponse({ status: 404, description: 'User with posts not found' })
  @Get('posts')
  @ResponseMessage('User with Post data fetched successfully')
  async getUserPosts(@Req() req: ReqWithUser): Promise<UserEntity | null> {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userWithPosts = await this.userService.getUserPosts(req.user.id);

    return userWithPosts;
  }

  // delete user
  @ApiOperation({ summary: 'Delete a user' })
  @ApiOkResponse({
    description: 'User deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Delete('delete')
  @ResponseMessage('User deleted successfully')
  async deleteUser(@Req() req: ReqWithUser): Promise<object> {
    return await this.userService.deleteUser(req.user.id);
  }
}
