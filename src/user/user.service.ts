import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './model/user.model';

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
    return this.userModel.findOne({where: {email}});
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findUserById(id);
    await user.update(updateData);
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findUserById(id);
    await user.destroy();
  }
}