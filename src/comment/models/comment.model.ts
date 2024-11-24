import {
    Table,
    Column,
    Model,
    ForeignKey,
    PrimaryKey,
    AutoIncrement,
    BelongsTo,
  } from 'sequelize-typescript';
  import { User } from 'src/user/models/user.model';
  import { Post } from 'src/post/models/post.model';
  
  @Table
  export class Comment extends Model<Comment> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;
  
    @ForeignKey(() => User)
    @Column
    userId: number;
  
    @ForeignKey(() => Post)
    @Column
    postId: number;

    @Column
    commentText: string
  
    @BelongsTo(() => User)
    user: User;
  
    @BelongsTo(() => Post)
    post: Post;
  }
  