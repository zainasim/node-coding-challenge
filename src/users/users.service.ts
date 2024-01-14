import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    try {
      const { name, email, password, role } = signUpDto;

      const emailExist = await this.userModel.findOne({ email });

      if (emailExist) {
        throw new HttpException(
          {
            code: HttpStatus.CONFLICT,
            message: 'Email already exists',
            details: 'The provided email address is already registered.',
          },
          HttpStatus.CONFLICT,
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
        role
      });
  
      const token = this.jwtService.sign({ id: user._id });
  
      return { token };
    } catch (error) {
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    try {
      const { email, password } = loginDto;
  
      const user = await this.userModel.findOne({ email });
  
      if (!user) {
        throw new UnauthorizedException('Invalid email');
      }
  
      const isPasswordMatched = await bcrypt.compare(password, user.password);
  
      if (!isPasswordMatched) {
        throw new UnauthorizedException('Invalid password');
      }
  
      const token = this.jwtService.sign({ id: user._id });
  
      return { token };
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string): Promise<User | null> {
    try {
      const res = await this.userModel.findOne({
        _id: id,
      });
      
      if (!res) {
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            message: 'User with Id does not exist',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return res;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByRole(role: string): Promise<User[]> {
    return this.userModel.find({ role }).exec();
  }
}