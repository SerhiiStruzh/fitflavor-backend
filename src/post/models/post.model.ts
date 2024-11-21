import { Column, DataType, Model, Table, ForeignKey, PrimaryKey, AutoIncrement, AllowNull, BelongsTo, HasMany } from 'sequelize-typescript';
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

    @BelongsTo(() => User)
    user: User

    @HasMany(() => Like)
    likes: Like[];
}