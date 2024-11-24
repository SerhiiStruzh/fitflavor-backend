import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './models/comment.model';
import { CreateCommentDTO } from './dto/createCommentDto.dto';
import { CommentResponseDTO } from './dto/commentResponseDTO.dto';
import { User } from 'src/user/models/user.model';
import { Sequelize } from 'sequelize';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment)
    private readonly commentModel: typeof Comment,
  ) {}

  async createComment(userId: number, createCommentDto: CreateCommentDTO): Promise<Comment> {
    const comment = await this.commentModel.create({
      userId,
      ...createCommentDto
    });
    return comment;
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

  async getCommentsByPost(postId: number): Promise<CommentResponseDTO[]> {
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
        ),
    );
  }

    async getCommentsByPostForAuthUser(postId: number, userId: number): Promise<CommentResponseDTO[]> {
    const comments = await this.commentModel.findAll({
      where: { postId },
      include: [
        {
            model: User
        },
      ]
    });

    return comments.map((comment: any) => {
        return new CommentResponseDTO(
            comment.id,
            comment.commentText,
            comment.userId, 
            comment.user.name, 
            comment.userId == userId,
        );
    });
    }

}
