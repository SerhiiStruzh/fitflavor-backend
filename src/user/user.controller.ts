import { Controller, Get, Body, Param, Put, UseGuards, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUserDTO.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard.guard';
import { Request, Response } from 'express';
import { UserResponseDTO } from './dto/userResponseDTO.dto';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optionalJwtAuthGuard.guard';
import { ConfigService } from '@nestjs/config';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Req() req : Request){
    const userId = req['user'].userId;
    return { userId }
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async findUser(@Req() req : Request, @Param('id') id: number): Promise<UserResponseDTO> {
    return this.userService.findUserById(id, req['user']?.userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Req() req : Request, @Param('id') id: number, @Body() updateData: UpdateUserDto): Promise<UserResponseDTO> {
    return this.userService.updateUser(id, req['user'].userId, updateData);
  }
}