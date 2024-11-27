import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.model'; 
import { CreateUserDto } from './dto/createUserDTO.dto';
import { UpdateUserDto } from './dto/updateUserDTO.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard.guard';
import { Request } from 'express';
import { UserResponseDTO } from './dto/userResponseDTO.dto';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optionalJwtAuthGuard.guard';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // async create(@Body() createUserDto: CreateUserDto): Promise<User> {
  //   return this.userService.createUser(createUserDto.name, createUserDto.email, createUserDto.picture);
  // }

  // @Get()
  // async findAll(): Promise<User[]> {
  //   return this.userService.findAllUsers();
  // }

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