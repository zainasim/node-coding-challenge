import { IsEmail, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class ParamIdDto {
  @IsMongoId({ message: 'id must be a valid mongodb id' })
  id: string;
}