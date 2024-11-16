import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './models/post.model';
import { User } from 'src/user/models/user.model';
import { UpdatePostDTO } from './dto/updatePostDTO.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post)
    private readonly postModel: typeof Post,
    private readonly userService: UserService
  ) {}

  async createPost(title: string, body: string, userId: number): Promise<Post> {
    await this.userService.findUserById(userId);
    return this.postModel.create({ title, body, userId });
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
}