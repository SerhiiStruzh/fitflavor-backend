import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Post } from "./models/post.model";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        SequelizeModule.forFeature([Post]),
        AuthModule
    ],
    controllers: [PostController],
    providers: [PostService]
})
export class PostModule{}