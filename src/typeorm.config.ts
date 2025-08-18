import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST') ?? '127.0.0.1',
  port: configService.get<number>('DB_PORT') ?? 5432,
  username: configService.get<string>('DB_USERNAME') ?? 'root',
  password: configService.get<string>('DB_PASSWORD') ?? 'root',
  database: configService.get<string>('DB_DATABASE') ?? 'yrius',
  entities: ['dist/entities/**/*.entity{.ts,.js}'],
  synchronize: configService.get<boolean>('DB_SYNC') ?? false,
  logging: (configService.get('NODE_ENV') ?? 'local') === 'local' ? false : false, 
});
