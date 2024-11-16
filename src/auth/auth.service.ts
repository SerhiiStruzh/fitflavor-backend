// import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
// import { InjectModel } from '@nestjs/sequelize';
// import { User } from 'src/user/models/user.model';
// import { UserService } from 'src/user/user.service';
// import { RefreshToken } from './models/refreshToken.model';
// import * as bcrypt from 'bcrypt';
// import { where } from 'sequelize';

// @Injectable()
// export class AuthService {

//     constructor(private readonly userService: UserService,
//                 private readonly jwtService: JwtService,
//                 private readonly configService: ConfigService,
//                 @InjectModel(RefreshToken)
//                 private refreshTokenModel: typeof RefreshToken,
//     ){}

//     async validateUser(profile: any): Promise<User> {
//         const { name, emails, photos } = profile;
//         let user;
//         try{
//             user = await this.userService.findUserByEmail(emails[0].value);
//         }catch (error){
//             if(error instanceof NotFoundException) {
//                 user = await this.userService.createUser(`${name.givenName} ${name.familyName}`, emails[0].value, photos[0].value);
//             }
//             throw error;
//         }
//         return user.toJSON();
//     }

//     async generateAccessToken(userId: string) {
//         return this.jwtService.signAsync({ userId });
//       }
    
//     async generateRefreshToken(userId: string) {
//     return this.jwtService.signAsync(
//         { userId },
//         { secret: this.configService.get<string>('jwt.refresh_secret'), 
//           expiresIn: this.configService.get<string>('jwt.refresh_expiration') }
//     );
//     }

//     async verifyRefreshToken(token: string) {
//         try {
//             return await this.jwtService.verifyAsync(token, {
//                 secret: this.configService.get<string>('jwt.refresh_secret'),
//             });
//         } catch (error) {
//             throw new UnauthorizedException('Invalid refresh token');
//         }
//     }

//     async handleAuth(res, userId) {
//         const accessToken = await this.generateAccessToken(userId);
//         const refreshToken = await this.generateRefreshToken(userId);
        
//         const saltRounds = 10;
//         const refreshTokenHash = await bcrypt.hash(refreshToken, saltRounds);

//         const oldRefreshToken = await this.refreshTokenModel.findOne({where: {userId}});
//         if(!oldRefreshToken){
//             await this.refreshTokenModel.create({userId, refreshTokenHash});
//         }else{
//             oldRefreshToken.refreshTokenHash = refreshTokenHash;
//             oldRefreshToken.save();
//         }

//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             secure: true,
//             sameSite: 'strict',
//             maxAge: 7 * 24 * 60 * 60 * 1000, 
//         });

//         return {accessToken: accessToken, refreshToken: refreshToken}
//     }

//     async handleRefresh(res, userId, refreshToken) {
//         const oldRefreshToken = await this.refreshTokenModel.findOne({where: {userId}})
//         if(!oldRefreshToken){
//             throw new NotFoundException(`User with id ${userId} not found`);
//         }
//         const match = await bcrypt.compare(refreshToken, oldRefreshToken.refreshTokenHash);
//         if(!match){
//             throw new UnauthorizedException('Invalid refresh token');
//         }
//         const saltRounds = 10;
//         oldRefreshToken.refreshTokenHash = await bcrypt.hash(refreshToken, saltRounds);
//         oldRefreshToken.save();
//         return await this.handleAuth(res, userId);
//     }
// }


import {
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { JwtService } from '@nestjs/jwt';
  import { InjectModel } from '@nestjs/sequelize';
  import { User } from 'src/user/models/user.model';
  import { UserService } from 'src/user/user.service';
  import { RefreshToken } from './models/refreshToken.model';
  import * as bcrypt from 'bcrypt';
  import { Response } from 'express';
  import { JwtPayload } from 'jsonwebtoken';
  
  @Injectable()
  export class AuthService {
    constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
      @InjectModel(RefreshToken)
      private refreshTokenModel: typeof RefreshToken,
    ) {}
  
    async validateUser(profile: {
      name: { givenName: string; familyName: string };
      emails: { value: string }[];
      photos: { value: string }[];
    }): Promise<User> {
      const { name, emails, photos } = profile;
      let user: User;
      try {
        user = await this.userService.findUserByEmail(emails[0].value);
      } catch (error) {
        if (error instanceof NotFoundException) {
          user = await this.userService.createUser(
            `${name.givenName} ${name.familyName}`,
            emails[0].value,
            photos[0].value,
          );
        } else {
          throw error;
        }
      }
      return user.toJSON();
    }
  
    async generateAccessToken(userId: string): Promise<string> {
      return this.jwtService.signAsync({ userId });
    }
  
    async generateRefreshToken(userId: string): Promise<string> {
      return this.jwtService.signAsync(
        { userId },
        {
          secret: this.configService.get<string>('jwt.refresh_secret'),
          expiresIn: this.configService.get<string>('jwt.refresh_expiration'),
        },
      );
    }
  
    async verifyRefreshToken(token: string): Promise<JwtPayload> {
      try {
        return await this.jwtService.verifyAsync<JwtPayload>(token, {
          secret: this.configService.get<string>('jwt.refresh_secret'),
        });
      } catch (error) {
        throw new UnauthorizedException('Invalid refresh token');
      }
    }
  
    async handleAuth(
      res: Response,
      userId,
    ): Promise<{ accessToken: string; refreshToken: string }> {
      const accessToken = await this.generateAccessToken(userId);
      const refreshToken = await this.generateRefreshToken(userId);
  
      const saltRounds = 10;
      const refreshTokenHash = await bcrypt.hash(refreshToken, saltRounds);
  
      const oldRefreshToken = await this.refreshTokenModel.findOne({
        where: { userId },
      });
  
      if (!oldRefreshToken) {
        await this.refreshTokenModel.create({ userId, refreshTokenHash });
      } else {
        oldRefreshToken.refreshTokenHash = refreshTokenHash;
        await oldRefreshToken.save();
      }
  
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
  
      return { accessToken, refreshToken };
    }
  
    async handleRefresh(
      res: Response,
      userId: string,
      refreshToken: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
      const oldRefreshToken = await this.refreshTokenModel.findOne({
        where: { userId },
      });
  
      if (!oldRefreshToken) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
  
      const match = await bcrypt.compare(refreshToken, oldRefreshToken.refreshTokenHash);
  
      if (!match) {
        throw new UnauthorizedException('Invalid refresh token');
      }
  
      const saltRounds = 10;
      oldRefreshToken.refreshTokenHash = await bcrypt.hash(refreshToken, saltRounds);
      await oldRefreshToken.save();
  
      return await this.handleAuth(res, userId);
    }
  }
  