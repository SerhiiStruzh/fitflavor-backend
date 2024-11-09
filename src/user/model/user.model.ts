import { Column, Model, Table, PrimaryKey, AutoIncrement, Unique } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Unique
  @Column
  email: string;

  @Column
  picture: string;
}