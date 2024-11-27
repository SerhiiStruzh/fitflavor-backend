import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from './models/post.model';
import { UpdatePostDTO } from './dto/updatePostDTO.dto';
import { CreatePostDTO } from './dto/createPostDTO.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard.guard';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optionalJwtAuthGuard.guard';
import { PostResponseDTO } from './dto/postResponseDTO.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Req() req: Request, @Body() createPostDto: CreatePostDTO): Promise<PostModel> {
    return this.postService.createPost(req['user'].userId, createPostDto);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async getAllPosts(@Req() req: Request): Promise<PostResponseDTO[]> {
    return this.postService.findAllPosts(req['user']?.userId);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getPostById(@Req() req: Request, @Param('id') id: number): Promise<PostResponseDTO> {
    return this.postService.findPostById(id, req['user']?.userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() updateData: UpdatePostDTO
  ): Promise<PostModel> {
    return this.postService.updatePost(id, req['user'].userId, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(@Req() req: Request, @Param('id') id: number): Promise<void> {
    await this.postService.deletePost(id, req['user'].userId);
  }

  @Get('user/:userId')
  @UseGuards(OptionalJwtAuthGuard)
  async getUserPosts(@Req() req: Request, @Param('userId') userId: number): Promise<PostResponseDTO[]> {
    return this.postService.findPostsByUserId(userId, req['user']?.userId);
  }
}
