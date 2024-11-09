import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { User } from 'src/user/model/user.model';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    constructor(private readonly userService: UserService){}

    async validateUser(profile: any): Promise<User> {
        const { name, emails, photos } = profile;
        let user = await this.userService.findUserByEmail(emails[0].value);
        if(!user){
            user = await this.userService.createUser(`${name.givenName} ${name.familyName}`, emails[0].value, photos[0].value);
        }
        return user.toJSON();
    }
}