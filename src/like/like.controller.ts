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
import { PostResponseDTO } from 'src/post/dto/postResponseDTO.dto';
  
  @Controller('likes')
  export class LikeController {
    constructor(private readonly likeService: LikeService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    async create(
      @Req() req: Request, 
      @Body() createLikeDto: CreateLikeDTO
    ): Promise<Like> {
        return this.likeService.create(req['user'].userId, createLikeDto.postId);
    }
  
    @Delete(':postId')
    @UseGuards(JwtAuthGuard)
    async remove(
      @Req() req: Request,
      @Param('postId') postId: number
    ): Promise<void> {
      return this.likeService.remove(req['user'].userId, postId);
    }
  
    @Get('user/:userId')
    @UseGuards(OptionalJwtAuthGuard)
    async findUserLiked(
      @Req() req: Request, 
      @Param('userId') userId: number
    ): Promise<PostResponseDTO[]> {
      return this.likeService.getLikedPostsByUserId(userId, req['user']?.userId);
    }
  }
  