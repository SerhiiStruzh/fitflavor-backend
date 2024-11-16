import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreatePostDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}