import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Like } from "./models/like.model";

import { Post } from "src/post/models/post.model";
import { PostResponseDTO } from "src/post/dto/postResponseDTO.dto";
import { Comment } from "src/comment/models/comment.model";
import { User } from "src/user/models/user.model";
import { Sequelize } from "sequelize-typescript";


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

    const attributes : any = [
      [Sequelize.col('Like.id'), 'likes_id'], 
      [Sequelize.col('Like.userId'), 'like_userId'], 
      [Sequelize.col('post.id'), 'post_id'],
      [Sequelize.col('post.title'), 'post_title'],
      [Sequelize.col('post.body'), 'post_body'],
      [Sequelize.col('post.userId'), 'author_id'],
      [Sequelize.col('post->user.name'), 'author_name'],
      [Sequelize.col('post->user.picture'), 'author_picture'],
      [
        Sequelize.literal(`(
          SELECT COUNT("Likes"."id")
          FROM "Likes"
          WHERE "Likes"."postId" = "post"."id"
        )`),
        'likesAmount',
      ],
      [Sequelize.fn('COUNT', Sequelize.col('post->comments.id')), 'commentsAmount'],
    ];
  
    if (currentUserId) {
        attributes.push([
          Sequelize.literal(`EXISTS (
            SELECT 1
            FROM "Likes" l
            WHERE l."postId" = "post".id AND l."userId" = ${currentUserId}
          )`),
          "isLiked",
        ]);
    }

    const liked_posts = await this.likeModel.findAll({
        attributes,
        include: [
            {
                model: Post,
                as: 'post',
                attributes: [],
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: [],
                    },
                    {
                        model: Comment,
                        as: 'comments',
                        attributes: [], 
                    },
                ],
            },
        ],
        where: { userId },
        group: [
            'likes_id',
            'post.id',
            'post.title',
            'post.body',
            'post.userId',
            'post->user.name',
            'post->user.picture',
        ], 
    });

    return Promise.all(
      liked_posts.map(async (post: any) => {
        const isAuthor = post.getDataValue('author_id') === currentUserId;
  
        return new PostResponseDTO(
          post.getDataValue('post_id'),
          post.getDataValue('post_title'),
          post.getDataValue('post_body'),
          post.getDataValue('author_name'),
          post.getDataValue('author_id'),
          parseInt(post.getDataValue("likesAmount"), 10),
          parseInt(post.getDataValue("commentsAmount"), 10),
          post.getDataValue('author_picture'),
          post.getDataValue('isLiked'),
          isAuthor
          );      
      })
    );
  }
  
}
