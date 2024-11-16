import { Column, ForeignKey, Table, Model, BelongsTo } from "sequelize-typescript";
import { User } from "src/user/models/user.model";

@Table
export class RefreshToken extends Model<RefreshToken>{

    @ForeignKey(() => User)
    @Column
    userId: number;

    @Column
    refreshTokenHash: string
    
    @BelongsTo(() => User)
    user: User;
}