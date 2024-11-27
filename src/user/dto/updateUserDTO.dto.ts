import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    picture?: string;

    @IsOptional()
    @IsString()
    linktree?: string;
}