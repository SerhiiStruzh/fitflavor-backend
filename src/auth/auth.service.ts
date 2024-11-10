import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/model/user.model';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    constructor(private readonly userService: UserService,
                private readonly jwtService: JwtService,
                private readonly configService: ConfigService
    ){}

    async validateUser(profile: any): Promise<User> {
        const { name, emails, photos } = profile;
        let user = await this.userService.findUserByEmail(emails[0].value);
        if(!user){
            user = await this.userService.createUser(`${name.givenName} ${name.familyName}`, emails[0].value, photos[0].value);
        }
        return user.toJSON();
    }

    async generateAccessToken(userId: string) {
        return this.jwtService.signAsync({ userId });
      }
    
    async generateRefreshToken(userId: string) {
    return this.jwtService.signAsync(
        { userId },
        { secret: this.configService.get<string>('jwt.refresh_secret'), 
          expiresIn: this.configService.get<string>('jwt.refresh_expiration') }
    );
    }

    async verifyRefreshToken(token: string) {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('jwt.refresh_secret'),
            });
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}