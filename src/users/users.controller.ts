import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserService } from './users.service';
import { LoginDto, ParamIdDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.userService.signUp(signUpDto);
  }

  @Get('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.userService.login(loginDto);
  }

  @Get(':id')
  async findById(param: ParamIdDto) {
    const res = await this.userService.getById(param.id);
    return res;
  }
}