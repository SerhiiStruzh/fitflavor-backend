import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.model'; 
import { CreateUserDto } from './dto/createUserDTO.dto';
import { UpdateUserDto } from './dto/updateUserDTO.dto';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto.name, createUserDto.email, createUserDto.picture);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findUserById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateData: UpdateUserDto): Promise<User> {
    return this.userService.updateUser(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}