
import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDTO {
  @IsInt()
  @IsNotEmpty()
  postId: number;

  @IsString()
  @IsNotEmpty({ message: 'Comment text must not be empty' })
  @MaxLength(200, { message: 'Comment text must not exceed 200 characters' })
  commentText: string;
}
