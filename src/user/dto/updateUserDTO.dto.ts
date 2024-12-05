import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(20, { message: "Name must be at most 20 characters long." })
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200, { message: "Linktree must be at most 200 characters long." })
    @Matches(/^(https?:\/\/)?(www\.)?linktr\.ee\/[A-Za-z0-9_-]+$/, { 
        message: "Linktree must be a valid Linktree URL." 
    })
    linktree?: string;
}