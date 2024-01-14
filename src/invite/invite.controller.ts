import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteDocument } from './schema/invite.schema';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiBearerAuth()
@ApiTags('Invite')
@UseGuards(RolesGuard)
@Roles('admin, client')
@Controller('invites')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Get('generate')
  async generateInvite(): Promise<InviteDocument> {
    return this.inviteService.generateInvite();
  }

  @Post('resend/:token')
  async resendInvite(@Param('token') token: string): Promise<InviteDocument | null> {
    return this.inviteService.resendInvite(token);
  }

  @Get('validate/:token')
  async validateInvite(@Param('token') token: string): Promise<boolean> {
    return this.inviteService.validateInvite(token);
  }
}
