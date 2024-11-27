import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UpdateUserDto } from './dto/updateUserDTO.dto';
import { UserResponseDTO } from './dto/userResponseDTO.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async createUser(name: string, email: string, picture: string): Promise<User> {
    return this.userModel.create({ name, email, picture });
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findUserById(id: number, currentUserId?: number): Promise<UserResponseDTO> {
    const user = await this.getUserById(id);
    return new UserResponseDTO(
      user.id,
      user.name,
      user.picture,
      user.linktree,
      currentUserId ? user.id === currentUserId : false
    );
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async updateUser(id: number, currentUserId: number, updateData: UpdateUserDto): Promise<UserResponseDTO> {
    const user = await this.getUserById(id);
    if (user.id !== currentUserId) {
      throw new ForbiddenException(`You do not have permission to update this user`);
    }
    await user.update(updateData);
    return new UserResponseDTO(
      user.id,
      user.name,
      user.picture,
      user.linktree,
      true 
    );
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.getUserById(id);
    await user.destroy();
  }
}