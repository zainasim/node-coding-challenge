import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invite, InviteDocument } from './schema/invite.schema';

@Injectable()
export class InviteService {
  constructor(
    @InjectModel(Invite.name)
    private readonly inviteModel: Model<InviteDocument>,
  ) {}

  async generateInvite(): Promise<InviteDocument> {
    const token = this.generateToken();
    const expirationDate = this.calculateExpirationDate();

    const invite = new this.inviteModel({
      token,
      expirationDate,
    });

    await invite.save();
    console.log('Invite Token:', token);
    return invite;
  }

  async resendInvite(token: string): Promise<InviteDocument | null> {
    const invite = await this.inviteModel.findOne({ token });

    if (invite) {
      invite.expirationDate = this.calculateExpirationDate();
      await invite.save();
      console.log('Resending Invite Token:', token);
    } else {
      console.log('Invite not found.');
    }

    return invite;
  }

  async validateInvite(token: string): Promise<boolean> {
    const invite = await this.inviteModel.findOne({ token });

    if (invite && invite.expirationDate > new Date()) {
      console.log('Invite is valid.');
      return true;
    } else {
      console.log('Invite is expired or invalid.');
      return false;
    }
  }

  private generateToken(): string {
    // Implement your token generation logic
    return 'generated-token';
  }

  private calculateExpirationDate(): Date {
    // Implement your expiration date calculation logic
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1); // 24 hours expiration
    return expirationDate;
  }
}
