import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '../users/users.service'
import { JwtPayload } from 'src/common/utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const { id } = payload;
      
      const user = await this.userService.getById(id);
      if (!user) {
        throw new UnauthorizedException('Login first to access this endpoint.');
      }  
      return user;
    } catch (error) {
      throw error;
    }
  }
}