import { Column, DataType, Model, Table, ForeignKey, PrimaryKey, AutoIncrement, AllowNull, BelongsTo, HasMany } from 'sequelize-typescript';
import { Comment } from 'src/comment/models/comment.model';
import { Like } from 'src/like/models/like.model';
import { User } from 'src/user/models/user.model';

@Table
export class Post extends Model<Post> {

    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @AllowNull(false)
    @Column
    title: string;

    @AllowNull(false)
    @Column({
        type: DataType.TEXT,
    })
    body: string;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @Column({
        type: DataType.TSVECTOR,
        allowNull: true,
    })
    search_vector: string;

    @BelongsTo(() => User)
    user: User

    @HasMany(() => Like, { onDelete: 'CASCADE' })
    likes: Like[];

    @HasMany(() => Comment, { onDelete: 'CASCADE' })
    comments: Comment[];
}