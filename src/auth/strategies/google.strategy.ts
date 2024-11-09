import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService,
              private readonly authService: AuthService
  ) {
    super({
      clientID: configService.get<string>('auth.client_id'),
      clientSecret: configService.get<string>('auth.client_secret'),
      callbackURL: configService.get<string>('auth.client_redirect'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    try {
      const user = await this.authService.validateUser(profile);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}
