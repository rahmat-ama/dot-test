import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      // get token from header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // cek expiration
      ignoreExpiration: false,
      // cek token validation
      secretOrKey: process.env.JWT_SECRET || 'random_jwt_secret',
    });
  }

  validate(payload: { sub: number; email: string }): object {
    const userId = payload.sub;

    if (!userId) {
      throw new Error('Invalid token payload: missing user Id');
    }

    const user = {
      id: payload.sub,
      email: payload.email,
    };

    return user;
  }
}
