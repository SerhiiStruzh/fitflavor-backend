import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UpdateUserDto } from './dto/updateUserDTO.dto';

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

  async findUserById(id: number): Promise<User> {
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

  async updateUser(id: number, updateData: UpdateUserDto): Promise<User> {
    const user = await this.findUserById(id);
    await user.update(updateData);
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findUserById(id);
    await user.destroy();
  }
}