import { AllowNull, AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Post } from "src/post/models/post.model";
import { User } from "src/user/models/user.model";

@Table
export class Like extends Model<Like>{
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column
    userId: number;

    @AllowNull(false)
    @ForeignKey(() => Post)
    @Column
    postId: number;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Post)
    post: Post;
}