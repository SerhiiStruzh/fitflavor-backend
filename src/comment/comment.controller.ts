import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from './dto/createCommentDto.dto';
import { CommentResponseDTO } from './dto/commentResponseDTO.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard.guard';
import { Request } from 'express';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optionalJwtAuthGuard.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Req() req: Request,
    @Body() createCommentDto: CreateCommentDTO,
  ) : Promise<CommentResponseDTO> {
    return this.commentService.createComment(req['user'].userId, createCommentDto);
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Req() req: Request,
    @Param('commentId') commentId: number
  ) {
    return this.commentService.deleteComment(commentId, req['user'].userId);
  }

  @Get('post/:postId')
  @UseGuards(OptionalJwtAuthGuard)
  async getCommentsByPost(
    @Req() req: Request, 
    @Param('postId') postId: number
  ): Promise<CommentResponseDTO[]> {
    return this.commentService.getCommentsByPost(postId, req['user']?.userId);
  }
}
