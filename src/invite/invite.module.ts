import { Module } from '@nestjs/common';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';
import { InviteSchema } from './schema/invite.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Invite', schema: InviteSchema }])
  ],
  controllers: [InviteController],
  providers: [InviteService]
})
export class InviteModule {}
