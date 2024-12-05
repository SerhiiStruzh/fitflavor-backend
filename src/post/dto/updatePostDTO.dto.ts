import { IsOptional, IsString, IsInt, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdatePostDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, { message: 'Title must be at most 50 characters long.' })
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  body?: string;
}