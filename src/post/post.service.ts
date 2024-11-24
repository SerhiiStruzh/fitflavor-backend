import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './models/post.model';
import { User } from 'src/user/models/user.model';
import { UpdatePostDTO } from './dto/updatePostDTO.dto';
import { UserService } from 'src/user/user.service';
import { CreatePostDTO } from './dto/createPostDTO.dto';
import { Sequelize } from 'sequelize';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post)
    private readonly postModel: typeof Post,
  ) {}

  async createPost(createPostDto: CreatePostDTO): Promise<Post> {
    return this.postModel.create(createPostDto);
  }

  async findAllPosts(): Promise<Post[]> {
    return this.postModel.findAll();
  }

  async findPostById(id: number): Promise<Post> {
    const post = await this.postModel.findByPk(id, { include: [User] });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async updatePost(id: number, updateData: UpdatePostDTO): Promise<Post> {
    const post = await this.findPostById(id);
    await post.update(updateData);
    return post;
  }

  async deletePost(id: number): Promise<void> {
    const post = await this.findPostById(id);
    await post.destroy();
  }

  async findPostsByUserId(userId: number): Promise<Post[]> {
    return this.postModel.findAll({
      where: { userId }
    });
  }

  async findAllPostsForAuthUser(userId: number): Promise<any[]> {
    const posts = await this.postModel.findAll({
      attributes: [
        "id",
        "title",
        "body",
        [
          Sequelize.literal(`CASE WHEN EXISTS (
            SELECT 1 FROM "Likes" l WHERE l."postId" = "Post".id AND l."userId" = ${userId}
          ) THEN true ELSE false END`),
          "isLiked",
        ],
      ],
    });
  
    return posts;
  }
  
}