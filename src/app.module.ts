import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import configuration from './configs/config.config';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true
        }),
        SequelizeModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
              dialect: 'postgres',
              host: configService.get<string>('database.host'),
              port: configService.get<number>('database.port'),
              username: configService.get<string>('database.username'), 
              password: configService.get<string>('database.password'),
              database: configService.get<string>('database.database'),
              autoLoadModels: true,
              synchronize: true,
            }),
            inject: [ConfigService],
          }),
        AuthModule
    ]
})
export class AppModule {}
