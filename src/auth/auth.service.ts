import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'prisma/client/browser';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private userService: UsersService,
  ) {}

  async signUp(
    signUpData: Pick<User, 'email' | 'password' | 'name'>,
  ): Promise<object> {
    const { email } = signUpData;

    // check exist user with email in request
    const isUserExist = await this.userService.checkExistingUser(email);

    if (isUserExist) {
      throw new ConflictException('User with this email already exist');
    }

    const user = await this.userService.createUser(signUpData);

    return this.signToken(user.id, user.email);
  }

  async signIn(signInData: Pick<User, 'email' | 'password'>): Promise<object> {
    const { email, password } = signInData;

    const user = await this.userService.getUserWithPass(email);

    if (!user) {
      throw new ForbiddenException('User does not exist');
    }

    const isPassMatch = await bcrypt.compare(password, user.password);

    if (!isPassMatch) {
      throw new ForbiddenException('Incorrect credentials');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string): Promise<object> {
    const payload = { sub: userId, email };
    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '1D',
      secret: process.env.JWT_SECRET,
    });

    return { token: access_token };
  }
}
