import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './models/comment.model';
import { CreateCommentDTO } from './dto/createCommentDto.dto';
import { CommentResponseDTO } from './dto/commentResponseDTO.dto';
import { User } from 'src/user/models/user.model';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment)
    private readonly commentModel: typeof Comment,
  ) {}

  async createComment(userId: number, createCommentDto: CreateCommentDTO): Promise<CommentResponseDTO> {
    const comment = await this.commentModel.create({
      userId,
      ...createCommentDto
    });

    const commentWithUser = await this.commentModel.findOne({
      where: { id: comment.id },
      include: [{ model: User }],
    });

    return new CommentResponseDTO(
      commentWithUser.id,
      commentWithUser.commentText,
      commentWithUser.user.id,
      commentWithUser.user.name,
      commentWithUser.user.picture,
      userId ? commentWithUser.userId === userId : false,
    )
  }

  async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentModel.findByPk(commentId);
  
    if (!comment) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }
    if (comment.userId !== userId) {
      throw new ForbiddenException(`You do not have permission to delete this comment`);
    }
  
    await comment.destroy();
  }

  async getCommentsByPost(postId: number, userId: number): Promise<CommentResponseDTO[]> {
    const comments = await this.commentModel.findAll({
      where: { postId },
      include: [
        {
            model: User
        },
      ]
    });
  
    return comments.map(
      (comment) =>
        new CommentResponseDTO(
          comment.id,
          comment.commentText,
          comment.user.id,
          comment.user.name,
          comment.user.picture,
          userId ? comment.userId === userId : false,
        ),
    );
  }

}
