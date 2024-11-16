import { IsOptional, IsString, IsInt, IsNotEmpty } from 'class-validator';

export class UpdatePostDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  body?: string;
}