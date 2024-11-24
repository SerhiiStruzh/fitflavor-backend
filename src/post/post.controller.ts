import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from './models/post.model';
import { UpdatePostDTO } from './dto/updatePostDTO.dto';
import { CreatePostDTO } from './dto/createPostDTO.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard.guard';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optionalJwtAuthGuard.guard';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Body() createPostDto: CreatePostDTO): Promise<PostModel> {
    return this.postService.createPost(createPostDto);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async getAllPosts(@Req() req: Request): Promise<PostModel[]> {
    if(req['user']){
      return this.postService.findAllPostsForAuthUser(req['user'].userId);
    }
    return this.postService.findAllPosts();
  }

  @Get(':id')
  async getPostById(@Param('id') id: number): Promise<PostModel> {
    return this.postService.findPostById(id);
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: number,
    @Body() updateData: UpdatePostDTO
  ): Promise<PostModel> {
    return this.postService.updatePost(id, updateData);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: number): Promise<void> {
    await this.postService.deletePost(id);
  }

  @Get('user/:userId')
  async getPostsByUserId(@Param('userId') userId: number): Promise<PostModel[]> {
    return this.postService.findPostsByUserId(userId);
  }
}
