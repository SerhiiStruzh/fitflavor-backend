import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Like } from "./models/like.model";

import { ValidationError } from "sequelize";


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

  async remove(id: number): Promise<void> {
    const like = await this.likeModel.findByPk(id);
    if (!like) {
      throw new NotFoundException(`Like with ID ${id} not found`);
    }
    await like.destroy();
  }

  async findByPost(postId: number): Promise<Like[]> {
    return this.likeModel.findAll({ where: { postId }});
  }

  async findByUser(userId: number): Promise<Like[]> {
    return this.likeModel.findAll({ where: { userId }});
  }
}
