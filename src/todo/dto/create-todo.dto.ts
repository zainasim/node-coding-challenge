import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongodb";

export class CreateTodoDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  readonly userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(['pending', 'complete'])
  readonly status: string;
}
