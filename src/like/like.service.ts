import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Like } from "./models/like.model";

import { ValidationError } from "sequelize";
import { Post } from "src/post/models/post.model";
import { PostResponseDTO } from "src/post/dto/postResponseDTO.dto";
import { User } from "src/user/models/user.model";


@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like)
    private readonly likeModel: typeof Like,
  ) {}

  async create(userId: number, postId: number): Promise<Like> {
    const existingLike = await this.likeModel.findOne({
        where: { userId, postId },
    });
    if(existingLike){
        throw new ConflictException('Like already exists for this post');
    }
    try {
        return await this.likeModel.create({ userId, postId });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            throw new BadRequestException('Invalid data provided');
        }
        throw error;
    }
  }

  async remove(userId: number, id: number): Promise<void> {
    const like = await this.likeModel.findByPk(id);
    if (!like) {
      throw new NotFoundException(`Like with ID ${id} not found`);
    }

    if (like.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this like');
    }

    await like.destroy();
  }

  async countLikesOnPost(postId: number): Promise<number> {
    return this.likeModel.count({
      where:{
        postId: postId
      }
    })
  }

  async getLikedPostsByUserId(
    userId: number,
    currentUserId?: number
  ): Promise<PostResponseDTO[]> {
    const likes = await this.likeModel.findAll({
      where: { userId },
      include: [Post],
    });
  
    const posts = likes.map((like) => like.post);

    return Promise.all(
      posts.map(async (post) => {
        const likesAmount = await this.likeModel.count({
          where: { postId: post.id },
        });
  
        const isLiked = currentUserId
        ? !!(await this.likeModel.findOne({
            where: { postId: post.id, userId: currentUserId },
          }))
        : false;
  
        const isAuthor = post.userId === currentUserId;
  
        return new PostResponseDTO(
          post.id,
          post.title,
          post.body,
          post.user?.name,
          post.userId,
          likesAmount,
          isLiked,
          isAuthor
        );
      })
    );
  }
  
}
