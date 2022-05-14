import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { AppController } from './app.controller';
import { appConfig } from './config/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        ({
          name: 'postgres',
          type: 'postgres',
          host: configService.get('database.host'),
          port: configService.get<number>('database.port'),
          database: configService.get('database.dbname'),
          username: configService.get('database.username'),
          password: configService.get('database.password'),
          logging: configService.get<Array<string>>('database.logLevel'),
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: true,
        } as PostgresConnectionOptions),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
