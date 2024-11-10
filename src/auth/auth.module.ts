import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccessTokenStrategy } from './strategies/access-token.strategy';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.access_secret'),
        signOptions: { expiresIn: config.get<string>('jwt.access_expiration') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [GoogleStrategy, AuthService, AccessTokenStrategy],
})
export class AuthModule {}
