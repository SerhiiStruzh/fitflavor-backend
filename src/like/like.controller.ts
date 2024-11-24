import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    UseGuards,
    Req,
  } from '@nestjs/common';
import { LikeService } from './like.service';
import { Like } from './models/like.model';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard.guard';
import { CreateLikeDTO } from './dto/createLikeDTO.dto';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optionalJwtAuthGuard.guard';
import { Request } from 'express';
import { Post as PostModel } from 'src/post/models/post.model';
  
  @Controller('likes')
  export class LikeController {
    constructor(private readonly likeService: LikeService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Req() req: Request, @Body() createLikeDto: CreateLikeDTO): Promise<Like> {
        return this.likeService.create(req['user'].userId, createLikeDto.postId);
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Req() req: Request, @Param('id') id: number): Promise<void> {
      return this.likeService.remove(req['user'].userId, id);
    }
  
    @Get('user/:userId')
    async findUserLiked(@Param('userId') userId: number): Promise<PostModel[]> {
      return this.likeService.getLikedPostsByUserId(userId);
    }
  }
  