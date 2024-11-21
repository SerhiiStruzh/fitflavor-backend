import { IsInt } from "class-validator";

export class CreateLikeDTO {
   @IsInt()
   postId: number; 
}