import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './models/post.model';
import { User } from 'src/user/models/user.model';
import { UpdatePostDTO } from './dto/updatePostDTO.dto';
import { CreatePostDTO } from './dto/createPostDTO.dto';
import { Sequelize } from 'sequelize';
import { PostResponseDTO } from './dto/postResponseDTO.dto';

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
  
    const post: any = await this.postModel.findOne({
      where: { id },
      attributes,
      include: [
        {
          model: User,
          attributes: ["id", "name"],
        },
      ],
    });
  
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  
    return new PostResponseDTO(
      post.id,
      post.title,
      post.body,
      post.user.name,
      post.user.id,
      parseInt(post.getDataValue("likesAmount"), 10),
      userId ? post.getDataValue("isLiked") : false,
      userId ? post.user.id === userId : false
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
  
    const posts = await this.postModel.findAll({
      where: { userId },
      attributes,
      include: [
        {
          model: User,
          attributes: ["id", "name"],
        },
      ],
    });
  
    return posts.map(
      (post: any) =>
        new PostResponseDTO(
          post.id,
          post.title,
          post.body,
          post.user.name,
          post.user.id,
          parseInt(post.getDataValue("likesAmount"), 10),
          currentUserId ? post.getDataValue("isLiked") : false,
          currentUserId ? post.user.id === currentUserId : false
        )
    );
  }
  

  async findAllPosts(userId?: number): Promise<PostResponseDTO[]> {
    const attributes = this.getAttributes(userId);

    const posts = await this.postModel.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name"],
        },
      ],
      attributes: attributes,
    });


    return posts.map((post: any) => {
      return new PostResponseDTO(
        post.id,
        post.title,
        post.body,
        post.user.name, 
        post.user.id,
        parseInt(post.getDataValue('likesAmount'), 10), 
        userId ? post.getDataValue('isLiked') : false, 
        userId ? post.user.id === userId : false, 
      );
    });
  }

  getAttributes(userId?: number): any[] {
    const attributes: any[] = [
      "id",
      "title",
      "body",
      [
        Sequelize.literal(`(
          SELECT COUNT(*)
          FROM "Likes" l
          WHERE l."postId" = "Post".id
        )`),
        "likesAmount",
      ],
    ];
  
    if (userId) {
      attributes.push([
        Sequelize.literal(`EXISTS (
          SELECT 1
          FROM "Likes" l
          WHERE l."postId" = "Post".id AND l."userId" = ${userId}
        )`),
        "isLiked",
      ]);
    }
  
    return attributes;
  }
}