import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [JwtStrategy],
  exports: [JwtStrategy],
})
export class AuthModule {}