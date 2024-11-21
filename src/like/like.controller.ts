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
  
  @Controller('likes')
  export class LikeController {
    constructor(private readonly likeService: LikeService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Req() req, @Body() createLikeDto: CreateLikeDTO): Promise<Like> {
        return this.likeService.create(req.user.userId, createLikeDto.postId);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void> {
      return this.likeService.remove(id);
    }

    @Get('post/:postId')
    async findByPost(@Param('postId') postId: number): Promise<Like[]> {
      return this.likeService.findByPost(postId);
    }
  
    @Get('user/:userId')
    async findByUser(@Param('userId') userId: number): Promise<Like[]> {
      return this.likeService.findByUser(userId);
    }
  }
  