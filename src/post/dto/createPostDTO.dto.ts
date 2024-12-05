import { IsNotEmpty, IsString, IsInt, MaxLength } from 'class-validator';

export class CreatePostDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, { message: 'Title must be at most 50 characters long.' })
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;
}