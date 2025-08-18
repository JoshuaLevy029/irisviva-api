import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/typeorm.config';
import { BullModule } from '@nestjs/bull';
import { BullConfig } from 'src/bull.config';
import { HttpModule } from '@nestjs/axios';
import servicesConfig from 'src/config/services.config';
import modelsConfig from 'src/config/models.config';
import observersConfig from 'src/config/observers.config';
import entititesConfig from 'src/config/entitites.config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from 'src/auth/local.strategy';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { ScheduleModule } from '@nestjs/schedule';
import { RefreshTokenStrategy } from 'src/auth/refreshToken.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import controllersConfig from 'src/config/controllers.config';
import { MailConfig } from 'src/mail.config';
import rulesConfig from './config/rules.config';
import consumersConfig from './config/consumers.config';
import gatewaysConfig from './config/gateways.config';
import jobsConfig from './config/jobs.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? null,
        signOptions: { expiresIn: '15d' },
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        typeOrmConfig(configService),
    }),
    TypeOrmModule.forFeature(entititesConfig),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => MailConfig(configService),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService) => BullConfig(configService),
    }),
    ...jobsConfig,
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [
    ...controllersConfig,
  ],
  providers: [
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
    ...servicesConfig,
    ...modelsConfig,
    ...observersConfig,
    ...rulesConfig,
    ...consumersConfig,
    ...gatewaysConfig,
  ],
  exports: [...servicesConfig, ...modelsConfig],
})
export class AppModule {}
