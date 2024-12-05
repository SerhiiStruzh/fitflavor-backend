import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, Req, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { UpdatePostDTO } from './dto/updatePostDTO.dto';
import { CreatePostDTO } from './dto/createPostDTO.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard.guard';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optionalJwtAuthGuard.guard';
import { PostResponseDTO } from './dto/postResponseDTO.dto';
import { Request } from 'express';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Req() req: Request, 
    @Body() createPostDto: CreatePostDTO
  ): Promise<number> {
    const post = await this.postService.createPost(req['user'].userId, createPostDto);
    return post.id;
  }

  @Get('search')
  @UseGuards(OptionalJwtAuthGuard)
  async searchPosts(
    @Req() req: Request, 
    @Query('q') query: string
  ): Promise<PostResponseDTO[]> {
    return this.postService.searchPosts(query, req['user']?.userId);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async getAllPosts(@Req() req: Request): Promise<PostResponseDTO[]> {
    return this.postService.findAllPosts(req['user']?.userId);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getPostById(
    @Req() req: Request, 
    @Param('id') id: number
  ): Promise<PostResponseDTO> {
    return this.postService.findPostById(id, req['user']?.userId);
  }

  @Get('search/popular')
  @UseGuards(OptionalJwtAuthGuard)
  async getPopularPosts(@Req() req: Request): Promise<PostResponseDTO[]> {
    return this.postService.findPopularPosts(req['user']?.userId);
  }

  @Get('search/newest')
  @UseGuards(OptionalJwtAuthGuard)
  async getNewestPosts(@Req() req: Request): Promise<PostResponseDTO[]> {
    return this.postService.findNewestPosts(req['user']?.userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() updateData: UpdatePostDTO
  ): Promise<number> {
    const post = await this.postService.updatePost(id, req['user'].userId, updateData);
    return post.id;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(
    @Req() req: Request, 
    @Param('id') id: number
  ): Promise<void> {
    await this.postService.deletePost(id, req['user'].userId);
  }

  @Get('user/:userId')
  @UseGuards(OptionalJwtAuthGuard)
  async getUserPosts(
    @Req() req: Request, 
    @Param('userId') userId: number
  ): Promise<PostResponseDTO[]> {
    return this.postService.findPostsByUserId(userId, req['user']?.userId);
  }
}
