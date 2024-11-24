
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDTO {
  @IsInt()
  @IsNotEmpty()
  postId: number;

  @IsString()
  @IsNotEmpty()
  commentText: string;
}
