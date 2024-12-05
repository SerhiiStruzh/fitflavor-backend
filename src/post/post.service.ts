import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './models/post.model';
import { User } from 'src/user/models/user.model';
import { UpdatePostDTO } from './dto/updatePostDTO.dto';
import { CreatePostDTO } from './dto/createPostDTO.dto';
import { Sequelize } from "sequelize-typescript";
import { PostResponseDTO } from './dto/postResponseDTO.dto';
import { Like } from 'src/like/models/like.model';
import { Comment } from 'src/comment/models/comment.model';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post)
    private readonly postModel: typeof Post,
  ) {}

  async createPost(userId: number, createPostDto: CreatePostDTO): Promise<Post> {
    return this.postModel.create({...createPostDto, userId});
  }

  async getPostById(id: number): Promise<Post> {
    const post = await this.postModel.findByPk(id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async findPostById(id: number, userId?: number): Promise<PostResponseDTO> {
    const attributes = this.getAttributes(userId);
    const includes = this.getIncludes();
    const groupBy = this.getGroupBy();

    const post: any = await this.postModel.findOne({
      where: { id },
      include: includes,
      group: groupBy,
      attributes: attributes,
    });
  
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  
    return new PostResponseDTO(
      post.id,
      post.title,
      post.body,
      post.getDataValue('userName'),
      post.userId,
      parseInt(post.getDataValue('likesAmount'), 10),
      parseInt(post.getDataValue('commentsAmount'), 10),
      post.getDataValue('userPicture'),
      userId ? post.getDataValue('isLiked') : false,
      userId ? post.userId === userId : false,
    );
  }

  async updatePost(id: number, userId: number, updateData: UpdatePostDTO): Promise<Post> {
    const post = await this.getPostById(id);
    if (post.userId !== userId) {
      throw new ForbiddenException(`You do not have permission to edit this post`);
    }
    await post.update(updateData);
    return post;
  }

  async deletePost(id: number, userId: number): Promise<void> {
    const post = await this.getPostById(id);
    if (post.userId !== userId) {
      throw new ForbiddenException(`You do not have permission to delete this post`);
    }
    await post.destroy();
  }

  async findPostsByUserId(userId: number, currentUserId?: number): Promise<PostResponseDTO[]> {
    const attributes = this.getAttributes(currentUserId);
    const includes = this.getIncludes();
    const groupBy = this.getGroupBy();

    const posts = await this.postModel.findAll({
      where: { userId },
      include: includes,
      group: groupBy,
      attributes: attributes,
    });

    return posts.map(
      (post: any) =>
        new PostResponseDTO(
          post.id,
          post.title,
          post.body,
          post.getDataValue('userName'),
          post.userId,
          parseInt(post.getDataValue('likesAmount'), 10),
          parseInt(post.getDataValue('commentsAmount'), 10),
          post.getDataValue('userPicture'),
          currentUserId ? post.getDataValue('isLiked') : false,
          currentUserId ? post.userId === currentUserId : false,
        )
    );
  }
  
  async findAllPosts(userId?: number): Promise<PostResponseDTO[]> {
    const attributes = this.getAttributes(userId);
    const includes = this.getIncludes();
    const groupBy = this.getGroupBy();


    const posts = await this.postModel.findAll({
      include: includes,
      group: groupBy,
      attributes: attributes,
    });

    return posts.map((post: any) => {
      return new PostResponseDTO(
        post.id,
        post.title,
        post.body,
        post.getDataValue('userName'),
        post.userId,
        parseInt(post.getDataValue('likesAmount'), 10),
        parseInt(post.getDataValue('commentsAmount'), 10),
        post.getDataValue('userPicture'),
        userId ? post.getDataValue('isLiked') : false,
        userId ? post.userId === userId : false,
      );
    });
  }

  async searchPosts(query: string, userId?: number): Promise<PostResponseDTO[]> {
    const attributes = this.getAttributes(userId);
    const includes = this.getIncludes();
    const groupBy = this.getGroupBy();

    const formattedQuery = query.split(/\s+/)
                                .map((word) => word.replace(/'/g, "''"))
                                .join(' | ');

    const posts = await this.postModel.findAll({
      where: Sequelize.literal(`"search_vector" @@ to_tsquery('simple', '${formattedQuery}') `),
      include: includes,
      group: groupBy,
      attributes: attributes,
    });

    return posts.map((post: any) => {
      return new PostResponseDTO(
        post.id,
        post.title,
        post.body,
        post.getDataValue('userName'),
        post.userId,
        parseInt(post.getDataValue('likesAmount'), 10),
        parseInt(post.getDataValue('commentsAmount'), 10),
        post.getDataValue('userPicture'),
        userId ? post.getDataValue('isLiked') : false,
        userId ? post.userId === userId : false,
      );
    });
  }

  async findPopularPosts(userId?: number): Promise<PostResponseDTO[]> {
    const attributes = this.getAttributes(userId);
    const includes = this.getIncludes();
    const groupBy = this.getGroupBy();
  
    const posts = await this.postModel.findAll({
      include: includes,
      group: groupBy,
      attributes: attributes,
      order: [[Sequelize.literal('"likesAmount"'), 'DESC']],
    });
  
    return posts.map((post: any) => {
      return new PostResponseDTO(
        post.id,
        post.title,
        post.body,
        post.getDataValue('userName'),
        post.userId,
        parseInt(post.getDataValue('likesAmount'), 10),
        parseInt(post.getDataValue('commentsAmount'), 10),
        post.getDataValue('userPicture'),
        userId ? post.getDataValue('isLiked') : false,
        userId ? post.userId === userId : false,
      );
    });
  }
  
  async findNewestPosts(userId?: number): Promise<PostResponseDTO[]> {
    const attributes = this.getAttributes(userId);
    const includes = this.getIncludes();
    const groupBy = this.getGroupBy();
  
    const posts = await this.postModel.findAll({
      include: includes,
      group: groupBy,
      attributes: attributes,
      order: [['createdAt', 'DESC']],
    });
  
    return posts.map((post: any) => {
      return new PostResponseDTO(
        post.id,
        post.title,
        post.body,
        post.getDataValue('userName'),
        post.userId,
        parseInt(post.getDataValue('likesAmount'), 10),
        parseInt(post.getDataValue('commentsAmount'), 10),
        post.getDataValue('userPicture'),
        userId ? post.getDataValue('isLiked') : false,
        userId ? post.userId === userId : false,
      );
    });
  }
  

  getAttributes(userId?: number): any[] {
    const attributes: any[] = [
      'id',
      'body',
      'title',
      'userId',
      [Sequelize.col('user.name'), 'userName'],
      [Sequelize.col('user.picture'), 'userPicture'],
      [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT "likes"."id"')), 'likesAmount'],
      [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT "comments"."id"')), 'commentsAmount'],
    ];
  
    if (userId) {
      attributes.push([
        Sequelize.literal(`EXISTS (
          SELECT 1 
          FROM "Likes" AS l 
          WHERE l."postId" = "Post"."id" AND l."userId" = ${userId}
        )`),
        "isLiked",
      ]);
    }
  
    return attributes;
  }

  getIncludes(): any[] {
    const includes : any[] = [
      {
        model: User,
        attributes: [], 
      },
      {
        model: Like,
        attributes: [],
      },
      {
        model: Comment,
        attributes: [],
      }
    ]
    return includes;
  }

  getGroupBy() : any[] {
    const groupBy : any[] = [
      'Post.id',
      'Post.body',
      'Post.title',
      'Post.userId',
      'userName',
      'userPicture'
    ];
    return groupBy;
  }
}