import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignUpDto, AuthSignInDto } from './dto';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // sign up user
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ description: 'Register successful', type: UserEntity })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpData: AuthSignUpDto): Promise<object> {
    return await this.authService.signUp(signUpData);
  }

  // sign in user
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({ description: 'Login successful', type: UserEntity })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInData: AuthSignInDto): Promise<object> {
    return await this.authService.signIn(signInData);
  }
}
