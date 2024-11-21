import { Column, Model, Table, PrimaryKey, AutoIncrement, Unique, HasMany, HasOne } from 'sequelize-typescript';
import { RefreshToken } from 'src/auth/models/refreshToken.model';
import { Like } from 'src/like/models/like.model';
import { Post } from 'src/post/models/post.model';

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

  @Column({
    defaultValue: null
  })
  linktree: string;

  @HasMany(() => Post)
  posts: Post[];

  @HasOne(() => RefreshToken)
  refreshToken: RefreshToken;

  @HasMany(() => Like)
  likes: Like[];
}