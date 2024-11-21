import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Like } from "./models/like.model";
import { LikeController } from "./like.controller";
import { LikeService } from "./like.service";

@Module({
    imports: [ SequelizeModule.forFeature([Like]),
               
    ],
    controllers: [LikeController],
    providers: [LikeService]
})
export class LikeModule{}