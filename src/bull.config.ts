import { BullRootModuleOptions } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

export const BullConfig = (
  configService: ConfigService,
): BullRootModuleOptions => ({
  redis: {
    host: configService.get<string>('REDIS_HOST') ?? '000000000',
    port: parseInt(`${configService.get<number>('REDIS_PORT') ?? 6379}`),
    username: configService.get<string>('REDIS_USERNAME') ?? 'default',
    password: configService.get<string>('REDIS_PASSWORD') ?? '000000000',
    db: parseInt(`${configService.get<number>('REDIS_DB') ?? 0}`),
    keyPrefix: configService.get<string>('REDIS_PREFIX') ?? '',
  },
  prefix: 'bull',
});
