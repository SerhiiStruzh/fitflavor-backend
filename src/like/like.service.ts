import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Like } from "./models/like.model";

import { ValidationError } from "sequelize";
import { Post } from "src/post/models/post.model";


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

  async getLikedPostsByUserId(userId: number): Promise<Post[]> {
    const likes = await this.likeModel.findAll({
      where: { userId },
      include: [Post], 
    });

    return likes.map((like) => like.post);
  }
}
